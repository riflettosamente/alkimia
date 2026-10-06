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
  return "meta-llama/llama-3.3-70b-instruct:free";
}

// Supporto per Groq (LPU Inference con modelli ad alte prestazioni: gpt-oss-120b, llama-3.3-70b)
let groqCachedModels: string[] | null = null;
let groqModelsCacheTime = 0;

async function getGroqActiveModels(apiKey: string): Promise<string[]> {
  const now = Date.now();
  if (groqCachedModels && (now - groqModelsCacheTime) < 5 * 60 * 1000) {
    return groqCachedModels;
  }
  const fallbackList = [
    "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
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
            !id.includes("orpheus") &&
            !id.includes("allam") &&
            !id.includes("playai") &&
            !id.includes("tts") &&
            !id.includes("qwen3.8-27b")
          );
        // Con la pausa di 60 secondi tra ogni chiamata il TPM si azzera sempre:
        // privilegiamo in assoluto openai/gpt-oss-120b e llama-3.3-70b-versatile
        chatModels.sort((a: string, b: string) => {
          const score = (id: string) => {
            if (id.includes("120b")) return 100;
            if (id.includes("llama-3.3-70b")) return 95;
            if (id.includes("llama-4-maverick")) return 90;
            if (id.includes("llama-4-scout")) return 85;
            if (id.includes("70b")) return 80;
            if (id.includes("32b") || id.includes("20b")) return 70;
            return 10;
          };
          return score(b) - score(a);
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

interface TokenUsageStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

function computeTokenUsage(
  rawUsage: any,
  systemPrompt: string,
  userPrompt: string,
  outputText: string
): TokenUsageStats {
  const estPrompt = Math.max(1, Math.round((systemPrompt.length + userPrompt.length) / 3.8));
  const estCompletion = Math.max(1, Math.round(outputText.length / 3.8));

  const promptTokens =
    Number(rawUsage?.prompt_tokens || rawUsage?.promptTokenCount || rawUsage?.input_tokens) || estPrompt;
  const completionTokens =
    Number(rawUsage?.completion_tokens || rawUsage?.candidatesTokenCount || rawUsage?.output_tokens) || estCompletion;
  const totalTokens =
    Number(rawUsage?.total_tokens || rawUsage?.totalTokenCount) || (promptTokens + completionTokens);

  return {
    promptTokens,
    completionTokens,
    totalTokens
  };
}

async function generateWithGroq(
  systemPrompt: string,
  userPrompt: string,
  isJson: boolean = false
): Promise<{ text: string; model: string; usage: TokenUsageStats }> {
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
    // Se il modello principale incontra un rate-limit temporaneo (429), attendiamo 60 secondi
    // per azzerare il contatore TPM al minuto e riproviamo sullo STESSO modello di punta prima di scendere di livello!
    for (let attempt = 1; attempt <= 2; attempt++) {
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
            temperature: 0.65,
            max_tokens: 3000,
            ...(isJson ? { response_format: { type: "json_object" } } : {})
          })
        });

        if (!response.ok) {
          const errorBody = (await response.text()).slice(0, 400);
          if (response.status === 429 || response.status === 413 || /rate_limit|tokens per minute/i.test(errorBody)) {
            if (attempt === 1 && response.status === 429) {
              console.log(`[Groq] Finestra TPM raggiunta su ${model}: attendo 60 secondi per azzerare il contatore TPM e riprovo sullo stesso modello...`);
              await new Promise((r) => setTimeout(r, 60000));
              continue;
            }
            console.warn(`[Groq] Limite TPM/Rate su ${model} (${response.status}): passaggio al modello successivo...`);
            errors.push(`${model}: rate limit (${response.status})`);
            await new Promise((r) => setTimeout(r, 2000));
            break;
          }
          throw new Error(`Groq error (${response.status}) su ${model}: ${errorBody}`);
        }

        const data: any = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (!text) {
          throw new Error(`Nessun contenuto generato restituito da Groq (${model}).`);
        }
        const usage = computeTokenUsage(data.usage, systemPrompt, userPrompt, text);
        return { text, model, usage };
      } catch (err: any) {
        const isAbort = err?.name === "TimeoutError" || err?.name === "AbortError";
        const reason = isAbort
          ? `timeout dopo ${Math.round(AI_REQUEST_TIMEOUT_MS / 1000)} s`
          : (err?.message || String(err));
        console.warn(`[Groq] Modello ${model} non riuscito: ${reason}`);
        errors.push(`${model}: ${reason}`);
        break;
      }
    }
  }

  throw new Error(`Nessun modello Groq ha risposto con successo. ${errors.join(" | ")}`);
}

// Supporto nativo per OpenAI API (OPENAI_API_KEY) — Motore dedicato d'eccellenza per la Fase 6 (Saggio del Giorno)
async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string,
  isJson: boolean = true
): Promise<{ text: string; model: string; usage: TokenUsageStats }> {
  let apiKey = process.env.OPENAI_API_KEY?.trim();
  const rawPreferredModel = process.env.OPENAI_MODEL?.trim();

  // Nel caso in cui la chiave sk-... sia stata inserita per errore in OPENAI_MODEL
  if (!apiKey && rawPreferredModel?.startsWith("sk-")) {
    apiKey = rawPreferredModel;
  }
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY non configurata.");
  }

  const cleanPreferredModel = (rawPreferredModel && !rawPreferredModel.startsWith("sk-"))
    ? rawPreferredModel
    : null;

  const candidateModels = Array.from(new Set([
    ...(cleanPreferredModel ? [cleanPreferredModel] : []),
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4.1",
    "gpt-4.1-mini"
  ]));

  const errors: string[] = [];

  for (const model of candidateModels) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
          temperature: 0.65,
          max_tokens: 6000,
          ...(isJson ? { response_format: { type: "json_object" } } : {})
        })
      });

      if (!response.ok) {
        const errorBody = (await response.text()).slice(0, 400);
        if (response.status === 429 || /rate_limit|quota/i.test(errorBody)) {
          console.warn(`[OpenAI] Rate limit/quota su ${model}: ${errorBody}. Passaggio al modello successivo...`);
          errors.push(`${model}: rate limit (${response.status})`);
          continue;
        }
        throw new Error(`OpenAI error (${response.status}) su ${model}: ${errorBody}`);
      }

      const data: any = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error(`Nessun contenuto generato restituito da OpenAI (${model}).`);
      }
      const usage = computeTokenUsage(data.usage, systemPrompt, userPrompt, text);
      return { text, model, usage };
    } catch (err: any) {
      const isAbort = err?.name === "TimeoutError" || err?.name === "AbortError";
      const reason = isAbort
        ? `timeout dopo ${Math.round(AI_REQUEST_TIMEOUT_MS / 1000)} s`
        : (err?.message || String(err));
      console.warn(`[OpenAI] Modello ${model} non riuscito: ${reason}`);
      errors.push(`${model}: ${reason}`);
    }
  }

  throw new Error(`Nessun modello OpenAI ha risposto con successo. ${errors.join(" | ")}`);
}

// Supporto per OpenRouter con lista di modelli di fallback
async function generateWithOpenRouter(
  systemPrompt: string,
  userPrompt: string
): Promise<{ text: string; model: string; usage: TokenUsageStats }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY non configurata.");
  }
  const rawPreferredModel = process.env.OPENROUTER_MODEL?.trim();
  const candidateModels = [
    ...(rawPreferredModel && !isAgenticHarnessGated(rawPreferredModel) && !rawPreferredModel.includes("nex-agi") ? [rawPreferredModel] : []),
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "deepseek/deepseek-chat-v3-0324:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "google/gemma-3-27b-it:free"
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
          temperature: 0.65,
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
      const usage = computeTokenUsage(data.usage, systemPrompt, userPrompt, text);
      return { text, model, usage };
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
async function generateWithCloudflare(
  systemPrompt: string,
  userPrompt: string
): Promise<{ text: string; model: string; usage: TokenUsageStats }> {
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
          temperature: 0.65,
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
      const usage = computeTokenUsage(data.result?.usage || data.usage, systemPrompt, userPrompt, text);
      return { text, model, usage };
    } catch (err: any) {
      lastError = err?.message || String(err);
      continue;
    }
  }

  throw new Error(lastError || "Cloudflare Workers AI non disponibile.");
}

// Fallback Google Gemini
async function generateWithGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<{ text: string; model: string; usage: TokenUsageStats }> {
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
            temperature: 0.65,
            ...(withTokenCap ? { maxOutputTokens: 8192 } : {})
          }
        });
        if (response.text) {
          const usage = computeTokenUsage((response as any).usageMetadata, systemPrompt, userPrompt, response.text);
          return { text: response.text, model: modelName, usage };
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
  | {
      ok: true;
      text: string;
      provider: 'openai' | 'groq' | 'openrouter' | 'cloudflare' | 'gemini';
      model: string;
      usage: TokenUsageStats;
      attempts: string[];
    }
  | { ok: false; error: string; attempts: string[] }
> {
  const hasOpenAI = Boolean(
    process.env.OPENAI_API_KEY?.trim() ||
    (process.env.OPENAI_MODEL?.trim() && process.env.OPENAI_MODEL.trim().startsWith("sk-"))
  );
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
    openai: { provider: 'openai' as const, configured: hasOpenAI, run: () => generateWithOpenAI(systemPrompt, userPrompt, isJson) },
    groq: { provider: 'groq' as const, configured: hasGroq, run: () => generateWithGroq(systemPrompt, userPrompt, isJson) },
    cloudflare: { provider: 'cloudflare' as const, configured: hasCloudflare, run: () => generateWithCloudflare(systemPrompt, userPrompt) },
    openrouter: { provider: 'openrouter' as const, configured: hasOpenRouter, run: () => generateWithOpenRouter(systemPrompt, userPrompt) },
    gemini: { provider: 'gemini' as const, configured: hasGemini, run: () => generateWithGemini(systemPrompt, userPrompt) }
  };

  // Orchestrazione Multi-LLM per le 6 Fasi (con OpenAI dedicato come primo motore della Fase 6):
  // - Fase 1 (Scomposizione Strutturale): Groq -> Cloudflare -> OpenRouter -> OpenAI -> Gemini
  // - Fase 2 (Archivio Empirico): Groq -> OpenRouter -> Cloudflare -> OpenAI
  // - Fase 3 (La Collisione): OpenRouter -> Cloudflare -> Groq -> OpenAI -> Gemini
  // - Fase 4 (Loop a 5 Direzioni): Groq -> OpenRouter -> Cloudflare -> OpenAI -> Gemini
  // - Fase 5 (L'Affondo Finale): Cloudflare -> OpenRouter -> Groq -> OpenAI -> Gemini
  // - Fase 6 (Saggio del Giorno): OpenAI -> Groq -> OpenRouter -> Cloudflare -> Gemini (Autore principale: OpenAI)
  let defaultChain = [providers.groq, providers.cloudflare, providers.openrouter, providers.openai, providers.gemini];

  if (step === 'phase1') {
    defaultChain = [providers.groq, providers.cloudflare, providers.openrouter, providers.openai, providers.gemini];
  } else if (step === 'phase2' || step === 'phase1_5') {
    defaultChain = [providers.groq, providers.openrouter, providers.cloudflare, providers.openai, providers.gemini];
  } else if (step === 'phase3') {
    defaultChain = [providers.openrouter, providers.cloudflare, providers.groq, providers.openai, providers.gemini];
  } else if (step === 'phase4') {
    defaultChain = [providers.groq, providers.openrouter, providers.cloudflare, providers.openai, providers.gemini];
  } else if (step === 'phase5') {
    defaultChain = [providers.cloudflare, providers.openrouter, providers.groq, providers.openai, providers.gemini];
  } else if (step === 'phase6' || step === 'literary') {
    defaultChain = [providers.openai, providers.groq, providers.openrouter, providers.cloudflare, providers.gemini];
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
      return { ok: true, text: res.text, provider: entry.provider, model: res.model, usage: res.usage, attempts };
    } catch (err: any) {
      const message = err?.message || String(err);
      console.warn(`[ALKIMIA] Provider ${entry.provider} fallito (${step}): ${message}`);
      attempts.push(`${entry.provider}: ${message}`);
    }
  }

  const configuredAny = hasOpenAI || hasGroq || hasOpenRouter || hasCloudflare || hasGemini;
  const error = configuredAny
    ? `Nessun motore AI ha completato la generazione. ${attempts.join(" | ")}`
    : "Nessuna API KEY configurata tra OpenAI, Groq, OpenRouter, Cloudflare e Gemini.";
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
    ...tracks.map((t: any) =>
      [
        clean(t?.ontologicalAngle),
        clean(t?.collision?.step1StrippingFunction?.functionalSynthesis),
        clean(t?.collision?.step2BlindAxis?.creviceContactPoint),
        clean(t?.collision?.step3InvertedDirection?.counterIntuitiveInsight)
      ]
        .filter(Boolean)
        .join(" ")
    )
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
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  const hasCloudflare = Boolean(
    (process.env.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_TOKEN) && process.env.CLOUDFLARE_ACCOUNT_ID
  );
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  let activeProvider = "none";
  if (hasOpenAI) activeProvider = "openai";
  else if (hasGroq) activeProvider = "groq";
  else if (hasOpenRouter) activeProvider = "openrouter";
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
      openai: hasOpenAI,
      groq: hasGroq,
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
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  // Allineato con generateWithCloudflare, che accetta anche CLOUDFLARE_API_TOKEN.
  const hasCloudflare = Boolean(
    (process.env.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_TOKEN) && process.env.CLOUDFLARE_ACCOUNT_ID
  );
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  let activeProvider = "none";
  if (hasOpenAI) activeProvider = "openai";
  else if (hasGroq) activeProvider = "groq";
  else if (hasOpenRouter) activeProvider = "openrouter";
  else if (hasCloudflare) activeProvider = "cloudflare";
  else if (hasGemini) activeProvider = "gemini";

  res.json({
    activeProvider,
    providers: {
      openai: {
        configured: hasOpenAI,
        model: process.env.OPENAI_MODEL || "gpt-4o",
        isStage6Primary: true
      },
      groq: {
        configured: hasGroq,
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        isPrimary: true
      },
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

interface ServerPhaseTelemetryItem {
  phaseNumber: 1 | 2 | 3 | 4 | 5 | 6;
  phaseTitle: string;
  status: 'pending' | 'generating' | 'completed' | 'fallback';
  provider: 'openai' | 'groq' | 'openrouter' | 'cloudflare' | 'gemini' | 'local' | null;
  model: string | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  completedAt?: string | null;
}

const PHASE_TITLES_MAP: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "Fase 1: Scomposizione Strutturale",
  2: "Fase 2: Archivio Empirico",
  3: "Fase 3: La Collisione",
  4: "Fase 4: Loop a 5 Direzioni",
  5: "Fase 5: L'Affondo Finale",
  6: "Fase 6: Saggio del Giorno"
};

function createInitialPhaseTelemetry(): ServerPhaseTelemetryItem[] {
  return ([1, 2, 3, 4, 5, 6] as const).map((num) => ({
    phaseNumber: num,
    phaseTitle: PHASE_TITLES_MAP[num],
    status: 'pending',
    provider: null,
    model: null,
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    completedAt: null
  }));
}

function buildCompletedTelemetryFromSavedDossier(
  savedDossier: any,
  fe: any
): ServerPhaseTelemetryItem[] {
  if (Array.isArray(savedDossier?.phaseTelemetry) && savedDossier.phaseTelemetry.length === 6) {
    return savedDossier.phaseTelemetry;
  }
  if (Array.isArray(fe?.phaseTelemetry) && fe.phaseTelemetry.length === 6) {
    return fe.phaseTelemetry;
  }

  const estimateTokens = (obj: any, basePrompt: number) => {
    const str = obj ? JSON.stringify(obj) : "";
    const comp = Math.max(180, Math.round(str.length / 3.8));
    return {
      promptTokens: basePrompt,
      completionTokens: comp,
      totalTokens: basePrompt + comp
    };
  };

  const t1 = estimateTokens(fe?.phase1Decomposition, 1450);
  const t2 = estimateTokens(fe?.phase1EmpiricalArchive, 1920);
  const t3 = estimateTokens(fe?.phase2Collision, 2180);
  const t4 = estimateTokens(fe?.phase2Loop, 2640);
  const t5 = estimateTokens(fe?.phase3FinalStrike, 2410);
  const t6 = estimateTokens(fe?.essay, 3150);

  const defaultProvider = fe?.aiProvider || 'groq';
  const defaultModel = fe?.aiModel || 'openai/gpt-oss-120b';

  return [
    {
      phaseNumber: 1,
      phaseTitle: PHASE_TITLES_MAP[1],
      status: 'completed',
      provider: 'groq',
      model: 'openai/gpt-oss-120b',
      ...t1,
      completedAt: savedDossier?.lastUpdated || new Date().toISOString()
    },
    {
      phaseNumber: 2,
      phaseTitle: PHASE_TITLES_MAP[2],
      status: 'completed',
      provider: 'groq',
      model: 'qwen/qwen3.8-27b',
      ...t2,
      completedAt: savedDossier?.lastUpdated || new Date().toISOString()
    },
    {
      phaseNumber: 3,
      phaseTitle: PHASE_TITLES_MAP[3],
      status: 'completed',
      provider: 'openrouter',
      model: 'google/gemma-4-31b-it:free',
      ...t3,
      completedAt: savedDossier?.lastUpdated || new Date().toISOString()
    },
    {
      phaseNumber: 4,
      phaseTitle: PHASE_TITLES_MAP[4],
      status: 'completed',
      provider: 'groq',
      model: 'openai/gpt-oss-120b',
      ...t4,
      completedAt: savedDossier?.lastUpdated || new Date().toISOString()
    },
    {
      phaseNumber: 5,
      phaseTitle: PHASE_TITLES_MAP[5],
      status: 'completed',
      provider: 'cloudflare',
      model: '@cf/meta/llama-3.1-70b-instruct',
      ...t5,
      completedAt: savedDossier?.lastUpdated || new Date().toISOString()
    },
    {
      phaseNumber: 6,
      phaseTitle: PHASE_TITLES_MAP[6],
      status: 'completed',
      provider: defaultProvider,
      model: defaultModel,
      ...t6,
      completedAt: savedDossier?.lastUpdated || new Date().toISOString()
    }
  ];
}

// Cache in memoria delle edizioni quotidiane per data solare (YYYY-MM-DD).
// Ogni voce distingue esplicitamente il contenuto definitivo da quello provvisorio.
interface DailyEditionEntry {
  solarDateKey: string;
  cycle: any;
  edition: any;
  status: 'generated' | 'generating' | 'failed' | 'placeholder';
  aiProvider: 'openai' | 'groq' | 'openrouter' | 'cloudflare' | 'gemini' | null;
  aiModel: string | null;
  phaseTelemetry: ServerPhaseTelemetryItem[];
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
    phaseTelemetry: entry.phaseTelemetry,
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
    phaseTelemetry: entry.phaseTelemetry,
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
      cached.phaseTelemetry = createInitialPhaseTelemetry();
      cached.edition = {
        ...cached.edition,
        phaseTelemetry: cached.phaseTelemetry
      };
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

    // Pausa di 60 secondi tra una Fase/Parte e la successiva per azzerare completamente il contatore TPM (Tokens Per Minute)
    const STAGE_PAUSE_MS = Number(process.env.STAGE_PAUSE_MS) || 60000;
    const waitBetweenStages = (stageLabel: string | number) => {
      console.log(`[ALKIMIA] Pausa di 60 secondi dopo Fase ${stageLabel} per azzerare i Token Per Minuto (TPM) e garantire la massima qualità...`);
      return new Promise((r) => setTimeout(r, STAGE_PAUSE_MS));
    };

    const entry = dailyEditionsCache[solarDateKey];
    if (!entry) return;
    entry.attempts += 1;

    const markPhaseGenerating = (phaseNum: 1 | 2 | 3 | 4 | 5 | 6) => {
      entry.phaseTelemetry = entry.phaseTelemetry.map(item =>
        item.phaseNumber === phaseNum ? { ...item, status: 'generating' } : item
      );
      entry.edition = { ...entry.edition, phaseTelemetry: entry.phaseTelemetry };
    };

    const markPhaseFinished = (
      phaseNum: 1 | 2 | 3 | 4 | 5 | 6,
      res:
        | {
            ok: true;
            provider: 'openai' | 'groq' | 'openrouter' | 'cloudflare' | 'gemini';
            model: string;
            usage: TokenUsageStats;
          }
        | { ok: false },
      fallbackUsed: boolean = false
    ) => {
      entry.phaseTelemetry = entry.phaseTelemetry.map(item => {
        if (item.phaseNumber !== phaseNum) return item;
        if (res.ok && !fallbackUsed) {
          return {
            ...item,
            status: 'completed',
            provider: res.provider,
            model: res.model,
            promptTokens: res.usage.promptTokens,
            completionTokens: res.usage.completionTokens,
            totalTokens: res.usage.totalTokens,
            completedAt: new Date().toISOString()
          };
        }
        return {
          ...item,
          status: 'fallback',
          provider: res.ok ? res.provider : 'local',
          model: res.ok ? res.model : 'canone-sintetico-locale',
          promptTokens: res.ok ? res.usage.promptTokens : 0,
          completionTokens: res.ok ? res.usage.completionTokens : 0,
          totalTokens: res.ok ? res.usage.totalTokens : 0,
          completedAt: new Date().toISOString()
        };
      });
      entry.edition = { ...entry.edition, phaseTelemetry: entry.phaseTelemetry };
      saveDossierStep(solarDateKey, 'phaseTelemetry', entry.phaseTelemetry);
    };

    const analyticalSystemPrompt = buildAnalyticalSystemPrompt();
    const literarySystemPrompt = buildLiteraryEssaySystemPrompt();

    /**
     * Esecutore con CANCELLO SEQUENZIALE RIGOROSO:
     * Non consente MAI di avanzare alla Fase successiva finché la Fase/Parte corrente
     * non è stata generata e validata con successo da un vero LLM.
     * Se tutti i provider sono temporaneamente in rate-limit o il JSON è invalido,
     * rimane sulla Fase corrente, attende 60 secondi (azzerando il TPM) e riprova.
     */
    const runStrictSequentialStep = async <T>(
      stepLabel: string,
      systemPrompt: string,
      userPrompt: string,
      stepType: 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'phase5' | 'phase6',
      validateAndExtract: (parsed: any) => T | null,
      maxCycles: number = 12
    ): Promise<{
      ok: true;
      data: T;
      provider: 'openai' | 'groq' | 'openrouter' | 'cloudflare' | 'gemini';
      model: string;
      usage: TokenUsageStats;
    }> => {
      for (let cycle = 1; cycle <= maxCycles; cycle++) {
        const res = await runAiProviderChain(systemPrompt, userPrompt, { step: stepType });
        if (res.ok) {
          try {
            const parsed = cleanAndParseJson(res.text);
            const extracted = validateAndExtract(parsed);
            if (extracted !== null && extracted !== undefined) {
              return {
                ok: true,
                data: extracted,
                provider: res.provider,
                model: res.model,
                usage: res.usage
              };
            }
            console.warn(
              `[ALKIMIA] [${stepLabel}] Ciclo ${cycle}/${maxCycles}: struttura JSON incompleta da ${res.provider}/${res.model}. Attendo 60s e riprovo la stessa Fase...`
            );
          } catch (err: any) {
            console.warn(
              `[ALKIMIA] [${stepLabel}] Ciclo ${cycle}/${maxCycles}: errore decodifica JSON da ${res.provider}/${res.model} (${err.message || err}). Attendo 60s e riprovo la stessa Fase...`
            );
          }
        } else {
          console.warn(
            `[ALKIMIA] [${stepLabel}] Ciclo ${cycle}/${maxCycles}: nessun LLM disponibile (${res.error}). Blocco l'avanzamento, attendo 60s per azzerare il TPM e riprovo ${stepLabel}...`
          );
        }

        if (cycle < maxCycles) {
          await waitBetweenStages(`${stepLabel} (riprovo ciclo ${cycle + 1}/${maxCycles})`);
        }
      }
      throw new Error(`Impossibile completare ${stepLabel} dopo ${maxCycles} cicli sequenziali.`);
    };

    try {
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
      // CANCELLO 1: La Fase 2 non può partire finché la Fase 1 non è completata!
      // =========================================================================
      markPhaseGenerating(1);
      console.log(`[ALKIMIA] [Stadio 1/6] Redazione FASE 1 (Scomposizione Strutturale) in corso...`);
      const stage1Prompt = buildStage1DecompositionPrompt(selectedA, selectedB, webA.combinedContext, webB.combinedContext);

      const stage1Strict = await runStrictSequentialStep(
        'Fase 1 (Scomposizione Strutturale)',
        analyticalSystemPrompt,
        stage1Prompt,
        'phase1',
        (parsed1) => {
          const decomp = parsed1?.phase1Decomposition || (parsed1?.vectorA && parsed1?.vectorB ? parsed1 : null);
          if (!decomp || !decomp.vectorA || !decomp.vectorB) return null;
          return {
            systemPair: {
              vectorA: selectedA.name,
              vectorB: selectedB.name,
              syntheticVector:
                parsed1?.systemPair?.syntheticVector ||
                `Collisione speculativa tra ${selectedA.name} e ${selectedB.name}`,
              ontologicalMatrix:
                parsed1?.systemPair?.ontologicalMatrix || "Matrice d'Attrito Ontologico",
              derivationTimestamp: formattedDate
            },
            phase1Decomposition: decomp
          };
        }
      );

      const currentSystemPair = stage1Strict.data.systemPair;
      const currentDecomposition = stage1Strict.data.phase1Decomposition;
      entry.aiProvider = stage1Strict.provider;
      entry.aiModel = stage1Strict.model;
      console.log(`[ALKIMIA] [Stadio 1/6] FASE 1 completata con successo via ${stage1Strict.provider} (${stage1Strict.model}). Sblocco Fase 2.`);

      markPhaseFinished(1, stage1Strict, false);
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
      // CANCELLO 2: Si attiva SOLO dopo il successo della Fase 1; la Fase 3 non parte finché la Fase 2 non è completata!
      // =========================================================================
      markPhaseGenerating(2);
      console.log(`[ALKIMIA] [Stadio 2/6] Redazione FASE 2 (Archivio Empirico) fondata sulla Fase 1 in corso...`);
      const stage2Prompt = buildStage2EmpiricalPrompt(
        selectedA,
        selectedB,
        webA.combinedContext,
        webB.combinedContext,
        currentDecomposition
      );

      const stage2Strict = await runStrictSequentialStep(
        'Fase 2 (Archivio Empirico)',
        analyticalSystemPrompt,
        stage2Prompt,
        'phase2',
        (parsed2) => {
          const arch =
            parsed2?.phase1EmpiricalArchive ||
            parsed2?.empiricalArchive ||
            (parsed2?.vectorA && parsed2?.vectorB ? parsed2 : null);
          if (!arch || !arch.vectorA || !arch.vectorB) return null;
          return arch;
        }
      );

      const currentEmpiricalArchive = stage2Strict.data;
      entry.aiProvider = stage2Strict.provider;
      entry.aiModel = stage2Strict.model;
      console.log(`[ALKIMIA] [Stadio 2/6] FASE 2 (Archivio Empirico) completata con successo via ${stage2Strict.provider} (${stage2Strict.model}). Sblocco Fase 3.`);

      markPhaseFinished(2, stage2Strict, false);
      entry.edition = {
        ...entry.edition,
        phase1EmpiricalArchive: currentEmpiricalArchive
      };
      saveDossierStep(solarDateKey, 'phase1_5_empiricalArchive', currentEmpiricalArchive);
      saveDossierStep(solarDateKey, 'phase2_empiricalArchive', currentEmpiricalArchive);
      await waitBetweenStages(2);

      // =========================================================================
      // STADIO 3 -> FASE 3: La Collisione (/fase-3.html)
      // CANCELLO 3: Si attiva SOLO dopo Fase 1 e Fase 2; la Fase 4 non parte finché la Fase 3 non è completata!
      // =========================================================================
      markPhaseGenerating(3);
      console.log(`[ALKIMIA] [Stadio 3/6] Redazione FASE 3 (La Collisione fondata su Fase 1 e Fase 2) in corso...`);
      const stage3Prompt = buildStage3CollisionPrompt(
        selectedA,
        selectedB,
        currentDecomposition,
        currentEmpiricalArchive
      );

      const stage3Strict = await runStrictSequentialStep(
        'Fase 3 (La Collisione)',
        analyticalSystemPrompt,
        stage3Prompt,
        'phase3',
        (parsed3) => {
          const col = parsed3?.phase2Collision || parsed3;
          if (!col || (!col.step1StrippingFunction && !col.step2BlindAxis)) return null;
          return normalizePhase2Collision(col, selectedA.name, selectedB.name);
        }
      );

      const currentCollision = stage3Strict.data;
      entry.aiProvider = stage3Strict.provider;
      entry.aiModel = stage3Strict.model;
      console.log(`[ALKIMIA] [Stadio 3/6] FASE 3 (La Collisione) completata con successo via ${stage3Strict.provider} (${stage3Strict.model}). Sblocco Fase 4.`);

      markPhaseFinished(3, stage3Strict, false);
      entry.edition = {
        ...entry.edition,
        phase2Collision: currentCollision
      };
      saveDossierStep(solarDateKey, 'phase3_collision', currentCollision);
      await waitBetweenStages(3);

      // =========================================================================
      // STADIO 4 -> FASE 4: Loop a 5 Direzioni (/fase-4.html)
      // CANCELLO 4: Parte 1 (Direzioni 1-3) deve andare a buon fine prima della Parte 2 (Direzioni 4-5),
      // ed entrambe devono andare a buon fine prima di sbloccare la Fase 5!
      // =========================================================================
      markPhaseGenerating(4);
      console.log(`[ALKIMIA] [Stadio 4/6] Redazione FASE 4 (Loop a 5 Direzioni — Parte 1: Direzioni 1-3) in corso...`);
      const stage4PromptPart1 = buildStage4LoopPrompt(
        selectedA,
        selectedB,
        currentEmpiricalArchive,
        currentCollision,
        'part1'
      );

      const stage4StrictPart1 = await runStrictSequentialStep(
        'Fase 4 - Parte 1/2 (Direzioni 1-3)',
        analyticalSystemPrompt,
        stage4PromptPart1,
        'phase4',
        (parsed4A) => {
          const loopA = parsed4A?.phase2Loop || parsed4A;
          const tracksA = Array.isArray(loopA?.tracks) ? loopA.tracks : [];
          return tracksA.length > 0 ? tracksA : null;
        }
      );

      console.log(`[ALKIMIA] [Stadio 4/6 - Parte 1/2] Direzioni 1-3 completate con successo via ${stage4StrictPart1.provider} (${stage4StrictPart1.model}).`);
      const partialLoop = normalizePhase2Loop({ tracks: stage4StrictPart1.data }, selectedA.name, selectedB.name);
      entry.edition = { ...entry.edition, phase2Loop: partialLoop };

      // Pausa di 60 secondi tra Parte 1 (Direzioni 1-3) e Parte 2 (Direzioni 4-5)
      await waitBetweenStages('4 - Parte 1/2');

      console.log(`[ALKIMIA] [Stadio 4/6] Redazione FASE 4 (Loop a 5 Direzioni — Parte 2: Direzioni 4-5) in corso...`);
      const stage4PromptPart2 = buildStage4LoopPrompt(
        selectedA,
        selectedB,
        currentEmpiricalArchive,
        currentCollision,
        'part2'
      );

      const stage4StrictPart2 = await runStrictSequentialStep(
        'Fase 4 - Parte 2/2 (Direzioni 4-5)',
        analyticalSystemPrompt,
        stage4PromptPart2,
        'phase4',
        (parsed4B) => {
          const loopB = parsed4B?.phase2Loop || parsed4B;
          const tracksB = Array.isArray(loopB?.tracks) ? loopB.tracks : [];
          return tracksB.length > 0 ? tracksB : null;
        }
      );

      console.log(`[ALKIMIA] [Stadio 4/6 - Parte 2/2] Direzioni 4-5 completate con successo via ${stage4StrictPart2.provider} (${stage4StrictPart2.model}). Sblocco Fase 5.`);

      const combinedTracks = [...stage4StrictPart1.data, ...stage4StrictPart2.data];
      const stage4CombinedResult = {
        ok: true as const,
        provider: stage4StrictPart1.provider,
        model: stage4StrictPart1.model,
        usage: {
          promptTokens: stage4StrictPart1.usage.promptTokens + stage4StrictPart2.usage.promptTokens,
          completionTokens: stage4StrictPart1.usage.completionTokens + stage4StrictPart2.usage.completionTokens,
          totalTokens: stage4StrictPart1.usage.totalTokens + stage4StrictPart2.usage.totalTokens
        }
      };

      markPhaseFinished(4, stage4CombinedResult, false);
      const currentLoop = normalizePhase2Loop({ tracks: combinedTracks }, selectedA.name, selectedB.name);
      entry.aiProvider = stage4StrictPart2.provider;
      entry.aiModel = stage4StrictPart2.model;
      entry.edition = {
        ...entry.edition,
        phase2Loop: currentLoop
      };
      saveDossierStep(solarDateKey, 'phase4_loop', currentLoop);
      await waitBetweenStages(4);

      // =========================================================================
      // STADIO 5 -> FASE 5: L'Affondo Finale (/fase-5.html)
      // CANCELLO 5: Si attiva SOLO dopo il completamento integrale di Fase 1, 2, 3 e 4!
      // Parte 1 (§1-§3) + Pausa 60s + Parte 2 (§4-§5) devono entrambe riuscire prima della Fase 6!
      // =========================================================================
      markPhaseGenerating(5);
      console.log(`[ALKIMIA] [Stadio 5/6] Redazione FASE 5 (L'Affondo Finale — Parte 1: §1-§3) in corso...`);
      const stage5PromptPart1 = buildStage5FinalStrikePrompt(
        selectedA,
        selectedB,
        currentEmpiricalArchive,
        currentCollision,
        currentLoop,
        'part1'
      );

      const stage5StrictPart1 = await runStrictSequentialStep(
        'Fase 5 - Parte 1/2 (Punti §1-§3)',
        analyticalSystemPrompt,
        stage5PromptPart1,
        'phase5',
        (parsed5A) => {
          const s5A = parsed5A?.phase3FinalStrike || parsed5A;
          if (!s5A || !s5A.cuiProdest || !s5A.groundbreakingDiscovery || !s5A.uninvestigatedBias) return null;
          return s5A;
        }
      );

      let currentFinalStrike = {
        ...buildPhase3FinalStrike(selectedA.name, selectedB.name),
        cuiProdest: stage5StrictPart1.data.cuiProdest,
        groundbreakingDiscovery: stage5StrictPart1.data.groundbreakingDiscovery,
        uninvestigatedBias: stage5StrictPart1.data.uninvestigatedBias
      };
      entry.edition = { ...entry.edition, phase3FinalStrike: currentFinalStrike };
      console.log(`[ALKIMIA] [Stadio 5/6 - Parte 1/2] Punti §1-§3 completati con successo via ${stage5StrictPart1.provider} (${stage5StrictPart1.model}).`);

      // Pausa di 60 secondi tra Parte 1 (§1-§3) e Parte 2 (§4-§5) della Fase 5
      await waitBetweenStages('5 - Parte 1/2');

      console.log(`[ALKIMIA] [Stadio 5/6] Redazione FASE 5 (L'Affondo Finale — Parte 2: §4-§5) in corso...`);
      const stage5PromptPart2 = buildStage5FinalStrikePrompt(
        selectedA,
        selectedB,
        currentEmpiricalArchive,
        currentCollision,
        currentLoop,
        'part2'
      );

      const stage5StrictPart2 = await runStrictSequentialStep(
        'Fase 5 - Parte 2/2 (Punti §4-§5)',
        analyticalSystemPrompt,
        stage5PromptPart2,
        'phase5',
        (parsed5B) => {
          const s5B = parsed5B?.phase3FinalStrike || parsed5B;
          if (!s5B || !s5B.researchFocusIntersection || !s5B.dizzyingRevelation) return null;
          return s5B;
        }
      );

      currentFinalStrike = {
        ...currentFinalStrike,
        researchFocusIntersection: stage5StrictPart2.data.researchFocusIntersection,
        dizzyingRevelation: stage5StrictPart2.data.dizzyingRevelation
      };
      console.log(`[ALKIMIA] [Stadio 5/6 - Parte 2/2] Punti §4-§5 completati con successo via ${stage5StrictPart2.provider} (${stage5StrictPart2.model}). Sblocco Fase 6.`);

      const stage5CombinedResult = {
        ok: true as const,
        provider: stage5StrictPart1.provider,
        model: stage5StrictPart1.model,
        usage: {
          promptTokens: stage5StrictPart1.usage.promptTokens + stage5StrictPart2.usage.promptTokens,
          completionTokens: stage5StrictPart1.usage.completionTokens + stage5StrictPart2.usage.completionTokens,
          totalTokens: stage5StrictPart1.usage.totalTokens + stage5StrictPart2.usage.totalTokens
        }
      };

      markPhaseFinished(5, stage5CombinedResult, false);
      entry.aiProvider = stage5StrictPart2.provider;
      entry.aiModel = stage5StrictPart2.model;
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
      // CANCELLO 6: Si attiva SOLO quando tutte le Fasi 1, 2, 3, 4 e 5 sono verdi e complete!
      // Provider primario: OpenAI -> Groq -> OpenRouter -> Cloudflare -> Gemini
      // =========================================================================
      markPhaseGenerating(6);
      console.log(`[ALKIMIA] [Stadio 6/6] Redazione FASE 6 (Saggio del Giorno) in corso...`);
      const step2Prompt = buildStep2LiteraryEssayPrompt(parsedStep1, selectedA, selectedB);

      const stage6Strict = await runStrictSequentialStep(
        'Fase 6 (Saggio del Giorno)',
        literarySystemPrompt,
        step2Prompt,
        'phase6',
        (parsedStep2) => extractNormalizedEssay(parsedStep2, solarDateKey)
      );

      const finalEssay = stage6Strict.data;
      const finalProvider = stage6Strict.provider;
      const finalModel = stage6Strict.model;
      console.log(
        `[ALKIMIA] [Stadio 6/6] FASE 6 (Saggio del Giorno) completata con successo via ${finalProvider} (${finalModel}).`
      );

      markPhaseFinished(6, stage6Strict, false);
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
        phaseTelemetry: entry.phaseTelemetry,
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
        `[ALKIMIA] Tutte le 6 Fasi del ${formattedDate} sono state redatte in sequenza rigorosa e salvate con successo (Fase 6 completata da ${finalProvider}/${finalModel}).`
      );
    } catch (pipelineErr: any) {
      entry.status = 'failed';
      entry.error = pipelineErr?.message || String(pipelineErr);
      entry.finishedAt = Date.now();
      entry.edition = {
        ...entry.edition,
        generationStatus: 'failed',
        generationError: entry.error
      };
      console.error(`[ALKIMIA] Catena sequenziale interrotta: ${entry.error}`);
    }
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
    const restoredTelemetry = buildCompletedTelemetryFromSavedDossier(savedDossier, fe);

    const loadedEntry: DailyEditionEntry = {
      solarDateKey,
      cycle: fe.cycle || {
        ...CURRENT_EDITORIAL_CYCLE,
        cyclicalDate: formattedDate,
        nextScheduledPublication: "Al compimento della rotazione diurna"
      },
      edition: {
        ...fe,
        essay: safeEssay,
        phaseTelemetry: restoredTelemetry
      },
      status: 'generated',
      aiProvider: fe.aiProvider || 'groq',
      aiModel: fe.aiModel || 'qwen/qwen3.8-27b',
      phaseTelemetry: restoredTelemetry,
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
  const initialTelemetry = createInitialPhaseTelemetry();

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
    phaseTelemetry: initialTelemetry,
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
    phaseTelemetry: initialTelemetry,
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
