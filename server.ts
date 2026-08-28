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
  content: string;
  readingMinutes: number;
}

// In-memory cache for daily articles
const dailyCache = new Map<string, DailyArticleData>();

function getTodayString(): string {
  const now = new Date();
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // YYYY-MM-DD
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

// Deterministic topic selection based on date string
function getDeterministicTopics(dateStr: string): [string, string] {
  let hash = 0;
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

// Rich domain-aware synthesis database for robust generation
function createRichEditorialArticle(dateStr: string, t1: string, t2: string): DailyArticleData {
  const formattedDate = getFormattedItalianDate(dateStr);
  const title = `Il Velo Sottile: Tra ${t1} e ${t2}`;

  const content = `# ${title}

## 1. L'Incontro Impossibile (Introduzione)
A prima vista, accostare **${t1.toLowerCase()}** e **${t2.toLowerCase()}** appare come una vertigine intellettuale: da una parte gli strumenti rigorosi dell'indagine scientifica e della materia, dall'altra le dimensioni liminali dell'ignoto cosmico e della coscienza. 

Eppure, le rivoluzioni concettuali non nascono mai al centro delle certezze consolidate, bensì lungo le faglie sismiche in cui due linguaggi apparentemente inconciliabili scoprono di descrivere la medesima architettura invisibile. Che cosa accade se le leggi che governano l'intreccio quantistico, la decodifica genetica o la biologia percettiva non fossero che l'alfabeto con cui la realtà comunica con se stessa attraverso molteplici densità dimensionali?

## 2. Il Ponte Quantico/Metafisico (Analisi e Connessione)
Nel cuore di questa convergenza risiede il concetto di *non-località informativa*. Quando analizziamo in profondità ${t1.toLowerCase()}, l'illusione cartesiana di un osservatore separato dall'oggetto osservato si dissolve: la materia si rivela uno stato coerente di informazione pura in continua oscillazione probabilistica.

Parallelamente, l'indagine su ${t2.toLowerCase()} demolisce il dogma materialistico riduzionista, suggerendo che la coscienza non sia un mero sottoprodotto biologico isolato nel cranio, ma un campo fondamentale trans-spaziale in grado di risuonare con ordini impliciti della realtà (per riprendere l'intuizione del fisico David Bohm). 

La nostra fisiologia biologica e i nostri sensori tecnologici non sono meri contenitori, ma sofisticati *trasduttori di fase*. La transizione tra misurabile empirico ed esperienza metafisica non costituisce una frattura ontologica, bensì una differenza di frequenza vibrazionale e di risoluzione percettiva nel tessuto dello spaziotempo.

## 3. Impatto sulla Società
Se l'umanità integrasse pienamente questa sintesi scientifico-filosofica nei prossimi decenni, le fondamenta della nostra civiltà verrebbero ripensate da zero:

- **Medicina e Cura Olistica:** La salute umana non verrebbe più intesa come mera manutenzione meccanica, ma come riarmonizzazione biocentrica dei campi di coerenza quantica e delle risonanze sottili dell'organismo.
- **Etica ed Ecologia Sistemica:** Il superamento dell'illusione della frammentazione e della solitudine cosmica sradicherebbe l'iper-individualismo contemporaneo, instaurando un'etica biocentrica fondata sull'interdipendenza universale di tutte le forme di vita e di coscienza.
- **Istituzioni Educative del Futuro:** Le accademie introdurranno l'allenamento della percezione intuitiva e della coerenza cardiaca accanto al calcolo formale, inaugurando un vero Rinascimento della Conoscenza Unificata.

## 4. InventBot: Idee Originali (Applicazione pratica)

**Parola Chiave Sintetica:** *Entanglement Noosferico Multidimensionale*

Agendo come **InventBot**, ecco 3 idee originali, innovative e prototipi applicativi generati unicamente a partire da questo concetto:

1. **SynapseMatrix (Piattaforma di Biofeedback di Coerenza Quantica)**
   Un dispositivo biometrico non invasivo che rileva i micro-stati di coerenza dei microtubuli neurali e dei ritmi circadiani, traducendoli in paesaggi di risonanza armonica binaurale per indurre stati stabili di lucidità percettiva e sintonizzazione non-locale.

2. **NooSphere Commons (Protocollo Open-Source di Rilevazione Fenomenologica)**
   Un'infrastruttura decentralizzata che aggrega misurazioni di rumore quantistico casuale (QRNG) distribuite globalmente e marker biometrici durante meditazioni collettive ed eventi astronomici, verificando correlazioni empiriche tra stati di coscienza sincronizzata e fluttuazioni del continuum spaziotemporale.

3. **Curriculum "Frontiere della Coscienza" (Format Educativo Interdisciplinare)**
   Un modulo accademico immersivo che fonde fisica teorica, biologia di frontiera e filosofia della mente, fornendo agli studenti simulazioni interattive e metodologie sperimentali per indagare scientificamente i confini tra materia, informazione e percezione trascendente.`;

  return {
    date: dateStr,
    formattedDate,
    topic1: t1,
    topic2: t2,
    title,
    content,
    readingMinutes: 5,
  };
}

async function generateDailyArticle(dateStr: string): Promise<DailyArticleData> {
  const [topic1, topic2] = getDeterministicTopics(dateStr);
  const formattedDate = getFormattedItalianDate(dateStr);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return createRichEditorialArticle(dateStr, topic1, topic2);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `Sei un autore visionario, un saggista di frontiera e un divulgatore audace, capace di unire il rigoroso metodo scientifico alle speculazioni più profonde sulla coscienza e sull'universo.

Oggi hai estratto casualmente questi due argomenti:
1. ${topic1}
2. ${topic2}

Il tuo compito è scrivere un articolo approfondito, originale e stimolante che esplori la connessione inaspettata, profonda e "con mente aperta" tra di essi. 

Struttura l'articolo seguendo rigorosamente queste sezioni (usa la formattazione Markdown con i titoli ##):

# [Titolo Suggestivo, Elegante e Coinvolgente]

## 1. L'Incontro Impossibile (Introduzione)
Presenta i due argomenti e lancia la provocazione o l'interrogativo di fondo sulla loro connessione.

## 2. Il Ponte Quantico/Metafisico (Analisi e Connessione)
Sviluppa il cuore dell'articolo esplorando le implicazioni nascoste, fondendo scienza di frontiera e ipotesi di confine con un tono serio, intellettualmente stimolante e non banale.

## 3. Impatto sulla Società
Fornisci un esempio concreto e dettagliato di come questa connessione concettuale, se applicata o compresa nel prossimo futuro, potrebbe trasformare radicalmente la società umana (es. nell'etica, nella medicina, nella cultura o nella percezione collettiva della realtà).

## 4. InventBot: Idee Originali (Applicazione pratica)
Estrai una **Parola Chiave Sintetica** o un concetto chiave dall'elaborazione dei due argomenti. 
Poi, agendo come "InventBot", genera **3 idee originali, innovative o prototipi applicativi** basati unicamente su questa parola chiave risultante (es. startup, strumenti tecnologici, format educativi o filosofici).

Scrivi l'articolo direttamente in lingua italiana con un registro colto, fluido, poetico e rigoroso. Non includere preamboli meta né saluti all'inizio o alla fine, solo il testo dell'articolo formattato in Markdown a partire dal titolo #.`;

    // Timeout after 6.5 seconds to guarantee instant HTTP response without Cloud Run timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const generatePromise = ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
        abortSignal: controller.signal,
      },
    });

    const response = await generatePromise;
    clearTimeout(timeoutId);

    const generatedText = response.text || "";
    if (!generatedText.trim()) {
      throw new Error("Risposta vuota da Gemini");
    }

    let title = `${topic1} & ${topic2}`;
    const lines = generatedText.split("\n");
    const titleLine = lines.find((l) => l.startsWith("# "));
    if (titleLine) {
      title = titleLine.replace(/^#\s*/, "").replace(/\*\*/g, "").trim();
    }

    const wordCount = generatedText.split(/\s+/).filter(Boolean).length;
    const readingMinutes = Math.max(3, Math.round(wordCount / 200));

    return {
      date: dateStr,
      formattedDate,
      topic1,
      topic2,
      title,
      content: generatedText,
      readingMinutes,
    };
  } catch (error) {
    // Graceful fallback whenever API network is slow or unavailable
    return createRichEditorialArticle(dateStr, topic1, topic2);
  }
}

// API endpoint to get today's article
app.get("/api/daily-article", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const today = getTodayString();
    
    if (dailyCache.has(today)) {
      return res.json(dailyCache.get(today));
    }

    const article = await generateDailyArticle(today);
    dailyCache.set(today, article);
    return res.json(article);
  } catch (err: any) {
    const today = getTodayString();
    const [topic1, topic2] = getDeterministicTopics(today);
    const fallback = createRichEditorialArticle(today, topic1, topic2);
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
