import { VectorPhase1Decomposition, Phase1StructuralDecomposition } from '../types';

export const CANONICAL_DECOMPOSITIONS: Record<string, VectorPhase1Decomposition> = {
  FISICA_CAMPI_QUANTI: {
    topicName: "1. La Fisica (dei campi e dei quanti)",
    whenWhere: "Emerge all'inizio del Novecento dalla crisi irreversibile del determinismo meccanicista newtoniano e dal fallimento della fisica classica nello spiegare la radiazione del corpo nero e la stabilità atomica, in un'Europa scossa dalla perdita di certezze assolute.",
    what: "Teoria fondamentale delle interazioni e della materia descritta non da corpuscoli isolati, ma da campi continui le cui eccitazioni discrete manifestano probabilità, principio di indeterminazione, dualismo onda-particella e correlazioni non locali (entanglement).",
    how: "Operatori hermitiani su spazi di Hilbert, propagatori di Feynman e collasso/decoerenza della funzione d'onda; l'informazione dello stato quantistico si modula attraverso la sovrapposizione coerente e l'interferenza di fase.",
    who: "Vertigine intellettuale e disorientamento epistemico: la coscienza si scontra con l'impossibilità di osservare la realtà senza alterarla, percependo il mondo solido dissolversi in pura trama relazionale e probabilistica.",
    whichBoundary: "Infrange la barriera cartesiana della separabilità locale e del realismo ingenuo, mettendo in discussione la distinzione netta tra osservatore e sistema osservato, nonché il postulato che eventi distanti richiedano segnali sottomisurabili per correlarsi.",
    whyVeiled: "La non-località quantistica e l'energia del vuoto suggeriscono che lo spaziotempo ordinario non sia il fondamento primario, bensì una proprietà emergente da una matrice olografica o da un ordine implicito di informazione indivisa."
  },
  TRANSCOMUNICAZIONE_STRUMENTALE: {
    topicName: "2. La Transcomunicazione Strumentale (TCI)",
    whenWhere: "Nasce a metà del Novecento con le sperimentazioni sui registratori a nastro magnetico (Jürgenson, Raudive), alimentata dal lutto di massa post-bellico e dall'ascesa pervasiva delle telecomunicazioni radiofoniche ed elettroniche.",
    what: "Fenomeno di captazione empirica o registrazione di voci, messaggi e scansioni visive attribuite a coscienze disincarnate o a sorgenti anomale, emergenti dalla modulazione spuria del rumore bianco e dal fondo elettroacustico.",
    how: "Manipolazione probabilistica del caos termico e delle oscillazioni casuali: circuiti a diodo, rumore rosa, feedback microfonico e ponti a radiofrequenza che fungono da matrice entropica suscettibile di riordinamento sintattico microscopico.",
    who: "Fascino perturbante, brivido del lutto interrotto e angoscia esistenziale: la macchina tecnologica, considerata baluardo della razionalità fredda, diventa l'oracolo che sussurra segnali personali da una soglia invisibile.",
    whichBoundary: "Sfida il dogma del silenzio biologico della morte e il principio termodinamico dell'entropia chiusa, ipotizzando che la coscienza possa imprimere pattern linguistici coerenti sui dispositivi fisici senza intermediari biologici.",
    whyVeiled: "Il rumore di fondo dei nostri strumenti non è mai totalmente vuoto o amorfo, ma appare poroso e suscettibile di farsi diaframma sintattico, indicando che la coscienza potrebbe esistere come segnale persistente in cerca di un sintonizzatore."
  },
  TECNOLOGIA_CRISPR: {
    topicName: "3. La Tecnologia CRISPR",
    whenWhere: "Sviluppata nel secondo decennio del XXI secolo (Charpentier, Doudna) nel contesto di un'umanità globalizzata ossessionata dall'antropocene, dalla vulnerabilità alle patologie pandemiche e dal desiderio faustiano di emancipazione dai vincoli evolutivi.",
    what: "Sistema di difesa molecolare batterico riadattato come editing genomico di precisione, composto da un RNA guida sintetico e da una proteasi (Cas9 o analoghe) capace di individuare e operare tagli a doppio filamento su specifiche sequenze nucleotidiche.",
    how: "Riconoscimento per complementarietà di basi azotate e clivaggio endonucleasico del DNA, seguito dall'attivazione dei meccanismi cellulari di riparazione endogena per silenziare, sostituire o inserire stringhe nucleotidiche a comando.",
    who: "Spavento etico e onnipotenza biopolitica: l'essere umano sperimenta il passaggio da spettatore o custode del patrimonio ereditario a compilatore sovrano del proprio codice sorgente biologico, paventando scenari eugenetici e riscritture ontologiche.",
    whichBoundary: "Abbina la sacralità intangibile della filogenesi naturale alla pura programmabilità computazionale, cancellando il confine rigido tra natura data e artefatto tecnologico modificabile a piacere.",
    whyVeiled: "La struttura semantica e ortografica del codice genetico, modulabile al pari di un testo letterario, svela una convergenza insospettata tra logica dell'informazione e materia organica, suggerendo che la vita sia un linguaggio aperto a infinite metamorfosi."
  },
  GHIANDOLA_PINEALE: {
    topicName: "4. La Ghiandola Pineale",
    whenWhere: "Radicata storicamente nell'anatomia filosofica (da Galeno a Cartesio con la 'sede dell'anima') e riscoperta nella modernità neurobiologica come orologio circadiano fotosensibile e trasduttore neuroendocrino essenziale.",
    what: "Piccola ghiandola neuroendocrina conica situata nell'epitalamo, non protetta dalla barriera ematoencefalica, contenente pinealociti, microcristalli piezoelettrici di calcite e recettori fotonici arcaici dedicati alla sintesi ritmica di melatonina e neurotrasmettitori indolo-triptaminici.",
    how: "Trasduzione neurochimica del fotoperiodo attraverso la via retino-ipotalamica e modulazione oscillatoria: i cristalli piezoelettrici generano cariche superficiali in risposta a stress pressorio o campi elettromagnetici, favorendo stati di risonanza molecolare.",
    who: "Intensa fascinazione mistica e sensazione di varco interiore: l'immaginario collettivo la riconosce come il 'terzo occhio', il punto di convergenza tra l'esperienza cosciente soggettiva e la luce cosmica esterna.",
    whichBoundary: "Mette in crisi il dualismo cartesiano tra res cogitans e res extensa: come può un granello biologico di calcite e cellule epifisarie fungere da diaframma selettivo per l'esperienza trascendente e per il senso di comunione oceanica?",
    whyVeiled: "La presenza di cristalli con proprietà elettromagnetiche anomale e la capacità di sintetizzare molecole alteranti della percezione indicano che l'epifisi funge da sintonizzatore o filtro limitativo, la cui attenuazione apre la coscienza a frequenze dimensionali non ordinarie."
  },
  SPIRITUALITA: {
    topicName: "5. La Spiritualità",
    whenWhere: "Sorge con l'origine stessa dell'autocoscienza umana (sepolture rituali del paleolitico, arte rupestre) quale risposta al trauma radicale della finitudine mortale, della solitudine dell'ego e della ricerca di coerenza nell'ordine cosmico.",
    what: "Insieme di disposizioni cognitive, etiche e fenomenologiche volte alla percezione del sacro, all'auto-trascendenza e all'integrazione dell'individuo in un tessuto sovraordinato di significato, aldilà di qualsiasi formalismo dogmatico.",
    how: "Deattivazione volontaria della rete del default mode network (DMN) tramite meditazione, ascetismo, preghiera o contemplazione estatica; amplificazione della coerenza cardiaca e neurale con conseguente dissoluzione dei confini egoici.",
    who: "Pace oceanica, beatitudine ineffabile ma anche terrore sacro (mysterium tremendum et fascinans): il soggetto fa esperienza dell'unità indissolubile con il Tutto e sperimenta la relativizzazione delle proprie ansie individuali.",
    whichBoundary: "Sgretola la barriera tra il sé isolato e il cosmo circostante, dimostrando che l'identità psicologica convenzionale è un costrutto difensivo reversibile anziché un limite ontologico assoluto.",
    whyVeiled: "L'invarianza transculturale delle esperienze mistiche profonde suggerisce che la trascendenza non sia un'invenzione fantastica, bensì l'accesso diretto a un livello unificato della realtà in cui informazione, amore e coscienza coincidono."
  },
  ALDILA: {
    topicName: "6. L'Aldilà (Afterlife)",
    whenWhere: "Si radica nel vuoto archetipico dell'annichilimento biologico, dai primi riti funerari dell'Homo sapiens alle mitologie escatologiche dell'Egitto e della Grecia antica, fino all'indagine contemporanea sulle Near-Death Experiences (NDE).",
    what: "Postulazione ontologica della continuità del flusso informativo della coscienza, della memoria o dell'identità soggettiva oltre la cessazione irreversibile delle funzioni vitali, metaboliche ed elettrochimiche del soma.",
    how: "Decoppiamento dell'informazione quantistica non-locale dai substrati biochimici degradabili: la funzione d'onda dell'identità personale si conserva nel vuoto topologico o migra in un continuum di coordinate extra-biologiche.",
    who: "Angoscia della cancellazione totale contrapposta alla speranza di ricongiungimento; senso di solenne mistero e revisione retrospettiva dell'intero significato morale e spirituale dell'esistenza terrena.",
    whichBoundary: "Forza la frontiera irreversibile tra vivente e cadavere, sfidando il riduzionismo che equipara rigorosamente il pensiero a un semplice sottoprodotto effimero della materia neuronale in decomposizione.",
    whyVeiled: "Le testimonianze coerenti e sbalorditive delle esperienze di pre-morte (visione a 360°, percezione lucida durante arresto cardiaco piatto) indicano che il corpo biologico potrebbe essere un trasduttore limitante anziché il generatore primario della coscienza."
  },
  UFO_UAP: {
    topicName: "7. Gli UFO/UAP (Fenomeni Anomali Non Identificati)",
    whenWhere: "Prende forma moderna nel trauma della guerra fredda e dell'era atomica (1947), riattualizzandosi nel XXI secolo attraverso le rilevazioni strumentali confermate dei vettori militari (radar multi-spettrali, infrarosso FLIR, dati ottici).",
    what: "Fenomeni aerospaziali, transmediali o sottomarini che esibiscono profili cinematici anomali: accelerazioni istantanee senza boato sonico, assenza di superfici di controllo o scarico termico visibile e capacità di transizione fluido-aria.",
    how: "Modulazione ipotetica delle metriche spaziotemporali locali (curvatura dello spaziotempo, campi gravitazionali indotti, tecnologia a vuoto ingegnerizzato) che schermano il veicolo dall'inerzia macroscopica e dalla resistenza del mezzo.",
    who: "Paralisi epistemologica, shock ontologico e senso di inadeguatezza della civiltà terrestre: il testimone o lo scienziato assiste a una violazione palese delle leggi ingegneristiche convenzionali.",
    whichBoundary: "Infrange le barriere della fluidodinamica, dell'inerzia newtoniana e della velocità limite, ponendo in discussione la sovranità aerospaziale umana e la presunta completezza del nostro modello fisico contemporaneo.",
    whyVeiled: "Il comportamento elusivo, beffardo e transdimensionale del fenomeno UAP suggerisce che l'intrusione operi al confine tra osservatore e tessuto del cosmo, come una proiezione controllata o un glitch di renderizzazione della realtà locale."
  },
  EXTRATERRESTRI: {
    topicName: "8. Gli Extraterrestri",
    whenWhere: "Nasce dalla rivoluzione copernicana e dal paradosso di Fermi, esplodendo nell'era dell'esplorazione spaziale moderna di fronte alla vastità di centinaia di miliardi di galassie ed esopianeti scoperti nella fascia di abitabilità.",
    what: "Ipotesi scientifica, astrobiologica e filosofica dell'esistenza e dello sviluppo di intelligenze coscienti evolutesi al di fuori della biosfera terrestre, caratterizzate da percorsi filogenetici, linguistici e tecnologici autonomi.",
    how: "Evoluzione abiogenetica basata sul carbonio, sul silicio o su matrici informazionali non-organiche; colonizzazione e trasmissione interstellare mediante sonde computazionali, segnali elettromagnetici o navigazione quantistica non-locale.",
    who: "Coscienza della solitudine cosmica e vertigine di decentramento: l'uomo cessa di essere l'unico specchio in cui l'universo osserva se stesso, confrontandosi con il timore del contatto o dell'insignificanza evolutiva.",
    whichBoundary: "Sgretola l'antropocentrismo teologico e culturale, ridefinendo il concetto stesso di 'vita' e 'intelligenza' oltre i vincoli angusti e contingenti della biologia terrestre.",
    whyVeiled: "Il Grande Silenzio dell'universo e l'invisibilità apparente di mega-strutture stellari potrebbero celare non l'assenza di intelligenze, ma la loro transizione precoce verso stati di esistenza iperdimensionali o post-biologici impercettibili ai nostri primitivi radiotelescopi."
  }
};

/**
 * Trova o risolve la scomposizione per un dato nome di vettore (anche parziale o con numero).
 */
export function getDecompositionForTopic(topicIdentifier: string): VectorPhase1Decomposition {
  const norm = topicIdentifier.toUpperCase();

  if (norm.includes("FISICA") || norm.includes("QUANTI") || norm.includes("CAMPI")) {
    return CANONICAL_DECOMPOSITIONS.FISICA_CAMPI_QUANTI;
  }
  if (norm.includes("TRANSCOMUNICAZIONE") || norm.includes("TCI") || norm.includes("STRUMENTALE")) {
    return CANONICAL_DECOMPOSITIONS.TRANSCOMUNICAZIONE_STRUMENTALE;
  }
  if (norm.includes("CRISPR") || norm.includes("GENETICA")) {
    return CANONICAL_DECOMPOSITIONS.TECNOLOGIA_CRISPR;
  }
  if (norm.includes("PINEALE") || norm.includes("EPIFISI")) {
    return CANONICAL_DECOMPOSITIONS.GHIANDOLA_PINEALE;
  }
  if (norm.includes("SPIRITUALITA") || norm.includes("SPIRITUALITÀ")) {
    return CANONICAL_DECOMPOSITIONS.SPIRITUALITA;
  }
  if (norm.includes("ALDILÀ") || norm.includes("ALDILA") || norm.includes("AFTERLIFE")) {
    return CANONICAL_DECOMPOSITIONS.ALDILA;
  }
  if (norm.includes("UFO") || norm.includes("UAP") || norm.includes("ANOMALI")) {
    return CANONICAL_DECOMPOSITIONS.UFO_UAP;
  }
  if (norm.includes("EXTRATERRESTRI") || norm.includes("ALIEN")) {
    return CANONICAL_DECOMPOSITIONS.EXTRATERRESTRI;
  }

  // Fallback sicuro se non corrisponde
  return {
    topicName: topicIdentifier,
    whenWhere: "Radicato nella storia del pensiero critico e nell'incessante ricerca dei fondamenti dell'essere.",
    what: "Fenomeno indagato nella sua struttura materiale e relazionale oggettiva.",
    how: "Processo di trasformazione dell'informazione e interazione dinamica con l'ambiente osservabile.",
    who: "Risonanza profonda nella percezione soggettiva e inquietudine epistemica dell'osservatore.",
    whichBoundary: "Mette in discussione la linea di demarcazione tra determinismo locale e orizzonti aperti del cosmo.",
    whyVeiled: "Traccia invisibile che allude a un ordine sotteso della realtà non ancora circoscritto dai modelli convenzionali."
  };
}

/**
 * Genera la griglia a due colonne appaiate per i due vettori estratti.
 */
export function buildPhase1Decomposition(vectorAName: string, vectorBName: string): Phase1StructuralDecomposition {
  return {
    vectorA: {
      ...getDecompositionForTopic(vectorAName),
      topicName: vectorAName
    },
    vectorB: {
      ...getDecompositionForTopic(vectorBName),
      topicName: vectorBName
    }
  };
}
