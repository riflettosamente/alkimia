import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const argomenti = [
  "La fisica quantistica",
  "La transcomunicazione strumentale",
  "La tecnologia CRISPR",
  "La ghiandola pineale",
  "Il mondo spirituale",
  "La vita dopo la morte, l'aldilà",
  "I fenomeni UFO",
  "Gli extraterrestri",
];

interface DailyArticleData {
  date: string;
  formattedDate: string;
  topic1: string;
  topic2: string;
  title: string;
  subtitle?: string;
  content: string;
  readingMinutes: number;
}

// In-memory cache for daily articles
const dailyCache = new Map<string, DailyArticleData>();
let simulatedDayOffset = 0;
let articleGenerationCounter = 0;

function getSimulatedDateString(offset: number = 0): string {
  const now = new Date();
  now.setDate(now.getDate() + offset);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // YYYY-MM-DD
}

function getTodayString(): string {
  return getSimulatedDateString(simulatedDayOffset);
}

function getFormattedItalianDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);
}

// Deterministic topic selection based on date string and generation counter
function getDeterministicTopics(dateStr: string): [string, string] {
  let hash = articleGenerationCounter;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  const idx1 = positiveHash % argomenti.length;
  let idx2 = (positiveHash + 3 + (dateStr.charCodeAt(dateStr.length - 1) % 5)) % argomenti.length;
  if (idx2 === idx1) {
    idx2 = (idx1 + 1) % argomenti.length;
  }
  return [argomenti[idx1], argomenti[idx2]];
}

// Domain knowledge generator for poetic/philosophical fallback resilience
function getPoeticEssence(topic: string): { essence: string; voice: string; imagery: string } {
  const t = topic.toLowerCase();
  if (t.includes("quantistica")) {
    return {
      essence: "la trama indivisibile del reale, dove l'osservatore e il fenomeno sciolgono i propri confini nell'atto stesso di guardarsi",
      voice: "un campo di pura potenzialità invisibile che attende un respiro di consapevolezza per farsi forma",
      imagery: "il velo di probabilità che danza primordiale prima del collasso",
    };
  }
  if (t.includes("transcomunicazione")) {
    return {
      essence: "l'eco frequenziale che attraversa la parete del vuoto, catturando nel rumore stocastico un sussurro che appartiene a un'altra sponda",
      voice: "il canale sottile in cui le nostre macchine sintonizzano il respiro di chi ha varcato la soglia",
      imagery: "il rumore di fondo che si condensa in presenza ed inaudita parola",
    };
  }
  if (t.includes("crispr")) {
    return {
      essence: "la riscrittura del verbo biologico, l'arte di sfiorare il nastro intimo della vita per ricomporne la geometria sacra",
      voice: "la mano che impara a modulare il codice primordiale impresso nella carne",
      imagery: "le spirali di luce biologica che si ricompongono nel silenzio della cellula",
    };
  }
  if (t.includes("pineale")) {
    return {
      essence: "la lente di calcite incastonata nel centro dell'encefalo, l'organo di luce che trasduce il visibile nell'infinito",
      voice: "il punto focale dove la chimica del corpo cede il passo al risveglio della visione extracorporea",
      imagery: "i microcristalli che vibrano al primo raggio della consapevolezza primaria",
    };
  }
  if (t.includes("spirituale")) {
    return {
      essence: "l'oceano primordiale della coscienza non-duale, la matrice senza tempo da cui scaturisce ogni architettura di forma",
      voice: "la presenza silenziosa che permea la materia senza mai esserne imprigionata",
      imagery: "la luce senza ombra che sorregge l'impalcatura invisible dei mondi",
    };
  }
  if (t.includes("morte") || t.includes("aldilà")) {
    return {
      essence: "la grande soglia di transizione, il passaggio in cui l'identità si spoglia dell'involucro denso per riassorbirsi nell'origine",
      voice: "la continuità ininterrotta del fiume d'essere oltre il crollo dei sensi organici",
      imagery: "il raggio di ritorno verso il centro di ogni memoria",
    };
  }
  if (t.includes("ufo")) {
    return {
      essence: "le geometrie di luce che curvano la gravità nei cieli, tracciando rotte che eludono le catene del tempo e dell'inerzia",
      voice: "la manifestazione tangibile di una fisica sottratta alle barriere della tridimensionalità",
      imagery: "i bagliori silenziosi che scivolano lungo le pieghe del firmamento",
    };
  }
  // extraterrestri
  return {
    essence: "l'incontro con le intelligenze altre che contemplano il grande arazzo cosmico da coordinate dimensionali remote",
    voice: "gli sguardi lontani che riconoscono nella nostra ricerca la loro stessa origine stellare",
    imagery: "le coscienze che solcano gli abissi tra gli universi",
  };
}

// Generates dynamic, unique text even in offline/fallback conditions adhering strictly to continuous dialogic flow
function createRichEditorialArticle(dateStr: string, t1: string, t2: string): DailyArticleData {
  const formattedDate = getFormattedItalianDate(dateStr);
  const e1 = getPoeticEssence(t1);
  const e2 = getPoeticEssence(t2);

  const title = `Convergenza di Fase: Risonanza tra ${e1.essence.slice(0, 30)}... e ${e2.essence.slice(0, 30)}...`;
  const subtitle = `Un'indagine dialogica profonda sulla natura sistemica dell'invisibile e della carne.`;

  const content = `# ${title}

— Hai mai osservato come la realtà smetta di apparire come un solido quando ne mettiamo in discussione i confini? Se guardiamo oltre la crosta visibile della materia, scopriamo che l'essenza di questo primo dominio non è che ${e1.essence}. Nulla sussiste in isolamento; ogni fenomeno risponde a una matrice di informazione non-locale che non ha ancora un nome definitivo.

— Accetto questa prospettiva. È la medesima vibrazione che affiora quando la mente esplora la natura di ${e2.essence}. Per secoli abbiamo diviso il mondo in compartimenti separati: la fisica da una parte, l'ontologia della coscienza dall'altra, la carne confinata nel tempo e il vuoto percepito come assenza. Ma quando l'osservazione si affina, scorgiamo che la trama è indiscutibilmente una sola.

— Entriamo ora nella vivisezione analitica di questo ponte. Perché questi due aspetti non si limitano ad affiancarsi, ma si richiedono a vicenda? Osserva come ${e1.imagery} e ${e2.imagery} rivelino la stessa geometria sottostante. Quando scendiamo sul piano causale, la struttura fondamentale del primo campo agisce come il supporto materiale o informativo indispensabile affinché la dinamica del secondo possa manifestarsi.

— È qui che la connessione da intuizione diventa principio esatto. L'indagine di ${e1.essence} ci offre la lente teorica per decifrare il meccanismo con cui si manifesta ${e2.essence}. Non ci troviamo di fronte a due narrazioni distinte, ma a un'unica equazione di stato vissuta da due prospettive complementari: l'una detta le condizioni di coerenza del campo, l'altra la risposta della percezione o della vita che lo attraversa.

— Questo trasforma radicalmente il nostro modo di intendere il reale: l'universo non è una collezione di oggetti isolati nel vuoto, ma un processo informativo corale ininterrotto. Ogni impulso biologico, ogni distorsione metrica, ogni segnale captato oltre l'involucro d'origine è la conferma di un'architettura interconnessa. All'interno di questa continuità, l'illusione della separazione si dissolve.

— Resta la presenza. Una risonanza profonda che continua a ricomporsi e a interrogarsi attraverso la nostra stessa coscienza.`;

  return {
    date: dateStr,
    formattedDate,
    topic1: t1,
    topic2: t2,
    title,
    subtitle,
    content,
    readingMinutes: 5,
  };
}

async function generateDailyArticle(dateStr: string): Promise<DailyArticleData> {
  const [topic1, topic2] = getDeterministicTopics(dateStr);
  const formattedDate = getFormattedItalianDate(dateStr);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY non trovata nelle variabili d'ambiente. Uso il generatore editoriale strutturato.");
    return createRichEditorialArticle(dateStr, topic1, topic2);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const candidateModels = [
      "gemini-3.7-flash",
      "gemini-flash-latest",
      "gemini-3.1-pro-preview",
      "gemini-3.6-flash",
    ];

    async function callGeminiWithRetryAndFallback(
      prompt: string,
      models: string[],
      config?: any
    ): Promise<{ text: string; usedModel: string | null }> {
      for (const model of models) {
        const maxRetries = 2;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: prompt,
              config,
            });
            const text = response.text ? response.text.trim() : "";
            if (text) {
              return { text, usedModel: model };
            }
          } catch (err: any) {
            const isNotFound =
              err?.status === "NOT_FOUND" ||
              err?.code === 404 ||
              err?.message?.includes("404") ||
              err?.message?.includes("no longer available") ||
              err?.message?.includes("not found");
            const is503 =
              err?.status === "UNAVAILABLE" ||
              err?.code === 503 ||
              err?.message?.includes("503") ||
              err?.message?.includes("experiencing high demand");
            const isQuota =
              err?.status === "RESOURCE_EXHAUSTED" ||
              err?.code === 429 ||
              err?.message?.includes("429") ||
              err?.message?.includes("quota");

            console.warn(
              `⚠️ Modello ${model} (tentativo ${attempt}/${maxRetries}) non disponibile (${
                isNotFound
                  ? "Modello non supportato 404"
                  : isQuota
                  ? "Quota superata 429"
                  : is503
                  ? "Picco di traffico 503"
                  : err?.message || err
              }).`
            );

            if (isNotFound) {
              // Modello non esistente/deprecato: salta immediatamente senza riprovare
              break;
            }

            if (is503 && attempt < maxRetries) {
              // I picchi di domanda su 503 sono temporanei: attendi brevemente prima di riprovare
              await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
              continue;
            }

            // In caso di 429 o altri errori non-transitori, passa direttamente al modello successivo
            break;
          }
        }
      }
      return { text: "", usedModel: null };
    }

    console.log(`🧠 Inizio pipeline di raffinamento profondo a 3 fasi per: "${topic1}" + "${topic2}"...`);

    // PASS 1: DEEP ONTOLOGICAL BREAKDOWN & SYSTEMIC MAPPING
    const pass1Prompt = `Sei uno scienziato teorico, filosofo della fisica e saggista interdisciplinare di frontiera.
Devi compiere una disamina concettuale ad altissimo livello di rigore scientifico e profondità ontologica sull'intersezione tra due domini:
1. ${topic1}
2. ${topic2}

Svolgi un'analisi dettagliata rispondendo con precisione a questi punti:
- Quali sono i principi fisici, informativi, biologici o metafisici effettivi che reggono ciascuno dei due ambiti?
- Qual è il punto esatto di risonanza sistemica e la connessione non ovvia tra loro? (Spiega il meccanismo esatto attraverso cui le proprietà del primo ambito dialogano strutturalmente con le dinamiche del secondo).
- Quale nuova prospettiva teorica o visione d'insieme emerge unificando questi due orizzonti?

Fornisci un'analisi ricca, densa di argomentazioni precise e priva di banalità.`;

    const pass1Result = await callGeminiWithRetryAndFallback(pass1Prompt, candidateModels, { temperature: 0.7 });
    if (!pass1Result.text) {
      console.warn("⚠️ Nessun modello Gemini disponibile al momento. Uso fallback editoriale.");
      return createRichEditorialArticle(dateStr, topic1, topic2);
    }

    const pass1Analysis = pass1Result.text;
    const activeModel = pass1Result.usedModel || candidateModels[0];
    const preferredModels = [activeModel, ...candidateModels.filter((m) => m !== activeModel)];

    console.log(`✅ FASE 1 COMPLETATA (${activeModel}): Mappatura ontologica generata (${pass1Analysis.length} caratteri).`);

    // PASS 2: CRITICAL REVIEW, EXPANSION & MULTI-DRAFT REFINEMENT LOOP
    const pass2Prompt = `Sei un severo revisore accademico ed epistemologo. Analizza criticamente questa prima bozza:

--- ANALISI FASE 1 ---
${pass1Analysis}
--- FINE ANALISI ---

Raffina e potenzia questa elaborazione:
1. Rileva ed elimina ogni semplificazione eccessiva, metafora trita o ragionamento circolare.
2. Rafforza il "ponte concettuale" tra ${topic1} e ${topic2}, rendendolo inattaccabile sul piano logico, fisico ed euristico.
3. Struttura un confronto dialettico serrato tra due prospettive di pensiero avanzato che esplorano insieme i paradossi e le implicazioni ultime di questa convergenza.

Riscrivi il testo elevandone al massimo grado la densità argomentativa.`;

    const pass2Result = await callGeminiWithRetryAndFallback(pass2Prompt, preferredModels, { temperature: 0.8 });
    const pass2Refinement = pass2Result.text || pass1Analysis;
    console.log(`✅ FASE 2 COMPLETATA: Raffinamento e sintesi critica avanzata (${pass2Refinement.length} caratteri).`);

    // PASS 3: MASTERWORK SYNTHESIS IN CONTINUOUS DIALOGIC FLOW
    const masterPrompt = `Sei un maestro della saggistica filosofico-scientifica e della letteratura dialettica.

Hai a disposizione il seguente materiale di analisi e sintesi critica elaborato nelle fasi precedenti:

--- RAGIONAMENTO RAFFINATO FASE 2 ---
${pass2Refinement}
--- FINE MATERIALE ---

Trasforma questa profonda elaborazione in un SAGGIO DIALOGICO MAGISTRALE, armonico e fluido, rispettando TASSATIVAMENTE queste regole:

1. FLUSSO CONTINUO E UNICUUM SENZA SUDDIVISIONI IN SEZIONI:
   - Scrivi l'articolo come un UNICO FLUSSO CONTINUO in prosa di alto profilo.
   - NON inserire titoli intermedi, sottotitoli di paragrafo (NO '##', NO 'Capitolo', NO 'Parte', NO 'Analisi'), e NESSUN elenco puntato o numerato.
   - Il testo deve progredire con ritmo ipnotico e naturale da un'apertura contemplativa all'apice della speculazione concettuale.

2. FORMA DIALOGICA A DUE VOCI CON TRATTINI LUNGHI '—':
   - Alterna le battute delle due voci usando il trattino lungo '—'. Non deve essere una chiacchierata ordinaria, ma uno scambio serrato di intuizioni filosofiche, dimostrazioni intuitive e contro-obiezioni raffinate tra due menti eccellenti.

3. ELEGANZA ED EVITAMENTO DEL DIDASCALISMO:
   - NON citare in modo scolastico o pedante i termini letterali "${topic1}" o "${topic2}". Evoca ed esprimi la loro sostanza viva attraverso le leggi fisiche, le dinamiche di campo e i processi descritti.

4. PROFONDITÀ E RIGORE:
   - Mantieni integra l'intera potenza del ragionamento elaborato nelle Fasi 1 e 2: ordine informativo, entanglement, campo di coscienza, entropia e biologia sottile.

DEVI RESTITUIRMI L'OUTPUT STRUTTURATO ESATTAMENTE CON QUESTI SEPARATORI:

---SINTESI---
[Inserisci qui un'intuizione fulminante di 1-2 frasi (max 30 parole) che condensi l'essenza della scoperta]

---TITOLO---
[Inserisci un Titolo poetico, saggistico ed evocativo per l'articolo]

---ARTICOLO---
# [Inserisci qui lo stesso Titolo dell'articolo]

[Inserisci l'intero saggio dialogico in un unico flusso continuo articolato in paragrafi fluidi con trattini '—', SENZA sottotitoli '##' e SENZA elenchi puntati]`;

    const pass3Result = await callGeminiWithRetryAndFallback(masterPrompt, preferredModels, { temperature: 0.85 });
    const generatedText = pass3Result.text ? pass3Result.text.trim() : "";

    if (!generatedText) {
      console.warn("⚠️ Generazione finale vuota. Attivazione fallback generativo.");
      return createRichEditorialArticle(dateStr, topic1, topic2);
    }

    let subtitle = `Sintesi delle convergenze e risonanze profonde di oggi.`;
    let title = `L'Eco della Sottile Risonanza`;
    let articleContent = generatedText;

    if (generatedText.includes("---SINTESI---") && generatedText.includes("---TITOLO---") && generatedText.includes("---ARTICOLO---")) {
      const parts = generatedText.split(/---SINTESI---|---TITOLO---|---ARTICOLO---/);
      if (parts.length >= 4) {
        subtitle = parts[1].trim();
        title = parts[2].trim().replace(/^#\s*/, "").replace(/\*\*/g, "");
        articleContent = parts[3].trim();
      }
    } else {
      const lines = generatedText.split("\n");
      const titleLine = lines.find((l) => l.startsWith("# "));
      if (titleLine) {
        title = titleLine.replace(/^#\s*/, "").replace(/\*\*/g, "").trim();
      }
    }

    // Clean up any rogue headings or list markers to strictly enforce continuous flow
    articleContent = articleContent
      .replace(/^##+\s*(.*)$/gm, "$1")
      .replace(/^[\*\-]\s+/gm, "")
      .replace(/^\d+\.\s+/gm, "");

    const wordCount = articleContent.split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.max(3, Math.round(wordCount / 200));

    return {
      date: dateStr,
      formattedDate,
      topic1,
      topic2,
      title,
      subtitle,
      content: articleContent,
      readingMinutes,
    };
  } catch (error: any) {
    console.warn("⚠️ Avviso durante la generazione Gemini, attivazione fallback integrato:", error?.message || error);
    return createRichEditorialArticle(dateStr, topic1, topic2);
  }
}

// API endpoint to get today's article
app.get("/api/daily-article", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const forceRefresh = req.query.force === "true" || req.query.nextDay === "true";
    if (forceRefresh) {
      simulatedDayOffset++;
      articleGenerationCounter++;
    }
    const targetDate = getTodayString();
    
    if (!forceRefresh && dailyCache.has(targetDate)) {
      return res.json(dailyCache.get(targetDate));
    }

    const article = await generateDailyArticle(targetDate);
    dailyCache.set(targetDate, article);
    return res.json(article);
  } catch (err: any) {
    const targetDate = getTodayString();
    const [topic1, topic2] = getDeterministicTopics(targetDate);
    const fallback = createRichEditorialArticle(targetDate, topic1, topic2);
    return res.json(fallback);
  }
});

// Endpoint for app health
app.get("/api/health", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ status: "ok", time: new Date().toISOString() });
});

async function startServer() {
  // Pre-warm daily cache in background so initial hit is instant
  const today = getTodayString();
  generateDailyArticle(today).then((art) => {
    dailyCache.set(today, art);
  }).catch(() => {
    const [t1, t2] = getDeterministicTopics(today);
    dailyCache.set(today, createRichEditorialArticle(today, t1, t2));
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
