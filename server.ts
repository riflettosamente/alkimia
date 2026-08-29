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

// Domain knowledge generator for fallback resilience
function getTopicConcept(topic: string): { domain: string; essence: string; tech: string; future: string } {
  const t = topic.toLowerCase();
  if (t.includes("quantistica")) {
    return {
      domain: "meccanica quantistica e teoria dell'informazione fondamentale",
      essence: "la natura non-locale della realtà, il principio di indeterminazione e l'effetto dell'osservatore che collassa la funzione d'onda",
      tech: "dispositivi di coerenza quantistica e sensori a superconduttività",
      future: "la comprensione che la materia è uno stato condensato di pura probabilità informativa interconnessa",
    };
  }
  if (t.includes("transcomunicazione")) {
    return {
      domain: "transcomunicazione strumentale e ponti di segnale frequenziale",
      essence: "l'interazione tra onde elettromagnetiche, rumore bianco stocastico e modulazioni di coscienza extra-corporee",
      tech: "ricevitori ad eterodina a banda ultralarga e analizzatori di spettro a risonanza scalare",
      future: "lo sviluppo di canali di comunicazione stabili attraverso le soglie dimensionali dell'etere",
    };
  }
  if (t.includes("crispr")) {
    return {
      domain: "editing genomico di precisione e biologia sintetica",
      essence: "la riprogrammazione dell'architettura del DNA come codice sorgente vivente suscettibile a modifiche epigenetiche",
      tech: "vettori molecolari guidati da RNA e sintetizzatori di sequenze biologiche programmate",
      future: "l'evoluzione auto-diretta del veicolo biologico per ampliare la gamma di frequenze percettive umane",
    };
  }
  if (t.includes("pineale")) {
    return {
      domain: "neuro-endocrinologia esoterica e piezoelettricità biologica",
      essence: "l'attività dei microcristalli di calcite nella ghiandola pineale capaci di trasduzione elettromagnetica e rilascio di molecole enteogeniche",
      tech: "risonatori a campo magnetico pulsato focalizzati sulla regione epifisaria",
      future: "il risveglio consapevole dell'organo di senso trans-dimensionale innato nella fisiologia umana",
    };
  }
  if (t.includes("spirituale")) {
    return {
      domain: "metafisica non-dualistica e piani sottili dell'esistenza",
      essence: "l'esistenza di gerarchie di densità vibrazionale e campi di coscienza pura non vincolati alle coordinate spaziotemporali",
      tech: "camere di isolamento sensoriale a schermatura di Faraday con bio-risonatori di Schumann",
      future: "l'unificazione definitiva tra indagine empirica e ontologia mistica della consapevolezza",
    };
  }
  if (t.includes("morte") || t.includes("aldilà")) {
    return {
      domain: "tanatologia di frontiera e continuità della coscienza oltre la transizione biologica",
      essence: "l'esperienza di premorte (NDE) e la persistenza del campo di memoria identitaria oltre la cessazione delle funzioni neurovegetative",
      tech: "monitor di coerenza sinaptica profonda e rilevatori di campo bio-fotonico post-mortem",
      future: "la demistificazione scientifica del passaggio tra incarnazione biologica e stato di pura energia cosciente",
    };
  }
  if (t.includes("ufo")) {
    return {
      domain: "fenomenologia aerea non identificata e aerospazio iperdimensionale",
      essence: "il controllo delle metriche gravitazionali, la distorsione dello spaziotempo e le propulsioni magneto-idrodinamiche avanzate",
      tech: "interferometri gravitazionali differenziali e rilevatori di flussi tachionici",
      future: "la scoperta di tecnologie in grado di piegare la curvatura locale dell'universo eludendo le forze d'inerzia",
    };
  }
  // Default extraterrestri / altro
  return {
    domain: "esobiologia avanzata e intelligenze coscienti non-terrestri",
    essence: "l'interazione con civiltà esogene a differente stadio di evoluzione tecnologica e frequenziale",
    tech: "array di radiotelescopi quantistici a correlazione di fase e linguaggi simbolici universali",
    future: "l'integrazione della specie umana in una comunità di intelligenze galattiche interconnesse",
  };
}

// Generates dynamic, unique text even in offline/fallback conditions
function createRichEditorialArticle(dateStr: string, t1: string, t2: string): DailyArticleData {
  const formattedDate = getFormattedItalianDate(dateStr);
  const c1 = getTopicConcept(t1);
  const c2 = getTopicConcept(t2);

  const title = `Convergenza di Fase: Quando ${t1} Ridisegna ${t2}`;

  const cleanT1 = t1.replace(/^(La|Il|I|Gli|Le)\s+/i, "");
  const cleanT2 = t2.replace(/^(La|Il|I|Gli|Le)\s+/i, "");
  const syntheticKeyword = `${cleanT1.split(" ")[0]}-${cleanT2.split(" ")[0]} Risonante`;

  const content = `# ${title}

## 1. L'Incontro Impossibile (Introduzione)
Nel panorama del pensiero convenzionale, accostare **${t1.toLowerCase()}** e **${t2.toLowerCase()}** appare inizialmente come una provocazione paradossale: da una parte troviamo ${c1.domain}, dall'altra ${c2.domain}.

Eppure, la storia delle più grandi rivoluzioni scientifiche ci insegna che i salti di paradigma non avvengono quasi mai lungo i binari consueti delle singole discipline, ma nel punto esatto in cui due vettori apparentemente disgiunti si intersecano. Se consideriamo che ${t1.toLowerCase()} esplora ${c1.essence}, mentre ${t2.toLowerCase()} affronta ${c2.essence}, emerge con forza un'ipotesi audace: e se queste due realtà non fossero che due diverse manifestazioni della medesima dinamica informazionale dell'universo?

## 2. Il Ponte Quantico/Metafisico (Analisi e Connessione)
Scavando al di sotto della superficie dei fenomeni, il legame tra questi due ambiti si rivela profondo e strutturale. Quando analizziamo ${t1.toLowerCase()}, ci rendiamo conto che i confini della materia e dell'indagine convenzionale cedono il passo a dinamiche non-locali. La separazione tra osservatore e campo osservato si assottiglia progressivamente.

Parallelamente, l'indagine su ${t2.toLowerCase()} suggerisce che la percezione, la materia e la coscienza sono intimamente intrecciate in un continuum cibernetico e ontologico. La connessione risiede nel fatto che entrambi i campi richiedono un cambio radicale di prospettiva: la realtà cessa di essere un aggregato di oggetti isolati e si rivela come un campo dinamico di interazioni coerenti.

Integrando le scoperte di ${t1.toLowerCase()} con la fenomenologia di ${t2.toLowerCase()}, possiamo ipotizzare che ${c1.future} possa fornire il substrato teorico per comprendere ${c2.future}. In questo orizzonte, gli strumenti della scienza più avanzata diventano la chiave per decodificare ciò che per secoli è stato relegato al mito o all'anomalia.

## 3. Impatto sulla Società
Se l'umanità riuscisse a sintetizzare organicamente questi due domini nel corso dei prossimi decenni, l'impatto sul tessuto sociale e tecnologico sarebbe radicale:

- **Evoluzione della Conoscenza:** La fine definitiva della separazione tra scienze dure e studi sulla coscienza porterà alla nascita di un nuovo paradigma epistemologico unificato.
- **Tecnologie di Risonanza:** L'applicazione congiunta di ${c1.tech} e ${c2.tech} permetterà lo sviluppo di dispositivi bio-informatici capaci di amplificare la consapevolezza collettiva.
- **Rifondazione Etico-Sociale:** Il superamento dell'illusione di frammentazione genererà una nuova etica biocentrica globale, in cui la salvaguardia dell'ecosistema e dell'armonia comunitaria diverrà una naturale conseguenza della comprensione dell'interconnessione universale.

## 4. InventBot: Idee Originali (Applicazione pratica)

**Parola Chiave Sintetica:** *${syntheticKeyword}*

Agendo come **InventBot**, ecco 3 idee originali e prototipi applicativi generati specificamente a partire dalla sintesi tra ${cleanT1} e ${cleanT2}:

1. **${cleanT1}Nexus (Interfaccia di Sintonia Frequenziale)**
   Un sistema integrato che combina ${c1.tech} con algoritmi di analisi del segnale, progettato per mappare e stabilizzare gli scambi di informazione tra stati biologici e campi di risonanza sottile.

2. **${cleanT2} Protocol (Infrastruttura Decentralizzata di Ricerca)**
   Una rete peer-to-peer aperta che raccoglie dati biometrici ed elettromagnetici in tempo reale da laboratori indipendenti di tutto il mondo, validando scientificamente le correlazioni tra ${t1.toLowerCase()} e ${t2.toLowerCase()}.

3. **Accademia "Oltre la Soglia" (Programma Formativo Interdisciplinare)**
   Un percorso accademico immersivo che forma una nuova generazione di ricercatori e pensatori capaci di operare simultaneamente sui principi di ${c1.domain} e ${c2.domain}, unendo rigore analitico e intuizione di frontiera.`;

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
    console.warn("⚠️ GEMINI_API_KEY non trovata nelle variabili d'ambiente. Uso il generatore editoriale strutturato.");
    return createRichEditorialArticle(dateStr, topic1, topic2);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Sei un autore visionario, un saggista di frontiera e un filosofo della scienza audace, capace di unire il rigoroso metodo scientifico alle speculazioni più profonde sulla coscienza e sull'universo.

Oggi hai estratto casualmente questi due argomenti:
1. ${topic1}
2. ${topic2}

Il tuo compito è scrivere un saggio inedito, approfondito, entusiasmante e intellettualmente rigoroso che esplori la connessione inaspettata tra questi due temi specifici. 

CRITICO: L'articolo DEVE essere scritto da zero appositamente per questa specifica coppia di argomenti (${topic1} e ${topic2}). Tutti i paragrafi, le metafore, le analisi e le invenzioni devono derivare direttamente ed esclusivamente dalla fusione di questi due temi. Non utilizzare formule generiche o inventori/concetti standardizzati.

Struttura l'articolo seguendo esattamente queste sezioni in Markdown:

# [Crea un titolo poetico, potente ed evocativo per questa specifica unione]

## 1. L'Incontro Impossibile (Introduzione)
Presenta i due argomenti (${topic1} e ${topic2}) spiegando perché apparentemente appartengono a mondi diversi e poni la domanda cruciale sulla loro reale convergenza.

## 2. Il Ponte Quantico/Metafisico (Analisi e Connessione)
Sviluppa l'analisi dettagliata (almeno 3-4 paragrafi ricchi di contenuto e riferimenti) che dimostra il legame intimo tra la fenomenologia di ${topic1} e quella di ${topic2}.

## 3. Impatto sulla Società
Descrivi con 3 punti elenco chiari e articolati come la comprensione di questa unione rivoluzionerà la vita umana nei prossimi decenni (nella scienza, nella medicina/biologia, nella società o nell'etica).

## 4. InventBot: Idee Originali (Applicazione pratica)

**Parola Chiave Sintetica:** *[Crea una parola o locuzione sintetica originale che esprima l'essenza di ${topic1} + ${topic2}]*

Agendo come **InventBot**, genera **3 idee originali, prototipi o progetti applicativi inediti e concreti** nati esclusivamente dalla parola chiave sintetica creata:
1. **[Nome Invenzione 1]** - descrizione dettagliata del funzionamento e scopo
2. **[Nome Invenzione 2]** - descrizione dettagliata del funzionamento e scopo
3. **[Nome Invenzione 3]** - descrizione dettagliata del funzionamento e scopo

Scrivi l'articolo interamente in italiano con un registro saggistico elegante, accattivante, senza preamboli o saluti, iniziando direttamente dal titolo #.`;

    // Try primary recommended models in sequence with generous timeout
    const candidateModels = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest"];
    let generatedText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`Tentativo generazione articolo con modello ${modelName} per argomenti: "${topic1}" + "${topic2}"...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.85,
          },
        });

        if (response.text && response.text.trim().length > 100) {
          generatedText = response.text.trim();
          console.log(`✅ Articolo generato con successo tramite ${modelName} (${generatedText.length} caratteri).`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Modello ${modelName} ha restituito un errore:`, err?.message || err);
      }
    }

    if (!generatedText) {
      throw lastError || new Error("Nessun modello Gemini ha generato testo valido");
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
  } catch (error: any) {
    console.error("❌ Errore durante la generazione Gemini:", error?.message || error);
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
