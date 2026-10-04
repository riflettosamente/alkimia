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
  buildSequentialInvestigationPrompt,
  buildPhase1_5EmpiricalPrompt,
  buildStage1DecompositionPrompt,
  buildStage2EmpiricalPrompt,
  buildStage3CollisionPrompt,
  buildStage4LoopPrompt,
  buildStage5FinalStrikePrompt
} from "./src/ai/speculativeInvestigationEngine";
import { CURRENT_EDITORIAL_CYCLE, CURRENT_SPECULATIVE_ESSAY } from "./src/data/mockEdition";
import { buildPhase1Decomposition } from "./src/data/canonicalDecompositions";
import { buildPhase1EmpiricalArchive } from "./src/data/canonicalEmpiricalArchive";
import { buildPhase2Collision } from "./src/data/canonicalCollisions";
import { normalizePhase2Collision } from "./src/utils/phase2CollisionUtils";
import { buildPhase2LoopFiveDirections } from "./src/data/canonicalLoopFiveDirections";
import { normalizePhase2Loop } from "./src/utils/phase2LoopUtils";
import { buildPhase3FinalStrike } from "./src/data/canonicalFinalStrikes";
import { recordVectorExtraction } from "./src/server/vectorTracker";
import { saveDossierStep, readDossier } from "./src/server/dossierTracker";
import { fetchTopicWebContext } from "./src/server/webSearchService";

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

// Supporto per Groq (LPU Inference con modelli ad alte prestazioni: gpt-oss-120b, qwen3.8-27b)
let groqCachedModels: string[] | null = null;
let groqModelsCacheTime = 0;

async function getGroqActiveModels(apiKey: string): Promise<string[]> {
  const now = Date.now();
  if (groqCachedModels && (now - groqModelsCacheTime) < 5 * 60 * 1000) {
    return groqCachedModels;
  }
  const fallbackList = [
    "openai/gpt-oss-120b",
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b"
  ];
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { "Authorization": `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data: any = await res.json();
      if (Array.isArray(data.data)) {
        const chatModels = data.data
          .map((m: any) => m.id as string)
          .filter((id: string) => 
            !id.includes("whisper") && 
            !id.includes("guard") && 
            !id.includes("safeguard") &&
            !id.includes("orpheus")
          );
        // Ordina prioritizzando i modelli con maggiori parametri
        chatModels.sort((a: string, b: string) => {
          if (a.includes("120b")) return -1;
          if (b.includes("120b")) return 1;
          if (a.includes("70b")) return -1;
          if (b.includes("70b")) return 1;
          if (a.includes("27b")) return -1;
          if (b.includes("27b")) return 1;
          return 0;
        });
        groqCachedModels = Array.from(new Set([...chatModels, ...fallbackList]));
        groqModelsCacheTime = now;
        return groqCachedModels;
      }
    }
  } catch (e) {
    console.warn("[Groq] Impossibile recuperare lista dinamica modelli, uso lista statica.");
  }
  groqCachedModels = fallbackList;
  groqModelsCacheTime = now;
  return groqCachedModels;
}

async function generateWithGroq(systemPrompt: string, userPrompt: string, isJson: boolean = false): Promise<{ text: string; model: string }> {
  let apiKey = process.env.GROQ_API_KEY?.trim();
  const rawPreferredModel = process.env.GROQ_MODEL?.trim();

  // Se l'utente ha accidentalmente incollato la chiave API in GROQ_MODEL
  if (!apiKey && rawPreferredModel?.startsWith("gsk_")) {
    apiKey = rawPreferredModel;
  }
  if (!apiKey) {
    throw new Error("GROQ_API_KEY non configurata.");
  }

  // Ignora il modello se è in realtà una chiave gsk_
  const cleanPreferredModel = (rawPreferredModel && !rawPreferredModel.startsWith("gsk_"))
    ? rawPreferredModel
    : null;

  const activeModels = await getGroqActiveModels(apiKey);
  const candidateModels = Array.from(new Set([
    ...(cleanPreferredModel ? [cleanPreferredModel] : []),
    ...activeModels
  ]));

  const errors: string[] = [];

  for (const model of candidateModels) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.8,
          max_tokens: isJson ? 6000 : 4096,
          ...(isJson ? { response_format: { type: "json_object" } } : {})
        })
      });

      if (!response.ok) {
        const errorBody = (await response.text()).slice(0, 400);
        if (response.status === 429 || /rate_limit/i.test(errorBody)) {
          console.warn(`[Groq] Rate limit su ${model}: ${errorBody}. Passaggio al modello successivo...`);
          errors.push(`${model}: rate limit (${response.status})`);
          // Attesa breve prima di tentare il modello di fallback
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        throw new Error(`Groq error (${response.status}) su ${model}: ${errorBody}`);
      }

      const data: any = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error(`Nessun contenuto generato restituito da Groq (${model}).`);
      }
      return { text, model };
    } catch (err: any) {
      const isAbort = err?.name === "TimeoutError" || err?.name === "AbortError";
      const reason = isAbort
        ? `timeout dopo ${Math.round(AI_REQUEST_TIMEOUT_MS / 1000)} s`
        : (err?.message || String(err));
      console.warn(`[Groq] Modello ${model} non riuscito: ${reason}`);
      errors.push(`${model}: ${reason}`);
    }
  }

  throw new Error(`Nessun modello Groq ha risposto con successo. ${errors.join(" | ")}`);
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
    "gemini-3.8-flash",
    "gemini-3.6-flash",
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
        // Se il modello non esiste, la quota è esaurita (429) o non autorizzata, passare subito oltre senza sprecare tentativi
        if (/404|not found|PERMISSION_DENIED|API key not valid|400|429|RESOURCE_EXHAUSTED|quota/i.test(message)) break;
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
  options?: {
    step?: 'phase1' | 'phase1_5' | 'phase2' | 'phase3' | 'phase4' | 'phase5' | 'phase6' | 'analysis' | 'literary';
    excludeGemini?: boolean;
  }
): Promise<
  | { ok: true; text: string; provider: 'groq' | 'openrouter' | 'cloudflare' | 'gemini'; model: string; attempts: string[] }
  | { ok: false; error: string; attempts: string[] }
> {
  const hasGroq = Boolean(
    process.env.GROQ_API_KEY?.trim() ||
    (process.env.GROQ_MODEL?.trim() && process.env.GROQ_MODEL.trim().startsWith("gsk_"))
  );
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  const hasCloudflare = Boolean(
    (process.env.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_TOKEN) && process.env.CLOUDFLARE_ACCOUNT_ID
  );
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  const attempts: string[] = [];
  const step = options?.step || 'analysis';
  const isJson = true;

  const providers = {
    groq: { provider: 'groq' as const, configured: hasGroq, run: () => generateWithGroq(systemPrompt, userPrompt, isJson) },
    cloudflare: { provider: 'cloudflare' as const, configured: hasCloudflare, run: () => generateWithCloudflare(systemPrompt, userPrompt) },
    openrouter: { provider: 'openrouter' as const, configured: hasOpenRouter, run: () => generateWithOpenRouter(systemPrompt, userPrompt) },
    gemini: { provider: 'gemini' as const, configured: hasGemini, run: () => generateWithGemini(systemPrompt, userPrompt) }
  };

  // Orchestrazione Multi-LLM per le 6 Fasi (con Gemini rigorosamente in coda come ultimo fallback):
  // - Fase 1 (Scomposizione Strutturale): Groq -> Cloudflare -> OpenRouter -> Gemini
  // - Fase 2 (Archivio Empirico): Groq -> OpenRouter -> Cloudflare (Zero token Gemini)
  // - Fase 3 (La Collisione): OpenRouter -> Cloudflare -> Groq -> Gemini (Pensiero laterale + riposo quota Groq)
  // - Fase 4 (Loop a 5 Direzioni): Groq -> OpenRouter -> Cloudflare -> Gemini (JSON strutturato ad alta capienza)
  // - Fase 5 (L'Affondo Finale): Cloudflare -> OpenRouter -> Groq -> Gemini (Sintesi programmatica)
  // - Fase 6 (Saggio del Giorno): Groq -> OpenRouter -> Cloudflare -> Gemini (Prosa letteraria 1.200-1.800 parole in JSON garantito)
  let defaultChain = [providers.groq, providers.cloudflare, providers.openrouter, providers.gemini];

  if (step === 'phase1') {
    defaultChain = [providers.groq, providers.cloudflare, providers.openrouter, providers.gemini];
  } else if (step === 'phase2' || step === 'phase1_5') {
    defaultChain = [providers.groq, providers.openrouter, providers.cloudflare];
  } else if (step === 'phase3') {
    defaultChain = [providers.openrouter, providers.cloudflare, providers.groq, providers.gemini];
  } else if (step === 'phase4') {
    defaultChain = [providers.groq, providers.openrouter, providers.cloudflare, providers.gemini];
  } else if (step === 'phase5') {
    defaultChain = [providers.cloudflare, providers.openrouter, providers.groq, providers.gemini];
  } else if (step === 'phase6' || step === 'literary') {
    defaultChain = [providers.groq, providers.openrouter, providers.cloudflare, providers.gemini];
  }

  // Esclusione rigida di Gemini su richiesta esplicita
  if (options?.excludeGemini) {
    defaultChain = defaultChain.filter(entry => entry.provider !== 'gemini');
  }

  for (const entry of defaultChain) {
    if (!entry.configured) {
      attempts.push(`${entry.provider}: non configurato`);
      continue;
    }
    try {
      const res = await entry.run();
      if (step === 'phase6' || step === 'literary') {
        const parsedCheck = cleanAndParseJson(res.text);
        const normalizedCheck = extractNormalizedEssay(parsedCheck);
        if (!normalizedCheck || !normalizedCheck.title || normalizedCheck.narrativeParagraphs.length === 0) {
          throw new Error(`Payload Fase 6 incompleto da ${entry.provider}/${res.model} (titolo o paragrafi mancanti).`);
        }
      }
      return { ok: true, text: res.text, provider: entry.provider, model: res.model, attempts };
    } catch (err: any) {
      const message = err?.message || String(err);
      console.warn(`[ALKIMIA] Provider ${entry.provider} fallito (${step}): ${message}`);
      attempts.push(`${entry.provider}: ${message}`);
    }
  }

  const configuredAny = hasGroq || hasOpenRouter || hasCloudflare || hasGemini;
  const error = configuredAny
    ? `Nessun motore AI ha completato la generazione. ${attempts.join(" | ")}`
    : "Nessuna API KEY configurata tra Groq, OpenRouter, Cloudflare e Gemini.";
  return { ok: false, error, attempts };
}

function cleanAndParseJson(rawText: string): any {
  // Rimuove eventuali blocchi di ragionamento <think>...</think> (es. Qwen3, DeepSeek, Nex-AGI)
  let cleaned = rawText
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^[\s\S]*?<\/think>/gi, "")
    .trim();

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

function stripMarkdownBoldServer(text: unknown): string {
  if (typeof text === "string") {
    return text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
  }
  if (text && typeof text === "object") {
    const candidate = (text as any).text || (text as any).paragraph || (text as any).content || (text as any).statement || "";
    if (typeof candidate === "string") {
      return candidate.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    }
  }
  return "";
}

function extractNormalizedEssay(parsed: any, solarDateKey?: string): any | null {
  if (!parsed || typeof parsed !== "object") return null;
  const rawEssay = parsed.essay && typeof parsed.essay === "object" ? parsed.essay : parsed;

  const title = stripMarkdownBoldServer(rawEssay.title || rawEssay.titolo);
  const subtitle = stripMarkdownBoldServer(rawEssay.subtitle || rawEssay.sottotitolo);
  const ontologicalThesis = stripMarkdownBoldServer(
    rawEssay.ontologicalThesis || rawEssay.thesis || rawEssay.tesiOntologica || rawEssay.tesi
  );

  const rawNarrative =
    rawEssay.narrativeParagraphs ??
    rawEssay.paragraphs ??
    rawEssay.paragrafi ??
    rawEssay.body ??
    rawEssay.content ??
    rawEssay.testo;

  let narrativeParagraphs: string[] = [];
  if (Array.isArray(rawNarrative)) {
    narrativeParagraphs = rawNarrative.map(p => stripMarkdownBoldServer(p)).filter(Boolean);
  } else if (typeof rawNarrative === "string" && rawNarrative.trim().length > 0) {
    narrativeParagraphs = rawNarrative
      .split(/\n\s*\n/)
      .map(p => stripMarkdownBoldServer(p))
      .filter(Boolean);
  }

  if (!title || narrativeParagraphs.length === 0) {
    return null;
  }

  return {
    id: rawEssay.id || `saggio-${solarDateKey || new Date().toISOString().slice(0, 10)}`,
    cycleId: rawEssay.cycleId || `cycle-${solarDateKey || new Date().toISOString().slice(0, 10)}`,
    title,
    subtitle: subtitle || "Trattato sulla convergenza empirica e speculativa dei due domini d'indagine",
    ontologicalThesis:
      ontologicalThesis ||
      narrativeParagraphs[0],
    preamble: "",
    narrativeParagraphs,
    sections: [],
    corollaries: [],
    openAporias: [],
    bibliographicResonances: []
  };
}

function buildSynthesizedEssayFromDossier(
  step1Dossier: any,
  vectorAName: string,
  vectorBName: string,
  solarDateKey: string
): any {
  const clean = (s?: unknown) => stripMarkdownBoldServer(s);
  const vA = step1Dossier?.phase1Decomposition?.vectorA;
  const vB = step1Dossier?.phase1Decomposition?.vectorB;
  const empA = step1Dossier?.phase1EmpiricalArchive?.vectorA;
  const empB = step1Dossier?.phase1EmpiricalArchive?.vectorB;
  const empSyn = clean(step1Dossier?.phase1EmpiricalArchive?.crossArchiveSynthesis);
  const p2 = step1Dossier?.phase2Collision;
  const p3 = step1Dossier?.phase3FinalStrike;
  const tracks = Array.isArray(step1Dossier?.phase2Loop?.tracks) ? step1Dossier.phase2Loop.tracks : [];

  const title = clean(p2?.step4CommonMetaphor?.masterMetaphorTitle) || `La Soglia Condivisa tra ${vectorAName.replace(/^\d+\.\s*/, "")} e ${vectorBName.replace(/^\d+\.\s*/, "")}`;
  const subtitle = clean(step1Dossier?.systemPair?.syntheticVector) || `Indagine sulla convergenza tra ${vectorAName} e ${vectorBName}`;
  const ontologicalThesis =
    clean(p3?.dizzyingRevelation) ||
    clean(step1Dossier?.systemPair?.ontologicalMatrix) ||
    `La distinzione tra ${vectorAName} e ${vectorBName} si dissolve quando gli strumenti di misura e le testimonianze storiche vengono letti come espressioni di un unico campo d'informazione.`;

  const p1 = [
    clean(vA?.whenWhere),
    clean(empA?.foundationalTexts),
    clean(empA?.keyFiguresAndWitnesses),
    clean(vB?.whenWhere),
    clean(empB?.foundationalTexts),
    clean(empB?.keyFiguresAndWitnesses)
  ].filter(Boolean).join(" ");

  const p2Text = [
    clean(empA?.materialEvidenceAndTools),
    clean(empB?.materialEvidenceAndTools),
    clean(p2?.step1StrippingFunction?.functionalSynthesis),
    clean(p2?.step2BlindAxis?.boundaryA),
    clean(p2?.step2BlindAxis?.accessDoorToB),
    clean(p2?.step3InvertedDirection?.methodAAppliedToB),
    clean(p2?.step3InvertedDirection?.counterIntuitiveInsight)
  ].filter(Boolean).join(" ");

  const p3Text = [
    clean(step1Dossier?.phase2Loop?.theoreticalPreamble),
    ...tracks.map((t: any) => `${clean(t?.ontologicalAngle)} ${clean(t?.collision?.step3InvertedDirection?.counterIntuitiveInsight)}`.trim())
  ].filter(Boolean).join(" ");

  const p4Text = [
    clean(empA?.breakthroughTheories),
    clean(empB?.breakthroughTheories),
    clean(p3?.cuiProdest),
    clean(p3?.groundbreakingDiscovery),
    clean(p3?.uninvestigatedBias),
    clean(p3?.researchFocusIntersection)
  ].filter(Boolean).join(" ");

  const p5Text = [
    empSyn,
    clean(p2?.step4CommonMetaphor?.cosmologicalAnthropologicalGround),
    clean(p2?.step4CommonMetaphor?.unifyingVision),
    clean(p3?.dizzyingRevelation)
  ].filter(Boolean).join(" ");

  return {
    id: `saggio-${solarDateKey}`,
    cycleId: `cycle-${solarDateKey}`,
    title,
    subtitle,
    ontologicalThesis,
    preamble: "",
    narrativeParagraphs: [p1, p2Text, p3Text, p4Text, p5Text].filter(Boolean),
    sections: [],
    corollaries: [],
    openAporias: [],
    bibliographicResonances: []
  };
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

    recordVectorExtraction(
      new Date().toISOString().slice(0, 10),
      selectedA.name,
      selectedB.name,
      'manual_generation'
    );

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
        phase2Collision: normalizePhase2Collision(parsedStep1?.phase2Collision, selectedA.name, selectedB.name),
        phase2Loop: normalizePhase2Loop(parsedStep1?.phase2Loop, selectedA.name, selectedB.name),
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
  aiProvider: 'groq' | 'openrouter' | 'cloudflare' | 'gemini' | null;
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
  const vectorA = entry.edition?.systemPair?.vectorA || '';
  const vectorB = entry.edition?.systemPair?.vectorB || '';
  entry.edition = {
    ...entry.edition,
    phase2Collision: normalizePhase2Collision(entry.edition?.phase2Collision, vectorA, vectorB),
    phase2Loop: normalizePhase2Loop(entry.edition?.phase2Loop, vectorA, vectorB),
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
  if (!force && cached && cached.status === 'generated') return Promise.resolve();
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

    recordVectorExtraction(solarDateKey, selectedA.name, selectedB.name, 'daily_edition');

    console.log(
      `[ALKIMIA] Avvio redazione sequenziale in 6 Stadi del Saggio del Giorno ${solarDateKey} — ` +
      `Primo Argomento «${selectedA.name}» × Secondo Argomento «${selectedB.name}».`
    );

    const STAGE_PAUSE_MS = Number(process.env.STAGE_PAUSE_MS) || 6000;
    const waitBetweenStages = (stageNum: number) => {
      console.log(`[ALKIMIA] Pausa di consolidamento (${STAGE_PAUSE_MS / 1000}s) dopo Fase ${stageNum} — pagina /fase-${stageNum}.html salvata e aggiornata...`);
      return new Promise((r) => setTimeout(r, STAGE_PAUSE_MS));
    };

    const entry = dailyEditionsCache[solarDateKey];
    if (!entry) return;
    entry.attempts += 1;

    const analyticalSystemPrompt = buildAnalyticalSystemPrompt();
    const literarySystemPrompt = buildLiteraryEssaySystemPrompt();

    // =========================================================================
    // PRE-STADIO: Ricerca Web Live a Costo Zero (Wikipedia REST API)
    // =========================================================================
    console.log(
      `[ALKIMIA] Ricerca web live a costo zero (Wikipedia REST API) per: «${selectedA.name}» e «${selectedB.name}»...`
    );
    const [webA, webB] = await Promise.all([
      fetchTopicWebContext(selectedA.name),
      fetchTopicWebContext(selectedB.name)
    ]);
    saveDossierStep(solarDateKey, 'webSearchContext', { vectorA: webA, vectorB: webB });

    // =========================================================================
    // STADIO 1 -> FASE 1: Scomposizione Strutturale (/fase-1.html)
    // Provider primario: Groq -> Cloudflare -> OpenRouter -> Gemini
    // =========================================================================
    console.log(`[ALKIMIA] [Stadio 1/6] Redazione FASE 1 (Scomposizione Strutturale) in corso...`);
    const stage1Prompt = buildStage1DecompositionPrompt(selectedA, selectedB, webA.combinedContext, webB.combinedContext);
    const stage1Result = await runAiProviderChain(analyticalSystemPrompt, stage1Prompt, { step: 'phase1' });

    let currentSystemPair = {
      vectorA: selectedA.name,
      vectorB: selectedB.name,
      syntheticVector: `Collisione speculativa tra ${selectedA.name} e ${selectedB.name}`,
      ontologicalMatrix: "Matrice d'Attrito Ontologico",
      derivationTimestamp: formattedDate
    };
    let currentDecomposition = buildPhase1Decomposition(selectedA.name, selectedB.name);

    if (stage1Result.ok) {
      try {
        const parsed1 = cleanAndParseJson(stage1Result.text);
        if (parsed1?.systemPair) {
          currentSystemPair = {
            vectorA: selectedA.name,
            vectorB: selectedB.name,
            syntheticVector: parsed1.systemPair.syntheticVector || currentSystemPair.syntheticVector,
            ontologicalMatrix: parsed1.systemPair.ontologicalMatrix || currentSystemPair.ontologicalMatrix,
            derivationTimestamp: formattedDate
          };
        }
        if (parsed1?.phase1Decomposition) {
          currentDecomposition = parsed1.phase1Decomposition;
        }
        entry.aiProvider = stage1Result.provider;
        entry.aiModel = stage1Result.model;
        console.log(`[ALKIMIA] [Stadio 1/6] FASE 1 completata via ${stage1Result.provider} (${stage1Result.model}).`);
      } catch (e: any) {
        console.warn(`[ALKIMIA] [Stadio 1/6] Fallback locale decodifica Fase 1:`, e.message || e);
      }
    } else if ('error' in stage1Result) {
      console.warn(`[ALKIMIA] [Stadio 1/6] Fallback locale Fase 1: ${stage1Result.error}`);
    }

    entry.edition = {
      ...entry.edition,
      systemPair: currentSystemPair,
      phase1Decomposition: currentDecomposition
    };
    saveDossierStep(solarDateKey, 'phase1_decomposition', {
      systemPair: currentSystemPair,
      phase1Decomposition: currentDecomposition
    });
    await waitBetweenStages(1);

    // =========================================================================
    // STADIO 2 -> FASE 2: Archivio Empirico (/fase-2.html)
    // Provider primario: Groq -> OpenRouter -> Cloudflare (Zero Token Gemini)
    // =========================================================================
    console.log(`[ALKIMIA] [Stadio 2/6] Redazione FASE 2 (Archivio Empirico) con dati web live in corso...`);
    const stage2Prompt = buildStage2EmpiricalPrompt(
      selectedA,
      selectedB,
      webA.combinedContext,
      webB.combinedContext,
      currentDecomposition
    );
    const stage2Result = await runAiProviderChain(analyticalSystemPrompt, stage2Prompt, {
      step: 'phase2',
      excludeGemini: true
    });

    let currentEmpiricalArchive = buildPhase1EmpiricalArchive(selectedA.name, selectedB.name);
    if (stage2Result.ok) {
      try {
        const parsed2 = cleanAndParseJson(stage2Result.text);
        if (parsed2?.phase1EmpiricalArchive) {
          currentEmpiricalArchive = parsed2.phase1EmpiricalArchive;
          entry.aiProvider = stage2Result.provider;
          entry.aiModel = stage2Result.model;
          console.log(`[ALKIMIA] [Stadio 2/6] FASE 2 (Archivio Empirico) completata via ${stage2Result.provider} (${stage2Result.model}).`);
        }
      } catch (e: any) {
        console.warn(`[ALKIMIA] [Stadio 2/6] Fallback locale decodifica Fase 2:`, e.message || e);
      }
    } else if ('error' in stage2Result) {
      console.warn(`[ALKIMIA] [Stadio 2/6] Fallback locale Fase 2: ${stage2Result.error}`);
    }

    entry.edition = {
      ...entry.edition,
      phase1EmpiricalArchive: currentEmpiricalArchive
    };
    saveDossierStep(solarDateKey, 'phase1_5_empiricalArchive', currentEmpiricalArchive);
    saveDossierStep(solarDateKey, 'phase2_empiricalArchive', currentEmpiricalArchive);
    await waitBetweenStages(2);

    // =========================================================================
    // STADIO 3 -> FASE 3: La Collisione (/fase-3.html)
    // Riceve in ingresso l'Archivio Empirico appena salvato nella Fase 2!
    // Provider primario: OpenRouter -> Cloudflare -> Groq -> Gemini
    // =========================================================================
    console.log(`[ALKIMIA] [Stadio 3/6] Redazione FASE 3 (La Collisione fondata sull'Archivio di Fase 2) in corso...`);
    const stage3Prompt = buildStage3CollisionPrompt(
      selectedA,
      selectedB,
      currentDecomposition,
      currentEmpiricalArchive
    );
    const stage3Result = await runAiProviderChain(analyticalSystemPrompt, stage3Prompt, { step: 'phase3' });

    let rawCollision: any = null;
    if (stage3Result.ok) {
      try {
        const parsed3 = cleanAndParseJson(stage3Result.text);
        rawCollision = parsed3?.phase2Collision || parsed3;
        entry.aiProvider = stage3Result.provider;
        entry.aiModel = stage3Result.model;
        console.log(`[ALKIMIA] [Stadio 3/6] FASE 3 (La Collisione) completata via ${stage3Result.provider} (${stage3Result.model}).`);
      } catch (e: any) {
        console.warn(`[ALKIMIA] [Stadio 3/6] Fallback locale decodifica Fase 3:`, e.message || e);
      }
    } else if ('error' in stage3Result) {
      console.warn(`[ALKIMIA] [Stadio 3/6] Fallback locale Fase 3: ${stage3Result.error}`);
    }

    const currentCollision = normalizePhase2Collision(rawCollision, selectedA.name, selectedB.name);
    entry.edition = {
      ...entry.edition,
      phase2Collision: currentCollision
    };
    saveDossierStep(solarDateKey, 'phase3_collision', currentCollision);
    await waitBetweenStages(3);

    // =========================================================================
    // STADIO 4 -> FASE 4: Loop a 5 Direzioni (/fase-4.html)
    // Riceve in ingresso l'Archivio di Fase 2 e la Collisione di Fase 3!
    // Provider primario: Groq -> OpenRouter -> Cloudflare -> Gemini
    // =========================================================================
    console.log(`[ALKIMIA] [Stadio 4/6] Redazione FASE 4 (Loop a 5 Direzioni) in corso...`);
    const stage4Prompt = buildStage4LoopPrompt(
      selectedA,
      selectedB,
      currentEmpiricalArchive,
      currentCollision
    );
    const stage4Result = await runAiProviderChain(analyticalSystemPrompt, stage4Prompt, { step: 'phase4' });

    let rawLoop: any = null;
    if (stage4Result.ok) {
      try {
        const parsed4 = cleanAndParseJson(stage4Result.text);
        rawLoop = parsed4?.phase2Loop || parsed4;
        entry.aiProvider = stage4Result.provider;
        entry.aiModel = stage4Result.model;
        console.log(`[ALKIMIA] [Stadio 4/6] FASE 4 (Loop a 5 Direzioni) completata via ${stage4Result.provider} (${stage4Result.model}).`);
      } catch (e: any) {
        console.warn(`[ALKIMIA] [Stadio 4/6] Fallback locale decodifica Fase 4:`, e.message || e);
      }
    } else if ('error' in stage4Result) {
      console.warn(`[ALKIMIA] [Stadio 4/6] Fallback locale Fase 4: ${stage4Result.error}`);
    }

    const currentLoop = normalizePhase2Loop(rawLoop, selectedA.name, selectedB.name);
    entry.edition = {
      ...entry.edition,
      phase2Loop: currentLoop
    };
    saveDossierStep(solarDateKey, 'phase4_loop', currentLoop);
    await waitBetweenStages(4);

    // =========================================================================
    // STADIO 5 -> FASE 5: L'Affondo Finale (/fase-5.html)
    // Riceve in ingresso i risultati del Loop di Fase 4, Fase 3 e Fase 2!
    // Provider primario: Cloudflare -> OpenRouter -> Groq -> Gemini
    // =========================================================================
    console.log(`[ALKIMIA] [Stadio 5/6] Redazione FASE 5 (L'Affondo Finale) in corso...`);
    const stage5Prompt = buildStage5FinalStrikePrompt(
      selectedA,
      selectedB,
      currentEmpiricalArchive,
      currentCollision,
      currentLoop
    );
    const stage5Result = await runAiProviderChain(analyticalSystemPrompt, stage5Prompt, { step: 'phase5' });

    let currentFinalStrike = buildPhase3FinalStrike(selectedA.name, selectedB.name);
    if (stage5Result.ok) {
      try {
        const parsed5 = cleanAndParseJson(stage5Result.text);
        if (parsed5?.phase3FinalStrike) {
          currentFinalStrike = parsed5.phase3FinalStrike;
        }
        entry.aiProvider = stage5Result.provider;
        entry.aiModel = stage5Result.model;
        console.log(`[ALKIMIA] [Stadio 5/6] FASE 5 (L'Affondo Finale) completata via ${stage5Result.provider} (${stage5Result.model}).`);
      } catch (e: any) {
        console.warn(`[ALKIMIA] [Stadio 5/6] Fallback locale decodifica Fase 5:`, e.message || e);
      }
    } else if ('error' in stage5Result) {
      console.warn(`[ALKIMIA] [Stadio 5/6] Fallback locale Fase 5: ${stage5Result.error}`);
    }

    entry.edition = {
      ...entry.edition,
      phase3FinalStrike: currentFinalStrike
    };
    saveDossierStep(solarDateKey, 'phase5_finalStrike', currentFinalStrike);

    const parsedStep1 = {
      systemPair: currentSystemPair,
      phase1Decomposition: currentDecomposition,
      phase1EmpiricalArchive: currentEmpiricalArchive,
      phase2Collision: currentCollision,
      phase2Loop: currentLoop,
      phase3FinalStrike: currentFinalStrike
    };
    saveDossierStep(solarDateKey, 'phase1To4', parsedStep1);

    // Aggiorna subito il saggio provvisorio con la sintesi coerente delle Fasi 1-5 appena generate,
    // così /fase-6.html non mostra mai una pagina vuota o slegata durante l'elaborazione dello Stadio 6
    const fallbackEssayFromDossier = buildSynthesizedEssayFromDossier(
      parsedStep1,
      selectedA.name,
      selectedB.name,
      solarDateKey
    );
    entry.edition = {
      ...entry.edition,
      essay: fallbackEssayFromDossier
    };

    await waitBetweenStages(5);

    // =========================================================================
    // STADIO 6 -> FASE 6: Saggio del Giorno (/fase-6.html)
    // Provider primario: Groq -> OpenRouter -> Cloudflare -> Gemini
    // =========================================================================
    console.log(`[ALKIMIA] [Stadio 6/6] Redazione FASE 6 (Saggio del Giorno) in corso...`);
    const step2Prompt = buildStep2LiteraryEssayPrompt(parsedStep1, selectedA, selectedB);

    const step2Result = await runAiProviderChain(literarySystemPrompt, step2Prompt, { step: 'phase6' });

    let finalEssay = fallbackEssayFromDossier;
    let finalProvider = entry.aiProvider || 'groq';
    let finalModel = entry.aiModel || 'qwen/qwen3.8-27b';

    if (step2Result.ok) {
      try {
        const parsedStep2 = cleanAndParseJson(step2Result.text);
        const normalizedEssay = extractNormalizedEssay(parsedStep2, solarDateKey);
        if (normalizedEssay) {
          finalEssay = normalizedEssay;
          finalProvider = step2Result.provider;
          finalModel = step2Result.model;
          console.log(
            `[ALKIMIA] [Stadio 6/6] FASE 6 (Saggio del Giorno) completata via ${step2Result.provider} (${step2Result.model}).`
          );
        } else {
          console.warn(
            `[ALKIMIA] [Stadio 6/6] Payload Fase 6 privo di paragrafi validi da ${step2Result.provider}/${step2Result.model}, applico sintesi letteraria del dossier.`
          );
        }
      } catch (err: any) {
        console.warn(
          `[ALKIMIA] [Stadio 6/6] Fallback sintesi dossier per Fase 6 (${step2Result.provider}/${step2Result.model}): ${err.message || err}`
        );
      }
    } else if ('error' in step2Result) {
      console.warn(`[ALKIMIA] [Stadio 6/6] Fallback sintesi dossier per Fase 6: ${step2Result.error}`);
    }

    entry.finishedAt = Date.now();
    saveDossierStep(solarDateKey, 'essay', finalEssay);

    // Consolidamento finale di tutte le 6 Fasi nell'edizione completa
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
      systemPair: currentSystemPair,
      phase1Decomposition: currentDecomposition,
      phase1EmpiricalArchive: currentEmpiricalArchive,
      phase2Collision: currentCollision,
      phase2Loop: currentLoop,
      phase3FinalStrike: currentFinalStrike,
      essay: finalEssay,
      pins: [],
      tensions: [],
      aiProvider: finalProvider,
      aiModel: finalModel,
      generationStatus: 'generated',
      generationError: null,
      generationAttempts: entry.attempts
    };
    entry.status = 'generated';
    entry.aiProvider = finalProvider;
    entry.aiModel = finalModel;
    entry.error = null;

    saveDossierStep(solarDateKey, 'fullEdition', entry.edition);

    console.log(
      `[ALKIMIA] Tutte le 6 Fasi del ${formattedDate} sono state redatte e salvate con successo (Fase 6 completata da ${finalProvider}/${finalModel}).`
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

  // Se esiste un dossier salvato su disco con l'edizione generata, la ripristiniamo immediatamente
  const savedDossier = readDossier(solarDateKey);
  if (savedDossier?.fullEdition) {
    const fe = savedDossier.fullEdition;
    const vAName = fe.systemPair?.vectorA || selectDailyVectorPair(solarDateKey).vectorA.name;
    const vBName = fe.systemPair?.vectorB || selectDailyVectorPair(solarDateKey).vectorB.name;
    const safeEssay =
      extractNormalizedEssay(fe.essay, solarDateKey) ||
      extractNormalizedEssay(savedDossier.essay, solarDateKey) ||
      buildSynthesizedEssayFromDossier(fe, vAName, vBName, solarDateKey);

    const loadedEntry: DailyEditionEntry = {
      solarDateKey,
      cycle: fe.cycle || {
        ...CURRENT_EDITORIAL_CYCLE,
        cyclicalDate: formattedDate,
        nextScheduledPublication: "Al compimento della rotazione diurna"
      },
      edition: {
        ...fe,
        essay: safeEssay
      },
      status: 'generated',
      aiProvider: fe.aiProvider || 'groq',
      aiModel: fe.aiModel || 'qwen/qwen3.8-27b',
      error: null,
      attempts: 1,
      startedAt: null,
      finishedAt: Date.now()
    };
    dailyEditionsCache[solarDateKey] = loadedEntry;
    return stampSolarDate(syncEditionWithEntry(loadedEntry), solarDateKey);
  }

  const pair = selectDailyVectorPair(solarDateKey);
  const selectedA = pair.vectorA;
  const selectedB = pair.vectorB;

  recordVectorExtraction(solarDateKey, selectedA.name, selectedB.name, 'daily_edition');

  const cycle = {
    ...CURRENT_EDITORIAL_CYCLE,
    cyclicalDate: formattedDate,
    nextScheduledPublication: "Al compimento della rotazione diurna"
  };

  const provDecomp = buildPhase1Decomposition(selectedA.name, selectedB.name);
  const provArchive = buildPhase1EmpiricalArchive(selectedA.name, selectedB.name);
  const provCollision = buildPhase2Collision(selectedA.name, selectedB.name);
  const provLoop = buildPhase2LoopFiveDirections(selectedA.name, selectedB.name);
  const provStrike = buildPhase3FinalStrike(selectedA.name, selectedB.name);
  const provSystemPair = {
    vectorA: selectedA.name,
    vectorB: selectedB.name,
    syntheticVector: `Collisione speculativa tra ${selectedA.name} e ${selectedB.name}`,
    ontologicalMatrix:
      "Soglia di fase tra l'entropia organica locale e la conservazione dell'informazione non-locale",
    derivationTimestamp: formattedDate
  };

  const provisionalEdition = {
    id: `edition-${solarDateKey}`,
    isLatest: true,
    cycle: { ...cycle },
    systemPair: provSystemPair,
    phase1Decomposition: provDecomp,
    phase1EmpiricalArchive: provArchive,
    phase2Collision: provCollision,
    phase2Loop: provLoop,
    phase3FinalStrike: provStrike,
    essay: buildSynthesizedEssayFromDossier(
      {
        systemPair: provSystemPair,
        phase1Decomposition: provDecomp,
        phase1EmpiricalArchive: provArchive,
        phase2Collision: provCollision,
        phase2Loop: provLoop,
        phase3FinalStrike: provStrike
      },
      selectedA.name,
      selectedB.name,
      solarDateKey
    ),
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
    const promise = startDailyAiDrafting(solarDateKey, req.body?.force !== false);

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
    // Redirect clean paths /fase-1 .. /fase-6 to /fase-1.html .. /fase-6.html
    app.get(/^\/fase-([1-6])$/, (req, res) => {
      res.redirect(`/fase-${req.params[0]}.html`);
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.get(/^\/fase-([1-6])$/, (req, res) => {
      res.redirect(`/fase-${req.params[0]}.html`);
    });
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      // Non mascherare mai un errore API restituendo l'HTML dell'SPA.
      if (req.path.startsWith("/api/")) return next();
      const phaseMatch = req.path.match(/^\/fase-([1-6])\.html$/);
      if (phaseMatch) {
        return res.sendFile(path.join(distPath, `fase-${phaseMatch[1]}.html`));
      }
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
