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

interface InventBotIdea {
  title: string;
  category: string;
  description: string;
  impact: string;
}

interface DailyArticleData {
  date: string;
  formattedDate: string;
  topic1: string;
  topic2: string;
  title: string;
  subtitle?: string;
  content: string;
  readingMinutes: number;
  keyword?: string;
  inventBotIdeas?: InventBotIdea[];
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

// Domain knowledge generator for rigorous philosophical and scientific grounding
function getPoeticEssence(topic: string): { essence: string; mechanisms: string; implications: string; societalImpact: string } {
  const t = topic.toLowerCase();
  if (t.includes("quantistica")) {
    return {
      essence: "la meccanica quantistica e i principi di non-località, entanglement e collasso della funzione d'onda",
      mechanisms: "l'indeterminazione di Heisenberg, la sovrapposizione coerente degli stati e l'entanglement che supera i vincoli di causalità spaziotemporale classica",
      implications: "la natura non separabile dell'universo in cui l'atto della misura connette indissolubilmente osservatore e sistema osservato",
      societalImpact: "lo sviluppo di reti di sincronizzazione cognitiva e crittografia bio-informatica quantistica, che ridefiniscono il concetto di privacy mentale, portando alla nascita di un'etica fondata sull'interdipendenza fondamentale tra individui.",
    };
  }
  if (t.includes("transcomunicazione")) {
    return {
      essence: "la transcomunicazione strumentale e l'interazione tra segnali stocastici e informazione non-locale",
      mechanisms: "la modulazione del rumore bianco e dei campi elettromagnetici da parte di pattern informativi coerenti che emergono dal fondo termico",
      implications: "la persistenza della coscienza e della matrice mnemonica al di là del substrato biologico e la sua capacità di imprimersi in trasduttori tecnologici",
      societalImpact: "la trasformazione del lutto e della psicologia clinica: la possibilità di accesso a memorie storiche non-locali supererebbe l'angoscia esistenziale della morte, rivoluzionando il diritto successorio, la medicina palliativa e le strutture religiose globali.",
    };
  }
  if (t.includes("crispr")) {
    return {
      essence: "l'editing genomico CRISPR-Cas9 e la riprogrammazione della bio-informazione",
      mechanisms: "l'indirizzamento nucleotidico guidato da RNA e il taglio enzymatico mirato che riscrive la sequenza di basi del codice genetico",
      implications: "il passaggio dell'evoluzione biologica da processo stocastico cieco a programma teleologico coscientemente modellato dall'intelligenza",
      societalImpact: "la riprogettazione democratica della salute preventiva: l'eradicazione delle patologie degenerative ereditarie aprirebbe l'era dell'autopoiesi biologica, imponendo un nuovo patto sociale ed etico sull'uguaglianza genetica e la tutela della diversità.",
    };
  }
  if (t.includes("pineale")) {
    return {
      essence: "l'epifisi o ghiandola pineale e le sue proprietà piezoelettriche e neuroendocrine",
      mechanisms: "la presenza di microcristalli di calcite capaci di piezoluminescenza e la sintesi di melatonina e composti triptaminici endogeni",
      implications: "il ruolo di trasduttore biofisico capace di convertire campi elettromagnetici ambientali e stati di coerenza in alterazioni dello stato di coscienza",
      societalImpact: "la nascita della medicina neuro-risonante: protocolli clinici basati sulla stimolazione piezoelettrica dell'epifisi permetterebbero il trattamento non invasivo dei disturbi neurodegenerativi e del trauma psichico attraverso il ripristino dei ritmi circadiani e della plasticità sinaptica.",
    };
  }
  if (t.includes("spirituale")) {
    return {
      essence: "il risveglio spirituale e la transizione verso la coscienza non-duale",
      mechanisms: "la deattivazione della rete del default mode network (DMN) encefalico e il superamento dell'illusione dell'ego separato",
      implications: "il riconoscimento della coscienza come fondamento primario ontologico e non come mero epifenomeno computazionale della materia",
      societalImpact: "il superamento dell'economia predatoria individualista a favore di modelli socio-economici collaborativi e rigenerativi, basati sull'evidenza neuro-fenomenologica che il benessere individuale è inseparabile da quello dell'intero ecosistema vivente.",
    };
  }
  if (t.includes("morte") || t.includes("aldilà")) {
    return {
      essence: "la sopravvivenza della coscienza alla morte biologica e le esperienze di pre-morte (NDE)",
      mechanisms: "la dissociazione funzionale dell'attività corticale e la conservazione dell'integrazione informativa in campi quantistici di punto zero",
      implications: "la ridefinizione della morte fisica non come estinzione, ma come de-coerenza del veicolo somatico e transizione di fase dell'informazione soggettiva",
      societalImpact: "la rifondazione dei paradigmi sanitari di fine vita e dell'ordinamento giuridico: ospedali ripensati come centri di accompagnamento alla transizione di fase informativa, con una drastica riduzione delle spese sanitarie legate all'accanimento terapeutico.",
    };
  }
  if (t.includes("ufo")) {
    return {
      essence: "i fenomeni aerei non identificati (UAP/UFO) e la propulsione a metrica spaziotemporale",
      mechanisms: "la distorsione locale del tensore energia-impulso per la curvatura dello spaziotempo priva di inerzia convenzionale",
      implications: "la dimostrazione tangibile dell'esistenza di tecnologie e modelli fisici che manipolano direttamente la geometria gravitazionale e il vuoto quantistico",
      societalImpact: "la decentralizzazione totale della produzione energetica globale grazie all'estrazione di energia dal vuoto quantistico, azzerando le guerre per le risorse fossili e trasformando la mobilità planetaria ed extra-planetaria.",
    };
  }
  // extraterrestri
  return {
    essence: "l'ipotesi di intelligenze extraterrestri e civiltà multidimensionali",
    mechanisms: "l'evoluzione divergente di sistemi complessi autocoscienti in grado di operare su scale energetiche di tipo Kardashev superiore",
    implications: "il superamento dell'antropocentrismo cosmico e l'integrazione della specie umana in una comunità di intelligenze universali",
    societalImpact: "la ristrutturazione ontologica dell'identità di specie (diplomazia esoculturale), portando alla dismissione degli arsenali bellici nazionali e all'unificazione delle politiche scientifiche ed ecologiche della Terra.",
  };
}

// Generates deterministic, high-level InventBot ideas for fallback or supplement
function getDeterministicInventBotIdeas(t1: string, t2: string): { keyword: string; ideas: InventBotIdea[] } {
  const combined = `${t1} e ${t2}`.toLowerCase();
  
  let keyword = "Risonanza Bio-Informativa di Fase";
  if (combined.includes("pineale") || combined.includes("quantistica")) {
    keyword = "Piezotrasduzione Quantico-Cerebrale";
  } else if (combined.includes("crispr")) {
    keyword = "Bio-Editing Epigenetico Coerente";
  } else if (combined.includes("transcomunicazione") || combined.includes("morte")) {
    keyword = "Matrice di Decodifica Non-Locale";
  } else if (combined.includes("ufo") || combined.includes("extraterrestri")) {
    keyword = "Metrica Spaziotemporale Risonante";
  }

  return {
    keyword,
    ideas: [
      {
        title: `SynapseField Core: Interfaccia Neurale a Campo Coerente`,
        category: "Startup DeepTech & Bio-Hardware",
        description: `Dispositivo non invasivo che sfrutta micro-campi piezo-elettrici per allineare l'attività oscillatoria dei tessuti biologici con la frequenza fondamentale di ${keyword}, facilitando stati di profonda coerenza cognitiva e riparazione neurale accelerata.`,
        impact: `Riduzione del 60% dei tempi di recupero da traumi cerebrali e superamento dei limiti delle interfacce cervello-computer invasive.`,
      },
      {
        title: `Phasis Protocol: Rete di Crittografia e Comunicazione Entangled`,
        category: "Strumento Tecnologico & Infrastruttura Dati",
        description: `Protocollo di trasmissione decentralizzata che modula il rumore termico di fondo per trasmettere pacchetti informativi non-locali, garantendo l'inviolabilità assoluta dei dati attraverso la sincronizzazione quantistica di fase.`,
        impact: `Nascita di una rete internet inviolabile, priva di server centralizzati e immune agli attacchi quantistici di decifrazione.`,
      },
      {
        title: `BioSphere Resonance Labs: Piattaforma di Formazione e Ricerca Aperta`,
        category: "Format Filosofico-Educativo & Open Science",
        description: `Piattaforma immersiva e curriculum interdisciplinare che insegna a scienziati, medici e filosofi a progettare esperimenti replicabili basati sull'interconnessione sistemica tra bio-informazione e coscienza collettiva.`,
        impact: `Superamento del riduzionismo accademico e formazione di una nuova generazione di ricercatori integrati capaci di risolvere crisi complesse di specie.`,
      },
    ],
  };
}

function parseInventBotOutput(rawText: string, t1: string, t2: string): { keyword: string; ideas: InventBotIdea[] } {
  let keyword = "";
  const ideas: InventBotIdea[] = [];

  if (rawText.includes("---PAROLA_CHIAVE---")) {
    const kwMatch = rawText.match(/---PAROLA_CHIAVE---\s*([\s\S]*?)(?:---IDEE_INVENTBOT---|---IDEE---|IDEA\s*1|$)/i);
    if (kwMatch && kwMatch[1].trim()) {
      keyword = kwMatch[1]
        .split("\n")[0]
        .trim()
        .replace(/^[\*#\-\s"']+|[\*#\-\s"']+$/g, "");
    }
  }

  const ideaBlocks = rawText.split(/IDEA\s*\d+[\s:]+/i).filter((b) => b.trim().length > 20);

  for (const block of ideaBlocks.slice(0, 3)) {
    const titleMatch = block.match(/TITOLO:\s*([^\n\r]+)/i);
    const categoryMatch = block.match(/CATEGORIA:\s*([^\n\r]+)/i);
    const descMatch = block.match(/DESCRIZIONE:\s*([\s\S]*?)(?=IMPATTO:|$)/i);
    const impactMatch = block.match(/IMPATTO:\s*([\s\S]*?)(?=IDEA\s*\d+:|$)/i);

    if (titleMatch && descMatch) {
      ideas.push({
        title: titleMatch[1].trim().replace(/^[\*#\-\s"']+|[\*#\-\s"']+$/g, ""),
        category: categoryMatch ? categoryMatch[1].trim().replace(/^[\*#\-\s"']+|[\*#\-\s"']+$/g, "") : "Innovazione di Frontiera",
        description: descMatch[1].trim().replace(/\n+/g, " "),
        impact: impactMatch ? impactMatch[1].trim().replace(/\n+/g, " ") : "Trasformazione tangibile dei processi e dei paradigmi applicativi.",
      });
    }
  }

  const fallback = getDeterministicInventBotIdeas(t1, t2);
  if (!keyword || keyword.length > 60) {
    keyword = fallback.keyword;
  }

  while (ideas.length < 3 && fallback.ideas[ideas.length]) {
    ideas.push(fallback.ideas[ideas.length]);
  }

  return { keyword, ideas: ideas.slice(0, 3) };
}

// Generates dynamic, unique text even in offline/fallback conditions adhering strictly to continuous dialogic flow
function createRichEditorialArticle(dateStr: string, t1: string, t2: string): DailyArticleData {
  const formattedDate = getFormattedItalianDate(dateStr);
  const e1 = getPoeticEssence(t1);
  const e2 = getPoeticEssence(t2);
  const inventData = getDeterministicInventBotIdeas(t1, t2);

  const title = `L'Isomorfismo Nascosto: ${t1} e ${t2}`;
  const subtitle = `Un'indagine dialettica approfondita sui meccanismi sistemici e l'impatto trasformativo sulla società futura.`;

  const content = `# ${title}

— Se analizziamo con rigore ${e1.essence}, appare evidente che non possiamo più considerare questo fenomeno come un sistema isolato. Il suo funzionamento poggia su meccanismi precisi: ${e1.mechanisms}. Quando osserviamo come queste dinamiche si manifestano, ci rendiamo conto che esse forzano un ripensamento radicale della fisica convenzionale, portando a una conclusione inequivocabile: ${e1.implications}.

— È esattamente qui che si innesta la necessità di comprendere ${e2.essence}. Per lungo tempo la speculazione ha trattato questi due domini come territori alieni l'uno all'altro. Tuttavia, analizzando la struttura di ${t2}, ritroviamo all'opera principi analoghi: ${e2.mechanisms}. Il punto cruciale non è solo descrittivo, ma ontologico: ${e2.implications}. Come possiamo interpretare la convergenza di queste due realtà senza cadere nel riduzionismo o nella semplificazione acritica?

— La risposta risiede nell'isomorfismo dei processi informativi e dei campi di coerenza. Considera il ponte che unisce la dinamica di ${t1} e la manifestazione di ${t2}. In entrambi i casi, l'universo sembra obbedire a una legge di conservazione e trasduzione dell'informazione: ciò che a una certa scala chiamiamo interazione quantistica o biologica, su un altro livello si manifesta come modulazione diretta del campo di coscienza e della metrica spaziale. Non si tratta di una somiglianza esteriore, ma di una coincidenza di leggi di fase.

— Sottoponiamo questa tesi al banco di prova più severo. Se questo legame è reale, allora una modifica o un'evoluzione nella nostra padronanza di ${t1} deve inevitabilmente retroagire sulla nostra comprensione e interazione con ${t2}. Se comprendiamo ${e1.mechanisms}, acquisiamo lo strumento teorico per decifrare come ${e2.mechanisms} possa realizzarsi nell'architettura complessiva del cosmo. È il superamento del dualismo cartesiano attraverso una visione sistemica unificata.

— Spostiamo ora lo sguardo sulle conseguenze tangibili per il nostro futuro. Quale sarà l'impatto concreto di questa comprensione quando verrà pienamente integrata nella società umana? Pensiamo a una trasformazione radicale: ${e1.societalImpact} Integrando questo principio con ${t2}, assisteremo a una rivoluzione non solo teorica ma pragmatica: ${e2.societalImpact} La medicina, le istituzioni giuridiche e i modelli di convivenza civile non saranno più fondati sul dogma della frammentazione, ma su una consapevolezza operazionale della continuità sistemica.

— Questa unificazione cambia tutto. La realtà si rivela non come un aggregato di corpi inerti che si urtano nel vuoto, ma come una trama vivente in cui materia, codice biologico, transizioni di stato e coscienza partecipano a un unico processo di auto-esplorazione.

— Ed è in questo dialogo ininterrotto che l'indagine scientifica ritrova la sua massima dignità: nel comprendere che ogni confine tra discipline è solo provvisorio, e che la trasformazione della nostra conoscenza è inseparabile dalla metamorfosi etica e civile della società.`;

  return {
    date: dateStr,
    formattedDate,
    topic1: t1,
    topic2: t2,
    title,
    subtitle,
    content,
    readingMinutes: 5,
    keyword: inventData.keyword,
    inventBotIdeas: inventData.ideas,
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

    console.log(`🧠 Inizio pipeline di ragionamento dialettico ricorsivo per: "${topic1}" + "${topic2}"...`);

    // CICLO 1: Tesi Ontologica e Decomposizione Meccanica dei Due Domini
    const pass1Prompt = `Sei uno scienziato teorico, fisico quantistico e filosofo della scienza.
Analizza con estremo rigore scientifico e profondità concettuale i due seguenti ambiti:
1. ${topic1}
2. ${topic2}

OBIETTIVO DEL RAGIONAMENTO (FASE 1 - DECOMPOSIZIONE ONTOLOGICA):
- Definisci e sviscera i principi fisici, informativi, biologici o teorici specifici e concreti che governano "${topic1}" (es. leggi, formule qualitative, meccanismi di interazione, teorie di riferimento).
- Fai lo stesso per "${topic2}".
- Evita categoricamente frasi generiche, vaghezze new age o luoghi comuni. Cita e analizza i veri meccanismi causali, le dinamiche di sistema e le strutture profonde.`;

    const pass1Result = await callGeminiWithRetryAndFallback(pass1Prompt, candidateModels, { temperature: 0.7 });
    if (!pass1Result.text) {
      console.warn("⚠️ Nessun modello Gemini disponibile al momento. Uso fallback editoriale arricchito.");
      return createRichEditorialArticle(dateStr, topic1, topic2);
    }

    const pass1Analysis = pass1Result.text;
    const activeModel = pass1Result.usedModel || candidateModels[0];
    const preferredModels = [activeModel, ...candidateModels.filter((m) => m !== activeModel)];
    console.log(`✅ CICLO 1 COMPLETATO (${activeModel}): Decomposizione ontologica (${pass1Analysis.length} caratteri).`);

    // CICLO 2: Antitesi, Stress-Test Critico e Ricerca del Ponte Isomorfico
    const pass2Prompt = `Sei un severo epistemologo e revisore scientifico. Hai davanti questa prima decomposizione concettuale:

--- FASE 1: DECOMPOSIZIONE ---
${pass1Analysis}
--- FINE FASE 1 ---

OBIETTIVO DEL RAGIONAMENTO (FASE 2 - CRITICA E COSTRUZIONE DEL PONTE SISTEMICO):
1. STRESS-TEST CRITICO: Quali sono i punti deboli, le obiezioni razionali o i salti logici non giustificati nell'unire "${topic1}" e "${topic2}"?
2. MECCANISMO DEL PONTE: Qual è l'esatto isomorfismo strutturale (termodinamico, quantistico, cibernetico o informativo) che collega realmente la dinamica di "${topic1}" a quella di "${topic2}"?
3. Sviluppa un confronto dialettico serrato tra due tesi contrastanti che non si accontentano di metafore, ma dimostrano passo dopo passo la necessità logica e ontologica di questo legame.`;

    const pass2Result = await callGeminiWithRetryAndFallback(pass2Prompt, preferredModels, { temperature: 0.75 });
    const pass2Refinement = pass2Result.text || pass1Analysis;
    console.log(`✅ CICLO 2 COMPLETATO: Stress-test critico e ponte isomorfico (${pass2Refinement.length} caratteri).`);

    // CICLO 3: Raffinamento e Sintesi Dialettica Progressiva
    const pass3Prompt = `Sei un filosofo teoretico e saggista accademico.
Prendi l'analisi e lo stress test critico precedenti:

--- FASE 2: STRESS-TEST E PONTE ---
${pass2Refinement}
--- FINE FASE 2 ---

OBIETTIVO DEL RAGIONAMENTO (FASE 3 - SINTESI DIALETTICA SUPERIORE):
- Sintetizza una teoria unificata e inoppugnabile che spieghi come la comprensione profonda di "${topic1}" illumini e trasformi la natura di "${topic2}".
- Mostra come questo ponte non sia una mera analogia letteraria, ma una reale convergenza di leggi di conservazione dell'informazione, campo e coscienza.
- Delinea le argomentazioni definitive, con esempi di pensiero precisi e contro-obiezioni risolte.`;

    const pass3Result = await callGeminiWithRetryAndFallback(pass3Prompt, preferredModels, { temperature: 0.75 });
    const pass3Synthesis = pass3Result.text || pass2Refinement;
    console.log(`✅ CICLO 3 COMPLETATO: Sintesi dialettica superiore (${pass3Synthesis.length} caratteri).`);

    // CICLO 4: Valutazione dell'Impatto sulla Società e Trasformazione Umana
    const pass4Prompt = `Sei un sociologo del futuro, filosofo dell'etica e storico della scienza.
Hai a disposizione la sintesi dialettica e ontologica maturata:

--- FASE 3: SINTESI TEORICA ---
${pass3Synthesis}
--- FINE FASE 3 ---

OBIETTIVO DEL RAGIONAMENTO (FASE 4 - IMPATTO SULLA SOCIETÀ E TRASFORMAZIONE UMANA):
Analizza ed elabora un esempio concreto, dettagliato e strutturato di come la comprensione e l'applicazione futura di questa convergenza tra "${topic1}" e "${topic2}" trasformerà radicalmente la società umana:
1. TRASFORMAZIONE ETICA ED ESISTENZIALE: Come cambia la percezione collettiva della realtà, del sé, del tempo o dell'essere vivente?
2. APPLICAZIONE PRAGMATICA E TANGIBILE (es. nella medicina preventiva o rigenerativa, nelle tecnologie di comunicazione, nella cultura, nel diritto o nei modelli di cooperazione socio-economica).
3. SCENARIO FUTURO DI SPECIE: Descrivi una casistica o un'applicazione concreta di come questa scoperta viene integrata nelle istituzioni o nella vita quotidiana della civiltà umana di domani, superando i vecchi paradigmi riduzionisti.`;

    const pass4Result = await callGeminiWithRetryAndFallback(pass4Prompt, preferredModels, { temperature: 0.75 });
    const pass4SocietalImpact = pass4Result.text || pass3Synthesis;
    console.log(`✅ CICLO 4 COMPLETATO: Impatto sulla società e trasformazione umana (${pass4SocietalImpact.length} caratteri).`);

    // CICLO 5: INVENTBOT - ESTRAZIONE PAROLA CHIAVE E 3 IDEE ORIGINALI / PROTOTIPI APPLICATIVI
    const inventBotPrompt = `Agisci nel ruolo di "InventBot", un inventore visionario, tecnologo di frontiera e stratega di innovazione interdisciplinare.

Hai a disposizione l'intera disamina teorica e l'impatto trasformativo emerso dall'unione tra "${topic1}" e "${topic2}":

--- SINTESI TEORICA E IMPATTO SOCIETARIO ---
${pass4SocietalImpact}
--- FINE SINTESI ---

COMPITI TASSATIVI DI INVENTBOT:
1. PAROLA CHIAVE SINTETICA: Estrai una singola Parola Chiave o Concetto Chiave sintetico (1-3 parole, es. "Risonanza Piezocognitiva", "Entanglement Bio-Informativo", "Crittografia Eterica", "Morfogenesi Quantica") che condensi l'essenza operativa e il principio unificante della connessione.
2. 3 IDEE ORIGINALI / PROTOTIPI APPLICATIVI: Genera 3 idee originali, innovative o prototipi applicativi basati UNICAMENTE su questa Parola Chiave risultante (es. startup deep-tech, hardware/software innovativi, protocolli clinici o format educativi e filosofici).

Per ciascuna idea specifica:
- TITOLO: Nome distintivo e accattivante del progetto o prototipo.
- CATEGORIA: Es. "Startup DeepTech & Bio-Hardware", "Strumento Tecnologico & Crittografia", "Protocollo Clinico", "Format Filosofico-Educativo", "Piattaforma Open-Science".
- DESCRIZIONE: Spiegazione tecnica e funzionale di come funziona il dispositivo/progetto e di come applica la parola chiave.
- IMPATTO: Il beneficio concreto, misurabile o trasformativo sulla vita umana o sul settore di riferimento.

DEVI RESTITUIRMI L'OUTPUT STRUTTURATO ESATTAMENTE COSÌ:

---PAROLA_CHIAVE---
[Inserisci qui unicamente la Parola Chiave Sintetica]

---IDEE_INVENTBOT---
IDEA 1:
TITOLO: [Titolo Idea 1]
CATEGORIA: [Categoria Idea 1]
DESCRIZIONE: [Descrizione dettagliata dell'idea/prototipo applicativo]
IMPATTO: [Impatto tangibile]

IDEA 2:
TITOLO: [Titolo Idea 2]
CATEGORIA: [Categoria Idea 2]
DESCRIZIONE: [Descrizione dettagliata dell'idea/prototipo applicativo]
IMPATTO: [Impatto tangibile]

IDEA 3:
TITOLO: [Titolo Idea 3]
CATEGORIA: [Categoria Idea 3]
DESCRIZIONE: [Descrizione dettagliata dell'idea/prototipo applicativo]
IMPATTO: [Impatto tangibile]`;

    const pass5InventBotResult = await callGeminiWithRetryAndFallback(inventBotPrompt, preferredModels, { temperature: 0.8 });
    const rawInventBotText = pass5InventBotResult.text || "";
    const parsedInventBot = parseInventBotOutput(rawInventBotText, topic1, topic2);
    console.log(`✅ CICLO 5 COMPLETATO (InventBot): Parola chiave "${parsedInventBot.keyword}" e ${parsedInventBot.ideas.length} idee generate.`);

    // CICLO 6 (FINALE): REDAZIONE DEL SAGGIO DIALOGICO CONTINUO (MASTERWORK)
    const masterPrompt = `Sei un maestro della saggistica filosofico-scientifica e del dialogo socratico moderno.

Hai a disposizione l'intero percorso di ragionamento ricorsivo elaborato nelle fasi precedenti:

--- DISAMINA TEORICA E PONTE SISTEMICO (FASI 1-3) ---
${pass3Synthesis}

--- IMPATTO SULLA SOCIETÀ E TRASFORMAZIONE FUTURA (FASE 4) ---
${pass4SocietalImpact}

--- PAROLA CHIAVE OPERATIVA IDENTIFICATA ---
${parsedInventBot.keyword}
--- FINE MATERIA PRIMA ---

COMPITO FINALE:
Redigi l'OPERA MAGISTRALE: un saggio dialogico di altissimo livello intellettuale, denso, appassionante e rigoroso sull'intersezione tra "${topic1}" e "${topic2}", che culmini nell'esplorazione del loro impatto concreto e trasformativo sulla società umana.

REGOLE TASSATIVE DI FORMA E SOSTANZA:
1. SOSTANZA E PROFONDITÀ (NO SUPERFICIALITÀ O VAGHEZZA):
   - Esplora e dichiara esplicitamente la natura autentica, i principi fisici/ontologici e le connessioni tra "${topic1}" e "${topic2}".
   - Spiega con chiarezza come le due realtà convergono.
   - Integra in modo organico e vivo l'IMPATTO SULLA SOCIETÀ UMANA: fornisci l'esempio concreto e dettagliato di come questa connessione trasforma la medicina, l'etica, la cultura e la vita collettiva.

2. FLUSSO CONTINUO E NARRATIVO A DUE VOCI:
   - Scrivi l'articolo come un UNICO FLUSSO CONTINUO in prosa elegante, scandito dal dialogo tra due menti eccellenti che utilizzano il trattino lungo '—'.
   - NON inserire titoli di sezione intermedi (NO '##', NO 'Capitolo 1', NO 'Parte', NO 'Sottotitoli') e NESSUN elenco puntato o numerato.
   - Ogni battuta deve contenere riflessioni dense, argomenti tangibili, dubbi fecondi e intuizioni luminose, mai convenevoli banali.

DEVI RESTITUIRMI L'OUTPUT STRUTTURATO ESATTAMENTE CON QUESTI SEPARATORI:

---SINTESI---
[Inserisci qui una sintesi folgorante di 1-2 frasi (max 35 parole) che esprima il cuore dell'unione concettuale e il suo impatto trasformativo]

---TITOLO---
[Inserisci un Titolo profondo, saggistico ed evocativo per l'articolo]

---ARTICOLO---
# [Inserisci qui lo stesso Titolo dell'articolo]

[Inserisci l'intero saggio dialogico continuo in paragrafi fluidi con trattini '—', denso di contenuto e privo di elenchi o sottotitoli]`;

    const pass6Result = await callGeminiWithRetryAndFallback(masterPrompt, preferredModels, { temperature: 0.8 });
    const generatedText = pass6Result.text ? pass6Result.text.trim() : "";

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
      keyword: parsedInventBot.keyword,
      inventBotIdeas: parsedInventBot.ideas,
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
