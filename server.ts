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
