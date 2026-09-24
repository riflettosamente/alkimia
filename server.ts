import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";
import { 
  KEY_ONTOLOGICAL_TOPICS, 
  buildOntologicalSystemPrompt,
  buildAnalyticalSystemPrompt,
  buildLiteraryEssaySystemPrompt,
  selectRandomVectorPair,
  selectDailyVectorPair
} from "./src/ai/ontologicalSystemPrompt";
import { 
  buildStep1AnalysisPrompt,
  buildStep2LiteraryEssayPrompt,
  buildSequentialInvestigationPrompt 
} from "./src/ai/speculativeInvestigationEngine";
import { CURRENT_EDITORIAL_CYCLE, CURRENT_SPECULATIVE_ESSAY } from "./src/data/mockEdition";
import { buildPhase1Decomposition } from "./src/data/canonicalDecompositions";
import { buildPhase2Collision } from "./src/data/canonicalCollisions";
import { buildPhase2LoopFiveDirections } from "./src/data/canonicalLoopFiveDirections";
import { buildPhase3FinalStrike } from "./src/data/canonicalFinalStrikes";

dotenv.config();

const app = express();
/**
 * Render (e la maggior parte dei PaaS) inietta la porta da esporre tramite `process.env.PORT`.
 * Il valore precedente era hardcoded a 3000: se il PaaS assegna una porta diversa, il bind
 * fallisce e il servizio risulta irraggiungibile. 3000 resta il fallback per lo sviluppo locale.
 */
const PORT = Number(process.env.PORT) || 3000;

/**
 * Timeout per singola chiamata verso un provider AI, in millisecondi.
 * Il saggio richiesto è di 1.200–1.800 parole: i modelli gratuiti impiegano spesso più di 60 s,
 * quindi un timeout troppo corto faceva abortire l'intera catena di fallback.
 */
const AI_REQUEST_TIMEOUT_MS = Number(process.env.AI_REQUEST_TIMEOUT_MS) || 180000;

/**
 * Pausa minima tra due tentativi di rigenerazione della stessa data solare dopo un fallimento.
 * Evita di bruciare i rate-limit del livello gratuito a ogni refresh del browser.
 */
const RETRY_COOLDOWN_MS = Number(process.env.AI_RETRY_COOLDOWN_MS) || 180000;

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

function isAgenticHarnessGated(model?: string | null): boolean {
  if (!model) return false;
  const lower = model.toLowerCase();
  return lower.startsWith("thinkingmachines/") || lower.includes("agentic-harness");
}

function getEffectiveOpenRouterModel(): string {
  const envModel = process.env.OPENROUTER_MODEL?.trim();
  if (envModel && !isAgenticHarnessGated(envModel)) {
    return envModel;
  }
  return "nex-agi/nex-n2.5-mini:free";
}

// Supporto per OpenRouter con lista di modelli di fallback
async function generateWithOpenRouter(systemPrompt: string, userPrompt: string): Promise<{ text: string; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY non configurata.");
  }
  const rawPreferredModel = process.env.OPENROUTER_MODEL?.trim();
  const candidateModels = [
    ...(rawPreferredModel && !isAgenticHarnessGated(rawPreferredModel) ? [rawPreferredModel] : []),
    "nex-agi/nex-n2.5-pro:free",
    "google/gemma-4-31b-it:free",
    "nex-agi/nex-n2.5-mini:free",
    "google/gemma-4-26b-a4b-it:free",
    "liquid/lfm-2.5-2.6b:free"
  ].filter(m => !isAgenticHarnessGated(m));
  // Deduplica preservando l'ordine
  const uniqueModels = Array.from(new Set(candidateModels));
  const appUrl = process.env.APP_URL || "https://alkimia.ai";

  const errors: string[] = [];

  for (const model of uniqueModels) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
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
          max_tokens: 8192
        })
      });

      if (!response.ok) {
        const errorBody = (await response.text()).slice(0, 400);

        // 403 su agentic harness: modello riservato ad harness agentici, passaggio immediato al successivo
        if (response.status === 403 && /agentic[-_ ]?harness/i.test(errorBody)) {
          console.info(`[OpenRouter] Modello ${model} riservato ad agentic harness (403): passaggio al modello successivo.`);
          errors.push(`${model}: riservato ad agentic harness (403)`);
          continue;
        }

        // 402: credito insufficiente. Nessuna utilità nel proseguire con altri modelli
        // a pagamento dello stesso provider.
        if (response.status === 402) {
          throw new Error(`OpenRouter 402 su ${model}: credito insufficiente — ${errorBody}`);
        }

        throw new Error(`OpenRouter error (${response.status}) su ${model}: ${errorBody}`);
      }

      const data: any = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error(`Nessun contenuto generato restituito da OpenRouter (${model}).`);
      }
      return { text, model };
    } catch (err: any) {
      const isAbort = err?.name === "TimeoutError" || err?.name === "AbortError";
      const reason = isAbort
        ? `timeout dopo ${Math.round(AI_REQUEST_TIMEOUT_MS / 1000)} s`
        : (err?.message || String(err));
      console.warn(`[OpenRouter] Modello ${model} non disponibile: ${reason}`);
      errors.push(`${model}: ${reason}`);
      continue;
    }
  }

  throw new Error(`Nessun modello OpenRouter ha risposto con successo. ${errors.join(" | ")}`);
}

// Supporto per Cloudflare Workers AI
async function generateWithCloudflare(systemPrompt: string, userPrompt: string): Promise<{ text: string; model: string }> {
  const apiKey = process.env.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!apiKey || !accountId) {
    throw new Error("CLOUDFLARE_API_KEY (o TOKEN) e CLOUDFLARE_ACCOUNT_ID non configurati.");
  }
  const preferredModel = process.env.CLOUDFLARE_MODEL;
  const candidateModels = Array.from(new Set([
    ...(preferredModel ? [preferredModel] : []),
    "@cf/meta/llama-3.1-70b-instruct",
    "@cf/meta/llama-3.1-8b-instruct",
    "@cf/meta/llama-3.2-3b-instruct"
  ]));

  let lastError = "";
  for (const model of candidateModels) {
    try {
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
        method: "POST",
        signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
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
        const errorBody = (await response.text()).slice(0, 400);
        lastError = `Cloudflare Workers AI error (${response.status}) su ${model}: ${errorBody}`;
        continue;
      }

      const data: any = await response.json();
      const text = data.result?.response || data.result?.text || data.result?.choices?.[0]?.message?.content;
      if (!text) {
        lastError = `Nessun contenuto generato restituito da Cloudflare Workers AI (${model}).`;
        continue;
      }
      return { text, model };
    } catch (err: any) {
      lastError = err?.message || String(err);
      continue;
    }
  }

  throw new Error(lastError || "Cloudflare Workers AI non disponibile.");
}

// Fallback Google Gemini
async function generateWithGemini(systemPrompt: string, userPrompt: string): Promise<{ text: string; model: string }> {
  const ai = getGenAI();
  // Il modello preferito può essere fissato via GEMINI_MODEL. I valori di default sono
  // entrambi effettivamente disponibili sulla Gemini API.
  const rawPreferredModel = process.env.GEMINI_MODEL?.trim();
  const preferredModel = rawPreferredModel && rawPreferredModel !== "default" ? rawPreferredModel : undefined;
  const candidateModels = Array.from(new Set([
    ...(preferredModel ? [preferredModel] : []),
    "gemini-3.6-flash",
    "gemini-3.1-pro-preview",
    "gemini-3.5-flash"
  ]));
  const errors: string[] = [];

  for (const modelName of candidateModels) {
    // `maxOutputTokens` è calibrato su un saggio di 1.200–1.800 parole. Se il modello lo
    // rifiuta (alcune versioni hanno un tetto più basso), si ritenta senza quel vincolo.
    for (const withTokenCap of [true, false]) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            temperature: 0.85,
            ...(withTokenCap ? { maxOutputTokens: 8192 } : {})
          }
        });
        if (response.text) {
          return { text: response.text, model: modelName };
        }
        throw new Error(`Risposta vuota da ${modelName}.`);
      } catch (err: any) {
        const message = err?.message || String(err);
        console.warn(`[Gemini] Tentativo con ${modelName} fallito (maxOutputTokens=${withTokenCap}): ${message}`);
        errors.push(`${modelName}: ${message.slice(0, 200)}`);
        // Se il modello non esiste o la chiave non è autorizzata, ripetere non serve.
        if (/404|not found|PERMISSION_DENIED|API key not valid|400/i.test(message)) break;
      }
    }
  }
  throw new Error(`Nessun modello Gemini ha risposto con successo. ${errors.join(" | ")}`);
}

/**
 * Catena di generazione con priorità configurabile.
 * - step: 'analysis' (Passo 1): privilegia OpenRouter/Cloudflare per preservare token.
 * - step: 'literary' (Passo 2): privilegia modelli ad altissima sensibilità morfosintattica
 *   italiana (Gemini 3.6 Flash / modelli LLM avanzati) per garantire un dizionario autentico ed eliminare neologismi spuri.
 */
async function runAiProviderChain(
  systemPrompt: string,
  userPrompt: string,
  options?: { step?: 'analysis' | 'literary' }
): Promise<
  | { ok: true; text: string; provider: 'openrouter' | 'cloudflare' | 'gemini'; model: string; attempts: string[] }
  | { ok: false; error: string; attempts: string[] }
> {
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  const hasCloudflare = Boolean(
    (process.env.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_TOKEN) && process.env.CLOUDFLARE_ACCOUNT_ID
  );
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  const attempts: string[] = [];
  const step = options?.step || 'analysis';

  // Per il Passo 2 (scrittura letteraria pura), Gemini viene posto al vertice per garantire
  // una prosa italiana nativa perfetta, con Cloudflare (Llama 3.1 70B) come secondo fallback immediato
  // e affidabile, prima di tentare con OpenRouter.
  const defaultChain: Array<{
    provider: 'openrouter' | 'cloudflare' | 'gemini';
    configured: boolean;
    run: () => Promise<{ text: string; model: string }>;
  }> = step === 'literary'
    ? [
        ...(hasGemini ? [{ provider: 'gemini' as const, configured: hasGemini, run: () => generateWithGemini(systemPrompt, userPrompt) }] : []),
        ...(hasCloudflare ? [{ provider: 'cloudflare' as const, configured: hasCloudflare, run: () => generateWithCloudflare(systemPrompt, userPrompt) }] : []),
        ...(hasOpenRouter ? [{ provider: 'openrouter' as const, configured: hasOpenRouter, run: () => generateWithOpenRouter(systemPrompt, userPrompt) }] : [])
      ]
    : [
        ...(hasCloudflare ? [{ provider: 'cloudflare' as const, configured: hasCloudflare, run: () => generateWithCloudflare(systemPrompt, userPrompt) }] : []),
        ...(hasOpenRouter ? [{ provider: 'openrouter' as const, configured: hasOpenRouter, run: () => generateWithOpenRouter(systemPrompt, userPrompt) }] : []),
        ...(hasGemini ? [{ provider: 'gemini' as const, configured: hasGemini, run: () => generateWithGemini(systemPrompt, userPrompt) }] : [])
      ];

  for (const entry of defaultChain) {
    if (!entry.configured) {
      attempts.push(`${entry.provider}: non configurato`);
      continue;
    }
    try {
      const res = await entry.run();
      return { ok: true, text: res.text, provider: entry.provider, model: res.model, attempts };
    } catch (err: any) {
      const message = err?.message || String(err);
      console.warn(`[ALKIMIA] Provider ${entry.provider} fallito: ${message}`);
      attempts.push(`${entry.provider}: ${message}`);
    }
  }

  const configuredAny = hasOpenRouter || hasCloudflare || hasGemini;
  const error = configuredAny
    ? `Nessun motore AI ha completato la generazione. ${attempts.join(" | ")}`
    : "Nessuna API KEY configurata tra OpenRouter, Cloudflare e Gemini.";
  return { ok: false, error, attempts };
}

function cleanAndParseJson(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  }

  // 1. Prova JSON.parse diretto
  try {
    return JSON.parse(cleaned);
  } catch {}

  // 2. Estrazione compresa tra prima '{' e ultima '}'
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const extracted = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(extracted);
    } catch {}

    // 3. Riparazione della porzione estratta con jsonrepair
    try {
      const repaired = jsonrepair(extracted);
      return JSON.parse(repaired);
    } catch {}
  }

  // 4. Riparazione sull'intero blocco con jsonrepair
  try {
    const repaired = jsonrepair(cleaned);
    return JSON.parse(repaired);
  } catch {}

  throw new Error("Impossibile decodificare il payload JSON restituito dal modello.");
}

// 1. Health check & AI Provider status
app.get("/api/health", (_req, res) => {
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  const hasCloudflare = Boolean(
    (process.env.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_TOKEN) && process.env.CLOUDFLARE_ACCOUNT_ID
  );
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  let activeProvider = "none";
  if (hasOpenRouter) activeProvider = "openrouter";
  else if (hasCloudflare) activeProvider = "cloudflare";
  else if (hasGemini) activeProvider = "gemini";

  // Espone anche lo stato della redazione odierna: permette di distinguere a colpo d'occhio
  // un servizio sano da uno che serve contenuto provvisorio perché l'AI sta fallendo.
  const todayKey = new Date().toISOString().split('T')[0];
  const todayEntry = dailyEditionsCache[todayKey];
  const generation = todayEntry ? describeGeneration(todayEntry) : null;

  res.json({ 
    status: "ok", 
    systemPromptStatus: "pronto_per_8_argomenti_chiave",
    activeProvider,
    configuredProviders: {
      openrouter: hasOpenRouter,
      cloudflare: hasCloudflare,
      gemini: hasGemini
    },
    todayEdition: {
      solarDateKey: todayKey,
      generation,
      retryCooldownMs: RETRY_COOLDOWN_MS,
      requestTimeoutMs: AI_REQUEST_TIMEOUT_MS
    },
    timestamp: new Date().toISOString()
  });
});

// 2. Consulta dei provider AI configurati
app.get("/api/ai-providers", (_req, res) => {
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  // Allineato con generateWithCloudflare, che accetta anche CLOUDFLARE_API_TOKEN.
  const hasCloudflare = Boolean(
    (process.env.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_TOKEN) && process.env.CLOUDFLARE_ACCOUNT_ID
  );
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
        model: getEffectiveOpenRouterModel(),
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

// 5. Generazione Autonoma a Due Passi (Passo 1: Analisi e Collisione -> Passo 2: Composizione Letteraria)
app.post("/api/generate-autonomous-essay", async (_req, res) => {
  try {
    const randomPair = selectRandomVectorPair();
    const selectedA = randomPair.vectorA;
    const selectedB = randomPair.vectorB;

    // Passo 1: Analisi e Collisione (Fasi 1, 2, 3, 4)
    const step1Prompt = buildStep1AnalysisPrompt(selectedA, selectedB);
    const step1SystemPrompt = buildAnalyticalSystemPrompt();

    const step1Res = await runAiProviderChain(step1SystemPrompt, step1Prompt);
    if (step1Res.ok === false) {
      throw new Error(`Passo 1 (Analisi) fallito: ${step1Res.error}`);
    }

    const parsedStep1 = cleanAndParseJson(step1Res.text);

    // Passo 2: Composizione Letteraria Pura (Fase 5: Saggio del Giorno)
    const step2Prompt = buildStep2LiteraryEssayPrompt(parsedStep1, selectedA, selectedB);
    const step2SystemPrompt = buildLiteraryEssaySystemPrompt();

    const step2Res = await runAiProviderChain(step2SystemPrompt, step2Prompt, { step: 'literary' });
    if (step2Res.ok === false) {
      throw new Error(`Passo 2 (Saggio Letterario) fallito: ${step2Res.error}`);
    }

    const parsedStep2 = cleanAndParseJson(step2Res.text);

    res.json({
      success: true,
      provider: step2Res.provider,
      model: step2Res.model,
      step1Provider: step1Res.provider,
      step1Model: step1Res.model,
      data: {
        systemPair: {
          vectorA: selectedA.name,
          vectorB: selectedB.name,
          syntheticVector: parsedStep1?.systemPair?.syntheticVector || `Collisione tra ${selectedA.name} e ${selectedB.name}`,
          ontologicalMatrix: parsedStep1?.systemPair?.ontologicalMatrix || "Matrice d'Attrito Ontologico"
        },
        phase1Decomposition: parsedStep1?.phase1Decomposition || buildPhase1Decomposition(selectedA.name, selectedB.name),
        phase2Collision: parsedStep1?.phase2Collision || buildPhase2Collision(selectedA.name, selectedB.name),
        phase2Loop: parsedStep1?.phase2Loop || buildPhase2LoopFiveDirections(selectedA.name, selectedB.name),
        phase3FinalStrike: parsedStep1?.phase3FinalStrike || buildPhase3FinalStrike(selectedA.name, selectedB.name),
        essay: parsedStep2.essay
      },
      selectedVectors: {
        vectorA: selectedA,
        vectorB: selectedB
      }
    });
  } catch (error: any) {
    console.error("Errore generazione autonoma a due passi:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Errore durante l'elaborazione a due passi del saggio speculativo." 
    });
  }
});

// Cache in memoria delle edizioni quotidiane per data solare (YYYY-MM-DD).
// Ogni voce distingue esplicitamente il contenuto definitivo da quello provvisorio.
interface DailyEditionEntry {
  solarDateKey: string;
  cycle: any;
  edition: any;
  status: 'generated' | 'generating' | 'failed' | 'placeholder';
  aiProvider: 'openrouter' | 'cloudflare' | 'gemini' | null;
  aiModel: string | null;
  error: string | null;
  attempts: number;
  startedAt: number | null;
  finishedAt: number | null;
}

const dailyEditionsCache: Record<string, DailyEditionEntry> = {};

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

/**
 * Applica ai campi di edition/cycle la data solare richiesta.
 * CURRENT_EDITORIAL_CYCLE viene valutato una sola volta al boot del processo: su un'istanza
 * che resta accesa per giorni manterrebbe altrimenti la data di avvio.
 */
function stampSolarDate(entry: DailyEditionEntry, solarDateKey: string): DailyEditionEntry {
  const formattedDate = formatItalianDateServer(solarDateKey);
  entry.cycle = { ...entry.cycle, cyclicalDate: formattedDate };
  entry.edition = {
    ...entry.edition,
    cycle: { ...entry.edition.cycle, cyclicalDate: formattedDate },
    systemPair: { ...entry.edition.systemPair, derivationTimestamp: formattedDate }
  };
  return entry;
}

/**
 * Riporta sull'edizione lo stato di redazione realmente raggiunto.
 *
 * L'edizione provvisoria nasce marcata `placeholder`; senza questa sincronizzazione un
 * fallimento della catena AI resterebbe visibile solo nel blocco `generation`, mentre
 * `edition.generationStatus` continuerebbe a dichiarare `placeholder`. Il client legge
 * entrambi i campi, quindi devono coincidere.
 */
function syncEditionWithEntry(entry: DailyEditionEntry): DailyEditionEntry {
  entry.edition = {
    ...entry.edition,
    aiProvider: entry.aiProvider,
    aiModel: entry.aiModel,
    generationStatus: entry.status,
    generationError: entry.error,
    generationAttempts: entry.attempts
  };
  return entry;
}

/** Riepilogo dello stato di redazione, esposto dagli endpoint di diagnostica. */
function describeGeneration(entry: DailyEditionEntry) {
  return {
    status: entry.status,
    aiProvider: entry.aiProvider,
    aiModel: entry.aiModel,
    error: entry.error,
    attempts: entry.attempts,
    startedAt: entry.startedAt ? new Date(entry.startedAt).toISOString() : null,
    finishedAt: entry.finishedAt ? new Date(entry.finishedAt).toISOString() : null
  };
}

// Generatore e gestore autonomo del Saggio del Giorno (Fase 1 + Fase 2 + Fase 3)
const inFlightDaily: Record<string, Promise<void>> = {};

/**
 * Redige il Saggio del Giorno per la data solare indicata usando la catena di provider.
 *
 * A differenza della versione precedente, il fallimento NON viene più inghiottito: viene
 * registrato nella cache come `status: 'failed'` con il motivo testuale, così il client può
 * mostrarlo e ritentare dopo il periodo di raffreddamento.
 */
function startDailyAiDrafting(solarDateKey: string, force = false): Promise<void> {
  const existing = inFlightDaily[solarDateKey];
  if (existing) return existing;

  const cached = dailyEditionsCache[solarDateKey];
  if (cached && cached.status === 'generated') return Promise.resolve();
  if (!force && cached && cached.status === 'generating') return Promise.resolve();

  const run = (async () => {
    if (cached) {
      cached.status = 'generating';
      cached.error = null;
      cached.startedAt = Date.now();
    }

    const formattedDate = formatItalianDateServer(solarDateKey);
    const pair = selectDailyVectorPair(solarDateKey);
    const selectedA = pair.vectorA;
    const selectedB = pair.vectorB;

    console.log(
      `[ALKIMIA] Avvio redazione a due passi del Saggio del Giorno ${solarDateKey} — ` +
      `Vettore A «${selectedA.name}» × Vettore B «${selectedB.name}».`
    );

    // =========================================================================
    // PASSO 1: Analisi e Collisione Ontologica (Fasi 1, 2, 3 e 4)
    // =========================================================================
    console.log(`[ALKIMIA] Passo 1: Analisi e collisione preliminare in corso...`);
    const step1Prompt = buildStep1AnalysisPrompt(selectedA, selectedB);
    const step1SystemPrompt = buildAnalyticalSystemPrompt();

    const step1Result = await runAiProviderChain(step1SystemPrompt, step1Prompt);

    const entry = dailyEditionsCache[solarDateKey];
    if (!entry) return;

    entry.attempts += 1;

    if (step1Result.ok === false) {
      entry.status = 'failed';
      entry.aiProvider = null;
      entry.aiModel = null;
      entry.error = `Passo 1 (Analisi) fallito: ${step1Result.error}`;
      entry.finishedAt = Date.now();
      console.error(`[ALKIMIA] ${entry.error}`);
      return;
    }

    let parsedStep1: any;
    try {
      parsedStep1 = cleanAndParseJson(step1Result.text);
    } catch (err: any) {
      entry.status = 'failed';
      entry.aiProvider = step1Result.provider;
      entry.aiModel = step1Result.model;
      entry.error = `Passo 1: Payload analitico non decodificabile da ${step1Result.provider}/${step1Result.model}: ${err.message || err}`;
      entry.finishedAt = Date.now();
      console.error(`[ALKIMIA] ${entry.error}`);
      return;
    }

    console.log(
      `[ALKIMIA] Passo 1 completato con successo via ${step1Result.provider} (${step1Result.model}). ` +
      `Avvio Passo 2 (Composizione Letteraria Pura - Fase 5)...`
    );

    // =========================================================================
    // PASSO 2: Composizione Letteraria Pura (Fase 5: Saggio del Giorno)
    // =========================================================================
    const step2Prompt = buildStep2LiteraryEssayPrompt(parsedStep1, selectedA, selectedB);
    const step2SystemPrompt = buildLiteraryEssaySystemPrompt();

    const step2Result = await runAiProviderChain(step2SystemPrompt, step2Prompt, { step: 'literary' });

    if (step2Result.ok === false) {
      entry.status = 'failed';
      entry.aiProvider = step1Result.provider;
      entry.aiModel = step1Result.model;
      entry.error = `Passo 2 (Saggio Letterario) fallito: ${step2Result.error}`;
      entry.finishedAt = Date.now();
      console.error(`[ALKIMIA] ${entry.error}`);
      return;
    }

    let parsedStep2: any;
    try {
      parsedStep2 = cleanAndParseJson(step2Result.text);
    } catch (err: any) {
      entry.status = 'failed';
      entry.aiProvider = step2Result.provider;
      entry.aiModel = step2Result.model;
      entry.error = `Passo 2: Payload saggio non decodificabile da ${step2Result.provider}/${step2Result.model}: ${err.message || err}`;
      entry.finishedAt = Date.now();
      console.error(`[ALKIMIA] ${entry.error}`);
      return;
    }

    if (!parsedStep2?.essay?.title) {
      entry.status = 'failed';
      entry.aiProvider = step2Result.provider;
      entry.aiModel = step2Result.model;
      entry.error =
        `Il modello ${step2Result.model} ha restituito un JSON privo di "essay.title": contenuto scartato.`;
      entry.finishedAt = Date.now();
      console.error(`[ALKIMIA] ${entry.error}`);
      return;
    }

    entry.finishedAt = Date.now();

    // Esito positivo: fusione organica di Passo 1 e Passo 2 nell'edizione completa
    entry.cycle = {
      ...CURRENT_EDITORIAL_CYCLE,
      cyclicalDate: formattedDate,
      nextScheduledPublication: "Al compimento della rotazione diurna"
    };
    entry.edition = {
      ...entry.edition,
      id: `edition-${solarDateKey}`,
      isLatest: true,
      cycle: { ...entry.cycle },
      systemPair: {
        vectorA: selectedA.name,
        vectorB: selectedB.name,
        syntheticVector:
          parsedStep1.systemPair?.syntheticVector ||
          `Collisione speculativa tra ${selectedA.name} e ${selectedB.name}`,
        ontologicalMatrix:
          parsedStep1.systemPair?.ontologicalMatrix || "Matrice d'Attrito Ontologico",
        derivationTimestamp: formattedDate
      },
      phase1Decomposition:
        parsedStep1.phase1Decomposition || buildPhase1Decomposition(selectedA.name, selectedB.name),
      phase2Collision: 
        parsedStep1.phase2Collision || buildPhase2Collision(selectedA.name, selectedB.name),
      phase2Loop: 
        parsedStep1.phase2Loop || buildPhase2LoopFiveDirections(selectedA.name, selectedB.name),
      phase3FinalStrike: 
        parsedStep1.phase3FinalStrike || buildPhase3FinalStrike(selectedA.name, selectedB.name),
      essay: parsedStep2.essay,
      pins: [],
      tensions: [],
      aiProvider: step2Result.provider,
      aiModel: step2Result.model,
      generationStatus: 'generated',
      generationError: null,
      generationAttempts: entry.attempts
    };
    entry.status = 'generated';
    entry.aiProvider = step2Result.provider;
    entry.aiModel = step2Result.model;
    entry.error = null;

    console.log(
      `[ALKIMIA] Saggio del Giorno ${formattedDate} redatto con successo a due passi: ` +
      `Passo 1 (${step1Result.provider}/${step1Result.model}) + Passo 2 (${step2Result.provider}/${step2Result.model}).`
    );
  })().finally(() => {
    delete inFlightDaily[solarDateKey];
  });

  inFlightDaily[solarDateKey] = run;
  return run;
}

async function getOrCreateDailyEdition(solarDateKey: string): Promise<DailyEditionEntry> {
  const cached = dailyEditionsCache[solarDateKey];

  if (cached) {
    // Saggio definitivo: nessuna rigenerazione.
    if (cached.status === 'generated') return stampSolarDate(syncEditionWithEntry(cached), solarDateKey);

    // Generazione in corso: il client continuerà a interrogare lo stato.
    if (cached.status === 'generating' && inFlightDaily[solarDateKey]) {
      return stampSolarDate(syncEditionWithEntry(cached), solarDateKey);
    }

    // Fallita: nuovo tentativo solo dopo il raffreddamento, per non saturare i rate-limit.
    if (cached.status === 'failed') {
      const elapsed = Date.now() - (cached.finishedAt || 0);
      if (elapsed >= RETRY_COOLDOWN_MS) {
        void startDailyAiDrafting(solarDateKey, true);
      }
      return stampSolarDate(syncEditionWithEntry(cached), solarDateKey);
    }
  }

  // Costruzione dell'edizione provvisoria, deterministica e allineata alla data solare.
  const formattedDate = formatItalianDateServer(solarDateKey);
  const pair = selectDailyVectorPair(solarDateKey);
  const selectedA = pair.vectorA;
  const selectedB = pair.vectorB;

  const cycle = {
    ...CURRENT_EDITORIAL_CYCLE,
    cyclicalDate: formattedDate,
    nextScheduledPublication: "Al compimento della rotazione diurna"
  };

  const provisionalEdition = {
    id: `edition-${solarDateKey}`,
    isLatest: true,
    cycle: { ...cycle },
    systemPair: {
      vectorA: selectedA.name,
      vectorB: selectedB.name,
      syntheticVector: `Collisione speculativa tra ${selectedA.name} e ${selectedB.name}`,
      ontologicalMatrix:
        "Soglia di fase tra l'entropia organica locale e la conservazione dell'informazione non-locale",
      derivationTimestamp: formattedDate
    },
    phase1Decomposition: buildPhase1Decomposition(selectedA.name, selectedB.name),
    phase2Collision: buildPhase2Collision(selectedA.name, selectedB.name),
    phase2Loop: buildPhase2LoopFiveDirections(selectedA.name, selectedB.name),
    phase3FinalStrike: buildPhase3FinalStrike(selectedA.name, selectedB.name),
    essay: CURRENT_SPECULATIVE_ESSAY,
    pins: [],
    tensions: [],
    // Il contenuto è il ripiego canonico locale, NON il prodotto di un provider AI:
    // dichiarare "openrouter" qui era fuorviante e mascherava i fallimenti.
    aiProvider: null,
    aiModel: null,
    generationStatus: 'placeholder',
    generationError: null,
    generationAttempts: 0
  };

  const entry: DailyEditionEntry = {
    solarDateKey,
    cycle,
    edition: provisionalEdition,
    status: 'placeholder',
    aiProvider: null,
    aiModel: null,
    error: null,
    attempts: 0,
    startedAt: null,
    finishedAt: null
  };

  dailyEditionsCache[solarDateKey] = entry;

  // La redazione parte in background: la risposta resta immediata, ma il client ora sa che il
  // contenuto è provvisorio e torna a chiedere lo stato fino alla conclusione.
  void startDailyAiDrafting(solarDateKey);

  return stampSolarDate(syncEditionWithEntry(entry), solarDateKey);
}

// 6. Endpoint Saggio del Giorno: restituisce il saggio garantendo l'assoluta uguaglianza tra data di emissione e saggio
app.get("/api/daily-edition", async (req, res) => {
  try {
    const solarDateKey =
      typeof req.query.solarDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.query.solarDate)
        ? req.query.solarDate
        : new Date().toISOString().split('T')[0];

    const entry = await getOrCreateDailyEdition(solarDateKey);
    res.json({
      success: true,
      solarDateKey,
      cycle: entry.cycle,
      edition: entry.edition,
      generation: describeGeneration(entry)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6b. Stato della redazione in corso: il client lo interroga finché il saggio è provvisorio.
app.get("/api/daily-edition/status", async (req, res) => {
  try {
    const solarDateKey =
      typeof req.query.solarDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.query.solarDate)
        ? req.query.solarDate
        : new Date().toISOString().split('T')[0];

    const entry = dailyEditionsCache[solarDateKey];
    if (!entry) {
      res.json({ success: true, solarDateKey, exists: false, generation: null });
      return;
    }
    res.json({
      success: true,
      solarDateKey,
      exists: true,
      generation: describeGeneration(entry)
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6c. Rigenerazione esplicita del Saggio del Giorno (diagnostica e ripristino manuale).
app.post("/api/daily-edition/regenerate", async (req, res) => {
  try {
    const bodyDate = typeof req.body?.solarDate === 'string' ? req.body.solarDate : undefined;
    const solarDateKey =
      bodyDate && /^\d{4}-\d{2}-\d{2}$/.test(bodyDate)
        ? bodyDate
        : new Date().toISOString().split('T')[0];

    await getOrCreateDailyEdition(solarDateKey);
    const promise = startDailyAiDrafting(solarDateKey, req.body?.force === true);

    if (req.body?.wait === true) {
      await promise;
      const entry = dailyEditionsCache[solarDateKey];
      res.json({
        success: entry?.status === 'generated',
        solarDateKey,
        generation: entry ? describeGeneration(entry) : null,
        edition: entry?.edition ?? null,
        cycle: entry?.cycle ?? null
      });
      return;
    }

    res.json({ success: true, solarDateKey, started: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger automatico di rotazione solare alle ore 00:00 UTC.
// Nota: su un piano che manda l'istanza in sleep questo timer non è affidabile; il ripristino
// avviene comunque al primo risveglio grazie al warm-up in `startServer` e al polling del client.
let lastMonitoredSolarKey = new Date().toISOString().split('T')[0];
setInterval(async () => {
  const currentKey = new Date().toISOString().split('T')[0];
  if (currentKey !== lastMonitoredSolarKey) {
    lastMonitoredSolarKey = currentKey;
    console.log(
      `[ALKIMIA 00:00] Transizione alla data ${currentKey}. Elaborazione automatica nuovo Saggio del Giorno in corso...`
    );
    try {
      await getOrCreateDailyEdition(currentKey);
      const drafting = startDailyAiDrafting(currentKey, true);
      await drafting;
      const entry = dailyEditionsCache[currentKey];
      if (entry?.status === 'generated') {
        console.log(`[ALKIMIA 00:00] Nuovo Saggio del Giorno per ${currentKey} redatto con successo.`);
      } else {
        console.error(
          `[ALKIMIA 00:00] Saggio del Giorno per ${currentKey} NON redatto: ${entry?.error || 'stato ' + entry?.status}. ` +
          `Verrà ritentato automaticamente alla prossima richiesta.`
        );
      }
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
    app.get("*", (req, res, next) => {
      // Non mascherare mai un errore API restituendo l'HTML dell'SPA.
      if (req.path.startsWith("/api/")) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Motore Ontologico in esecuzione su http://0.0.0.0:${PORT}`);
  });

  // Warm-up: la cache è solo in memoria, quindi a ogni riavvio (deploy, crash o risveglio
  // dallo spin-down) il Saggio del Giorno andrebbe perso. Lo si ripristina subito all'avvio
  // invece di attendere la prima richiesta dell'utente.
  const todayKey = new Date().toISOString().split('T')[0];
  lastMonitoredSolarKey = todayKey;
  try {
    await getOrCreateDailyEdition(todayKey);
    console.log(`[ALKIMIA] Warm-up completato: redazione del Saggio del Giorno ${todayKey} avviata.`);
  } catch (err: any) {
    console.error(`[ALKIMIA] Warm-up fallito per ${todayKey}:`, err.message || err);
  }
}

startServer();
