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
  const subtitle = `La materia e la coscienza non sono entità separate, ma frequenze modulari di una medesima matrice informativa sottostante.`;

  const cleanT1 = t1.replace(/^(La|Il|I|Gli|Le)\s+/i, "");
  const cleanT2 = t2.replace(/^(La|Il|I|Gli|Le)\s+/i, "");
  const syntheticKeyword = `${cleanT1.split(" ")[0]}-${cleanT2.split(" ")[0]} Risonante`;

  const content = `# ${title}

## 1. L'Incontro Impossibile (Introduzione)
Avete mai provato ad accostare nello stesso pensiero due mondi come **${t1.toLowerCase()}** e **${t2.toLowerCase()}**? A prima vista sembra un cortocircuito intellettuale: da una parte ci muoviamo nell'ambito di ${c1.domain}, dall'altra ci addentriamo nei territori di ${c2.domain}. Due universi che nel racconto comune viaggiano su binari paralleli, destinati a non sfiorarsi mai.

Eppure, basta soffermarsi un attimo a guardare oltre la superficie per sentire una vibrazione condivisa. Quando osserviamo da vicino ${t1.toLowerCase()}, scopriamo che indaga ${c1.essence}; e quando apriamo lo sguardo a ${t2.toLowerCase()}, ci ritroviamo di fronte a ${c2.essence}. Improvvisamente il velo si squarcia: non siamo davanti a due fenomeni isolati, ma a due linguaggi diversi che tentano di descrivere la stessa matrice profonda della realtà. È proprio da questa scintilla inattesa che parte l'esplorazione di oggi.

## 2. Il Ponte Quantico/Metafisico (Analisi e Connessione)
Proviamo ora a spingerci più a fondo. Cosa succede se prendiamo le leggi di **${t1.toLowerCase()}** e le sovrapponiamo al funzionamento di **${t2.toLowerCase()}**?

Immaginiamo per un istante la realtà non come un mosaico di tasselli rigidi, ma come una rete viva. Quando analizziamo ${t1.toLowerCase()}, ci rendiamo conto che le spiegazioni tradizionali iniziano a scricchiolare: emergono dinamiche fluide, dove ${c1.essence}. Ma è qui che accade la magia concettuale: se rivolgiamo lo sguardo a ${t2.toLowerCase()}, ritroviamo esattamente la stessa struttura sottostante, indirizzata verso ${c2.essence}.

Non si tratta di una pura coincidenza poetica. Connettere questi due mondi significa comprendere che ${c1.future} offre lo specchio perfetto per decifrare ${c2.future}. Invece di trattarli come compartimenti stagni, iniziamo a vederli come un unico dialogo: gli strumenti e il rigore di ${t1.toLowerCase()} diventano la chiave di lettura per illuminare gli aspetti più sfuggenti e affascinanti di ${t2.toLowerCase()}. È l'inizio di una mappa teorica completamente nuova.

## 3. Impatto sulla Società
Cosa significa tutto questo per la nostra vita di tutti i giorni? Quando un'intuizione di questa portata scende dal piano teorico al tessuto sociale, non cambia soltanto la scienza: si trasforma il nostro modo di vivere, curarci e percepire il mondo intorno a noi.

- **Rivoluzione nella Salute e nel Benessere:** Immaginate cosa accade quando la precisione di ${t1.toLowerCase()} incontra la visione di ${t2.toLowerCase()}. Le terapie del futuro smetteranno di trattare il corpo come una macchina isolata, muovendosi verso protocolli di medicina integrata capaci di intervenire direttamente sui modelli di ${c1.essence} e ${c2.essence}.
- **Tecnologie di Nuova Generazione:** Dall'unione di ${c1.tech} e ${c2.tech} non nasceranno semplici strumenti più veloci, ma veri e propri ecosistemi tecnologici capaci di interagire in modo armonico ed empatico con l'ambiente e con la coscienza umana.
- **Un Nuovo Senso di Comunità ed Etica:** Capire che ${t1.toLowerCase()} e ${t2.toLowerCase()} parlano la stessa lingua dissolve il senso di separazione. Nelle nostre città e nelle relazioni quotidiane, questo si traduce in una nuova etica condivisa: ci riscopriamo parte di un'unica trama complessa, dove ogni scelta individuale risuona sull'intero equilibrio globale.

## 4. InventBot: Idee Originali (Applicazione pratica)

**Parola Chiave Sintetica:** *${syntheticKeyword}*

Arrivati a questo punto, viene spontaneo chiedersi: se questa sinergia tra **${t1.toLowerCase()}** e **${t2.toLowerCase()}** è profonda e reale, come possiamo toccarla con mano nella vita quotidiana? Agendo come **InventBot**, ho immaginato 3 prototipi d'avanguardia — tre applicazioni concrete e audaci nate direttamente dalla scintilla di questa esplorazione:

1. **${cleanT1}Nexus (Interfaccia di Sintonia Frequenziale)**
   Immaginate un dispositivo ergonomico di nuova generazione capace di rilevare le micro-fluttuazioni del vostro organismo e di sintonizzarle con i principi di ${c1.domain}. Invece di limitarsi a mostrare cifre fredde su uno schermo, ${cleanT1}Nexus emette un campo di micro-risonanza che guida la persona verso uno stato di coerenza profonda, integrando in tempo reale le dinamiche di ${c1.essence} con quelle di ${c2.essence}.

2. **${cleanT2} Protocol (Infrastruttura Decentralizzata di Risonanza)**
   Cosa succederebbe se scienziati, ricercatori e cittadini potessero connettere i propri dati biometrici e ambientali in una piattaforma viva e condivisa? Questo protocollo aperto crea una rete globale peer-to-peer che mappa in tempo reale le correlazioni tra ${t1.toLowerCase()} e ${t2.toLowerCase()}, dimostrando sul campo che l'interconnessione non è solo una teoria affascinante, ma una forza tecnologica misurabile.

3. **Laboratorio "Oltre la Soglia" (Esperienza Immersiva di Co-Creazione)**
   Un ambiente di simulazione olografica e sensoriale progettato per formare la prima generazione di inventori interdisciplinari. Entrando in questo spazio, gli utenti imparano a combinare in modo intuitivo gli strumenti di ${c1.domain} con la sensibilità di ${c2.domain}, sperimentando con prototipi di ${c1.tech} e ${c2.tech} per risolvere problemi complessi del nostro tempo.`;

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

    const prompt = `Sei un autore visionario, un saggista di frontiera e un filosofo della scienza audace.

Oggi ti vengono affidati questi due domini di partenza:
1. ${topic1}
2. ${topic2}

PROCESSO CREATIVO ED EDITORIALE:
1. Prima sviluppa l'intero saggio analizzando in profondità la convergenza concettuale tra ${topic1} e ${topic2}.
2. Una volta completata la stesura dell'articolo, rileggilo integralmente e distillane l'intuizione filosofico-scientifica fondamentale da inserire nella SINTESI DELL'ESPLORAZIONE.

REGOLE PER LA PARTE 1 - L'INCONTRO IMPOSSIBILE (INTRODUZIONE):
- Deve essere descrittiva, colloquiale, avvincente e narrativa, come un appassionato storyteller della scienza che parla direttamente al lettore ("Avete mai provato a pensare...").
- Prendi spunto direttamente dalla sinergia profonda da cui nasce l'articolo: non fare un'introduzione accademica o un elenco sterile di definizioni.
- Dipingi in modo vivido il cortocircuito concettuale tra ${topic1} e ${topic2}, mostrando come due mondi apparentemente lontani rivelino una vibrazione comune che invita a proseguire la lettura.

REGOLE PER LA PARTE 2 - IL PONTE QUANTICO/METAFISICO (ANALISI E CONNESSIONE):
- Deve essere l'apice dell'indagine: descrittiva, fluida e accessibile, pur mantenendo un profondo rigore intellettuale.
- Evita toni enciclopedici o accademici aridi. Utilizza metafore vivide, esempi figurativi ed esperimenti mentali per far "toccare con mano" al lettore come ${topic1} e ${topic2} si fondano.
- Connetti gli aspetti tangibili e scientifici di un tema con quelli concettuali o filosofici dell'altro, mostrando passo dopo passo il meccanismo invisibile che li unisce.
- Usa uno stile colloquiale d'alto livello (es. "Proviamo a spingerci più a fondo...", "Immaginiamo per un istante...", "È qui che accade la magia concettuale...").

REGOLE PER LA PARTE 3 - IMPATTO SULLA SOCIETÀ:
- Deve essere visionaria, descrittiva e dal tono aperto e coinvolgente (es. "Cosa significa tutto questo per le nostre giornate?", "Immaginate cosa accade quando...").
- Spiega in modo tangibile ed emozionante come la fusione tra ${topic1} e ${topic2} trasformerà nei prossimi decenni la salute/medicina, le tecnologie quotidiane e le relazioni umane/l'etica della comunità.
- Evita elenchi burocratici o formule da comunicato stampa: fai percepire il cambiamento reale nella vita del lettore.

REGOLE PER LA PARTE 4 - INVENTBOT: IDEE ORIGINALI (APPLICAZIONE PRATICA):
- Presenta le 3 invenzioni con un incipit caldo, narrativo e colloquiale (es. "Arrivati a questo punto, viene spontaneo chiedersi: come possiamo toccare con mano questa sinergia?").
- NON scrivere schede tecniche aride o aridi elenchi di brevetti. Racconta ciascuna invenzione in modo vivido e discorsivo, spiegando l'esperienza d'uso, come funziona sul piano intuitivo e quale beneficio porta alla vita delle persone.
- Ogni invenzione deve trarre linfa vitale direttamente dalla fusione concettuale tra ${topic1} e ${topic2} sviluppata nei punti precedenti.

REGOLE CRITICAL PER LA SINTESI DELL'ESPLORAZIONE:
- Deve essere un'intuizione concettuale illuminante di 1-2 frasi (max 30 parole) ad altissimo valore saggistico.
- NON deve ripetere a memoria o parafrasare passaggi o frasi già presenti nel corpo dell'articolo.
- NON deve essere una semplice citazione dei nomi dei due temi (es. evita di dire "Questo articolo unisce X e Y...").
- Deve invece esprimere la nuova verità ontologica, la tesi di frontiera o la scoperta emergente che si manifesta solo dopo aver riflettuto sull'unione dei due mondi.

Devi restituire l'output strutturato ESATTAMENTE così:

---SINTESI---
[Inserisci qui la sintesi illuminante, originale e concisa dell'esplorazione emersa dal saggio]

---TITOLO---
[Inserisci qui il Titolo evocativo del saggio]

---ARTICOLO---
# [Inserisci qui lo stesso Titolo del saggio]

## 1. L'Incontro Impossibile (Introduzione)
[Testo dell'introduzione...]

## 2. Il Ponte Quantico/Metafisico (Analisi e Connessione)
[Testo dell'analisi approfondita...]

## 3. Impatto sulla Società
[3 punti elenco con l'impatto sociale...]

## 4. InventBot: Idee Originali (Applicazione pratica)

**Parola Chiave Sintetica:** *[Parola o locuzione sintetica originale]*

Agendo come **InventBot**, ecco 3 idee originali e prototipi applicativi inediti nati esclusivamente da questa sintesi:
1. **[Nome Invenzione 1]** - descrizione
2. **[Nome Invenzione 2]** - descrizione
3. **[Nome Invenzione 3]** - descrizione

Scrivi l'articolo interamente in italiano con registro colto ed elegante. Non includere preamboli oltre la struttura specificata.`;

    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ];

    let generatedText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`Tentativo ${attempt} con modello ${modelName} per: "${topic1}" + "${topic2}"...`);
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
          console.warn(`Modello ${modelName} tentativo ${attempt} errore:`, err?.message || err);
          if (attempt < 2 && (err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("demand"))) {
            await new Promise((res) => setTimeout(res, 1500));
          }
        }
      }
      if (generatedText) {
        break;
      }
    }

    if (!generatedText) {
      console.warn("⚠️ Nessun modello Gemini ha generato testo valido. Attivazione fallback generativo dinamico.");
      return createRichEditorialArticle(dateStr, topic1, topic2);
    }

    let subtitle = `Sintesi delle convergenze tra ${topic1.toLowerCase()} e ${topic2.toLowerCase()}.`;
    let title = `${topic1} & ${topic2}`;
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
