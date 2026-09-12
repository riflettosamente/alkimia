import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { 
  KEY_ONTOLOGICAL_TOPICS, 
  buildOntologicalSystemPrompt,
  selectRandomVectorPair,
  selectDailyVectorPair
} from "./src/ai/ontologicalSystemPrompt";
import { buildSequentialInvestigationPrompt } from "./src/ai/speculativeInvestigationEngine";
import { CURRENT_EDITORIAL_CYCLE, CURRENT_SPECULATIVE_ESSAY } from "./src/data/mockEdition";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY non configurata nell'ambiente.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Supporto per OpenRouter
async function generateWithOpenRouter(systemPrompt: string, userPrompt: string): Promise<{ text: string; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY non configurata.");
  }
  const model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct";
  const appUrl = process.env.APP_URL || "https://alkimia.ai";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(60000),
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": appUrl,
      "X-Title": "ALKIMIA",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.85,
      max_tokens: 8192,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenRouter error (${response.status}): ${errorBody}`);
  }

  const data: any = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Nessun contenuto generato restituito da OpenRouter.");
  }
  return { text, model };
}

// Supporto per Cloudflare Workers AI
async function generateWithCloudflare(systemPrompt: string, userPrompt: string): Promise<{ text: string; model: string }> {
  const apiKey = process.env.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!apiKey || !accountId) {
    throw new Error("CLOUDFLARE_API_KEY (o TOKEN) e CLOUDFLARE_ACCOUNT_ID non configurati.");
  }
  const model = process.env.CLOUDFLARE_MODEL || "@cf/meta/llama-3.3-70b-instruct";

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
    method: "POST",
    signal: AbortSignal.timeout(60000),
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.85,
      max_tokens: 8192
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cloudflare Workers AI error (${response.status}): ${errorBody}`);
  }

  const data: any = await response.json();
  const text = data.result?.response || data.result?.text;
  if (!text) {
    throw new Error("Nessun contenuto generato restituito da Cloudflare Workers AI.");
  }
  return { text, model };
}

// Fallback Google Gemini
async function generateWithGemini(systemPrompt: string, userPrompt: string): Promise<{ text: string; model: string }> {
  const ai = getGenAI();
  const candidateModels = ["gemini-3.6-flash", "gemini-3.1-pro-preview"];
  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.85,
          maxOutputTokens: 8192
        }
      });
      if (response.text) {
        return { text: response.text, model: modelName };
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Tentativo con ${modelName} fallito:`, err.message || err);
    }
  }
  throw lastError || new Error("Nessun modello Gemini ha risposto con successo.");
}

function cleanAndParseJson(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(extracted);
    }
    throw new Error("Impossibile decodificare il payload JSON restituito dal modello.");
  }
}

// 1. Health check & AI Provider status
app.get("/api/health", (_req, res) => {
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  const hasCloudflare = Boolean(process.env.CLOUDFLARE_API_KEY && process.env.CLOUDFLARE_ACCOUNT_ID);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  let activeProvider = "none";
  if (hasOpenRouter) activeProvider = "openrouter";
  else if (hasCloudflare) activeProvider = "cloudflare";
  else if (hasGemini) activeProvider = "gemini";

  res.json({ 
    status: "ok", 
    systemPromptStatus: "pronto_per_8_argomenti_chiave",
    activeProvider,
    configuredProviders: {
      openrouter: hasOpenRouter,
      cloudflare: hasCloudflare,
      gemini: hasGemini
    },
    timestamp: new Date().toISOString()
  });
});

// 2. Consulta dei provider AI configurati
app.get("/api/ai-providers", (_req, res) => {
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  const hasCloudflare = Boolean(process.env.CLOUDFLARE_API_KEY && process.env.CLOUDFLARE_ACCOUNT_ID);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  let activeProvider = "none";
  if (hasOpenRouter) activeProvider = "openrouter";
  else if (hasCloudflare) activeProvider = "cloudflare";
  else if (hasGemini) activeProvider = "gemini";

  res.json({
    activeProvider,
    providers: {
      openrouter: {
        configured: hasOpenRouter,
        model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct",
        isPrimary: true
      },
      cloudflare: {
        configured: hasCloudflare,
        model: process.env.CLOUDFLARE_MODEL || "@cf/meta/llama-3.3-70b-instruct",
        hasAccountId: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID),
        isSecondary: true
      },
      gemini: {
        configured: hasGemini,
        fallbackOnly: true
      }
    }
  });
});

// 3. Consulta degli 8 vettori ontologici
app.get("/api/topics", (_req, res) => {
  res.json({
    count: Object.keys(KEY_ONTOLOGICAL_TOPICS).length,
    topics: Object.values(KEY_ONTOLOGICAL_TOPICS)
  });
});

// 4. Estrazione automatica e casuale di due vettori distinti (Vettore A e Vettore B)
app.get("/api/select-vector-pair", (req, res) => {
  const solarDate = typeof req.query.solarDate === 'string' ? req.query.solarDate : undefined;
  const pair = solarDate ? selectDailyVectorPair(solarDate) : selectRandomVectorPair();
  res.json({
    vectorA: pair.vectorA,
    vectorB: pair.vectorB
  });
});

// 5. Generazione Autonoma con priorità OpenRouter e Cloudflare (per preservare i token di Google Gemini)
app.post("/api/generate-autonomous-essay", async (req, res) => {
  try {
    // Selezione automatica e casuale di due argomenti differenti attingendo esclusivamente dai nostri 8 vettori
    const randomPair = selectRandomVectorPair();
    const selectedA = randomPair.vectorA;
    const selectedB = randomPair.vectorB;

    const prompt = buildSequentialInvestigationPrompt(selectedA, selectedB);
    const systemPrompt = buildOntologicalSystemPrompt();

    const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
    const hasCloudflare = Boolean(process.env.CLOUDFLARE_API_KEY && process.env.CLOUDFLARE_ACCOUNT_ID);
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);

    let generationResult: { text: string; model: string; provider: string } | null = null;
    let providerErrorLog: string[] = [];

    // 1. PRIORITÀ ASSOLUTA: OpenRouter (evita di toccare i token di Google Gemini)
    if (hasOpenRouter) {
      try {
        const openrouterRes = await generateWithOpenRouter(systemPrompt, prompt);
        generationResult = { ...openrouterRes, provider: "openrouter" };
      } catch (err: any) {
        console.warn("Tentativo con OpenRouter fallito:", err.message || err);
        providerErrorLog.push(`OpenRouter: ${err.message}`);
      }
    }

    // 2. SECONDA PRIORITÀ: Cloudflare Workers AI
    if (!generationResult && hasCloudflare) {
      try {
        const cloudflareRes = await generateWithCloudflare(systemPrompt, prompt);
        generationResult = { ...cloudflareRes, provider: "cloudflare" };
      } catch (err: any) {
        console.warn("Tentativo con Cloudflare fallito:", err.message || err);
        providerErrorLog.push(`Cloudflare: ${err.message}`);
      }
    }

    // 3. FALLBACK ULTIMO: Google Gemini (solo se OpenRouter e Cloudflare non sono configurati o falliti)
    if (!generationResult && hasGemini) {
      try {
        const geminiRes = await generateWithGemini(systemPrompt, prompt);
        generationResult = { ...geminiRes, provider: "gemini" };
      } catch (err: any) {
        console.warn("Tentativo con Gemini fallito:", err.message || err);
        providerErrorLog.push(`Gemini: ${err.message}`);
      }
    }

    if (!generationResult) {
      throw new Error(
        `Nessun motore AI ha completato la generazione. Errori: ${providerErrorLog.join("; ") || "Nessuna API KEY configurata tra OpenRouter, Cloudflare e Gemini."}`
      );
    }

    const parsedData = cleanAndParseJson(generationResult.text);

    res.json({
      success: true,
      provider: generationResult.provider,
      model: generationResult.model,
      data: parsedData,
      selectedVectors: {
        vectorA: selectedA,
        vectorB: selectedB
      }
    });
  } catch (error: any) {
    console.error("Errore generazione autonoma:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Errore durante l'elaborazione del saggio speculativo." 
    });
  }
});

// Cache in memoria delle edizioni quotidiane per data solare (YYYY-MM-DD)
const dailyEditionsCache: Record<string, { cycle: any; edition: any }> = {};

const ITALIAN_MONTHS_SERVER = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

function formatItalianDateServer(dateInput?: string | Date): string {
  let d: Date;
  if (!dateInput) {
    d = new Date();
  } else if (typeof dateInput === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const [year, month, day] = dateInput.split('-').map(Number);
      return `${day} ${ITALIAN_MONTHS_SERVER[month - 1]} ${year}`;
    }
    d = new Date(dateInput);
  } else {
    d = dateInput;
  }
  const day = d.getUTCDate();
  const month = ITALIAN_MONTHS_SERVER[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

// Generatore e gestore autonomo del Saggio del Giorno (Fase 1 + Fase 2 + Fase 3)
const isGeneratingDaily: Record<string, boolean> = {};

async function executeDailyAiDrafting(solarDateKey: string) {
  if (isGeneratingDaily[solarDateKey]) return;
  isGeneratingDaily[solarDateKey] = true;

  try {
    const formattedDate = formatItalianDateServer(solarDateKey);
    const pair = selectDailyVectorPair(solarDateKey);
    const selectedA = pair.vectorA;
    const selectedB = pair.vectorB;

    const prompt = buildSequentialInvestigationPrompt(selectedA, selectedB);
    const systemPrompt = buildOntologicalSystemPrompt();

    const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
    const hasCloudflare = Boolean(process.env.CLOUDFLARE_API_KEY && process.env.CLOUDFLARE_ACCOUNT_ID);
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);

    let rawText = "";

    // 1. Priorità OpenRouter
    if (hasOpenRouter) {
      try {
        console.log(`[ALKIMIA 00:00] Avvio elaborazione con OpenRouter per la data solare ${solarDateKey}...`);
        const res = await generateWithOpenRouter(systemPrompt, prompt);
        rawText = res.text;
        console.log(`[ALKIMIA 00:00] Generazione OpenRouter completata con successo per ${solarDateKey}.`);
      } catch (e: any) {
        console.warn(`[ALKIMIA 00:00] OpenRouter non riuscito per ${solarDateKey}:`, e.message);
      }
    }

    // 2. Priorità Cloudflare
    if (!rawText && hasCloudflare) {
      try {
        console.log(`[ALKIMIA 00:00] Avvio elaborazione con Cloudflare per la data solare ${solarDateKey}...`);
        const res = await generateWithCloudflare(systemPrompt, prompt);
        rawText = res.text;
        console.log(`[ALKIMIA 00:00] Generazione Cloudflare completata con successo per ${solarDateKey}.`);
      } catch (e: any) {
        console.warn(`[ALKIMIA 00:00] Cloudflare non riuscito per ${solarDateKey}:`, e.message);
      }
    }

    // 3. Fallback Gemini
    if (!rawText && hasGemini) {
      try {
        console.log(`[ALKIMIA 00:00] Avvio elaborazione fallback con Gemini per la data solare ${solarDateKey}...`);
        const res = await generateWithGemini(systemPrompt, prompt);
        rawText = res.text;
        console.log(`[ALKIMIA 00:00] Generazione Gemini completata con successo per ${solarDateKey}.`);
      } catch (e: any) {
        console.warn(`[ALKIMIA 00:00] Gemini non riuscito per ${solarDateKey}:`, e.message);
      }
    }

    if (rawText) {
      const parsed = cleanAndParseJson(rawText);
      if (parsed.essay && parsed.essay.title) {
        const cycle = {
          ...CURRENT_EDITORIAL_CYCLE,
          cyclicalDate: formattedDate,
          nextScheduledPublication: "Al compimento della rotazione diurna"
        };

        const edition = {
          id: `edition-${solarDateKey}`,
          isLatest: true,
          cycle: {
            ...cycle,
            cyclicalDate: formattedDate
          },
          systemPair: {
            vectorA: selectedA.name,
            vectorB: selectedB.name,
            syntheticVector: parsed.systemPair?.syntheticVector || `Collisione speculativa tra ${selectedA.name} e ${selectedB.name}`,
            ontologicalMatrix: parsed.systemPair?.ontologicalMatrix || "Matrice di Attrito Quantistico-Biologico",
            derivationTimestamp: formattedDate
          },
          essay: parsed.essay,
          pins: [],
          tensions: []
        };

        dailyEditionsCache[solarDateKey] = { cycle, edition };
        console.log(`[ALKIMIA 00:00] Nuovo Saggio del Giorno redatto e registrato per ${formattedDate}.`);
      }
    }
  } catch (err: any) {
    console.error(`[ALKIMIA 00:00] Errore durante l'elaborazione del saggio:`, err.message || err);
  } finally {
    isGeneratingDaily[solarDateKey] = false;
  }
}

async function getOrCreateDailyEdition(solarDateKey: string): Promise<{ cycle: any; edition: any }> {
  const formattedDate = formatItalianDateServer(solarDateKey);

  if (dailyEditionsCache[solarDateKey]) {
    const cached = dailyEditionsCache[solarDateKey];
    cached.cycle.cyclicalDate = formattedDate;
    cached.edition.cycle.cyclicalDate = formattedDate;
    cached.edition.systemPair.derivationTimestamp = formattedDate;
    return cached;
  }

  // Prepara immediatamente l'edizione calibrata con data sincronizzata
  const pair = selectDailyVectorPair(solarDateKey);
  const selectedA = pair.vectorA;
  const selectedB = pair.vectorB;

  const cycle = {
    ...CURRENT_EDITORIAL_CYCLE,
    cyclicalDate: formattedDate,
    nextScheduledPublication: "Al compimento della rotazione diurna"
  };

  const edition = {
    id: `edition-${solarDateKey}`,
    isLatest: true,
    cycle: {
      ...cycle,
      cyclicalDate: formattedDate
    },
    systemPair: {
      vectorA: selectedA.name,
      vectorB: selectedB.name,
      syntheticVector: `Collisione speculativa tra ${selectedA.name} e ${selectedB.name}`,
      ontologicalMatrix: "Soglia di fase tra l'entropia organica locale e la conservazione dell'informazione non-locale",
      derivationTimestamp: formattedDate
    },
    essay: CURRENT_SPECULATIVE_ESSAY,
    pins: [],
    tensions: []
  };

  dailyEditionsCache[solarDateKey] = { cycle, edition };

  // Avvia l'elaborazione AI in background se non già in corso
  executeDailyAiDrafting(solarDateKey);

  return dailyEditionsCache[solarDateKey];
}

// 6. Endpoint Saggio del Giorno: restituisce il saggio garantendo l'assoluta uguaglianza tra data di emissione e saggio
app.get("/api/daily-edition", async (req, res) => {
  try {
    const solarDateKey = typeof req.query.solarDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.query.solarDate)
      ? req.query.solarDate
      : new Date().toISOString().split('T')[0];

    const data = await getOrCreateDailyEdition(solarDateKey);
    res.json({
      success: true,
      solarDateKey,
      cycle: data.cycle,
      edition: data.edition
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger automatico di rotazione solare alle ore 00:00 UTC
let lastMonitoredSolarKey = new Date().toISOString().split('T')[0];
setInterval(async () => {
  const currentKey = new Date().toISOString().split('T')[0];
  if (currentKey !== lastMonitoredSolarKey) {
    lastMonitoredSolarKey = currentKey;
    console.log(`[ALKIMIA 00:00] Transizione alla data ${currentKey}. Elaborazione automatica nuovo Saggio del Giorno in corso...`);
    try {
      await getOrCreateDailyEdition(currentKey);
      console.log(`[ALKIMIA 00:00] Nuovo Saggio del Giorno per ${currentKey} redatto con successo.`);
    } catch (err: any) {
      console.error(`[ALKIMIA 00:00] Errore trigger automatico 00:00:`, err.message || err);
    }
  }
}, 30000);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Motore Ontologico in esecuzione su http://0.0.0.0:${PORT}`);
  });
}

startServer();
