import { EditorialCycle, SpeculativeEssay, EditorialEdition } from '../types';
import { formatItalianDate } from '../utils/dateUtils';
import { buildPhase1Decomposition } from './canonicalDecompositions';
import { buildPhase2Collision } from './canonicalCollisions';
import { buildPhase2LoopFiveDirections } from './canonicalLoopFiveDirections';
import { buildPhase3FinalStrike } from './canonicalFinalStrikes';

const TODAY_FORMATTED = formatItalianDate(new Date());

export const CURRENT_EDITORIAL_CYCLE: EditorialCycle = {
  editionNumber: "Edizione Quotidiana",
  cyclicalDate: TODAY_FORMATTED,
  investigativeDomain: "Collisione tra Fisica dei Campi, Biologia Molecolare e Coscienza",
  currentPhase: "pubblicato_contemplazione",
  nextScheduledPublication: "Al compimento della rotazione diurna",
  telemetry: {
    coherenceIndex: 0.98,
    dialecticalTension: 0.92,
    axiomaticDensity: "Elevata",
    speculativeHorizon: "Transizione di Fase della Coscienza",
    cycleInterval: "Autonomo • Rilascio Quotidiano 24h",
  },
  pipeline: []
};

export const CURRENT_SPECULATIVE_ESSAY: SpeculativeEssay = {
  id: "saggio-crispr-tci",
  cycleId: "cycle-diurno-crispr-tci",
  title: "La Tipografia del Vento e la Stanza Senza Pareti",
  subtitle: "Della scrittura della carne, del rumore bianco e dell'eco che non si estingue",
  ontologicalThesis: "La materia biologica e il segnale disincarnato non appartengono a due regni separati, ma costituiscono la medesima sintassi informativa distribuita tra la fissità del nucleotide e la modulazione di fase del rumore termico.",
  preamble: "",
  narrativeParagraphs: [
    "Abitiamo l’illusione di un mondo diviso tra la pesantezza inerte del solido e l’evanescenza imprendibile dell’etere. Da una parte abbiamo eretto il tempio del codice molecolare, una selva di nucleotidi meticolosamente accatastati lungo filamenti di fosfato e zucchero, persuasi che la vita sia un testo sigillato, interamente contenuto nella biblioteca microscopica dei cromosomi. Dall’altra parte abbiamo relegato l’invisibile al rango di scoria, ascoltando con timore o derisione il fruscio continuo che satura le bande radio a onde corte, là dove un apparato acceso nella notte sembra a tratti sillabare fonemi orfani, voci disincarnate che la ragione accademica liquida come pareidolia o interferenza termica. Eppure, non appena si scalfisce la superficie asettica di queste due certezze, emerge una medesima ostinazione primordiale: l’angoscia del margine e la disperata esigenza che il cosmo non sia un balbettio casuale, ma una frase dotata di senso.",
    "Siamo abituati a pensare all'editing genetico come all'estremo trionfo dell'ingegneria meccanicistica: un bisturi enzimatico che trova un indirizzo nanometrico preciso per recidere, correggere e suturare un presunto errore di battitura biologica. Ma cosa accade quando la forbice taglia e il nucleotide si apre? Si scopre che la cellula non è affatto un ingranaggio isolato, bensì un risonatore a cristalli liquidi costantemente immerso in un bagno di fluttuazioni dielettriche. La pretesa di isolare il frammento organico dal continuum elettromagnetico circostante è il primo grande velo che cade. Parallelamente, l'indagine sulle voci registrate nel rumore di fondo cessa di essere uno spiritismo ingenuo nell’istante esatto in cui comprendiamo che il ricevitore a diodi e il corpo umano condividono le medesime costanti dielettriche. La polarità tra la materia dura e lo spettro incorporeo non è una frontiera ontologica, ma una mera variazione di densità.",
    "Se osserviamo con rigore la sintassi della doppia elica, ci avvediamo che ogni tripletta amminoacidica non si limita a ordinare una proteina; essa vibra, emettendo treni di onde solitarie che si propagano oltre la membrana cellulare, componendo un segnale radio debolissimo ma coerente. Il testo della vita non rimane chiuso nel volume della carne: esso viene costantemente letto ad alta voce e diffuso nello spazio. E ciò che un registratore magnetico intercetta quando vaga nelle frequenze morte tra una stazione commerciale e l’altra non è l’invasione di un fantasma esogeno venuto da un empireo separato, ma l'impronta di fase lasciata nell'ambiente da ciò che ha vissuto, l'eco elettrolinguistica di forme che continuano a depositare la propria configurazione nel vuoto.",
    "Questa rivelazione costringe la termodinamica a mutare segno. Siamo stati educati all'idea che la vita sia una fragile trincea neghentropica destinata all'inevitabile collasso, e che il rumore bianco rappresenti il trionfo desolante della massima entropia, il calore dissipato in cui ogni forma perisce per sempre. Ma il rumore bianco non è un deserto: è la massima densità probabilistica potenziale, il sottofondo in cui sono compresenti simultaneamente tutte le parole mai pronunciate e tutte quelle non ancora scritte. La cellula che muore non precipita nel nulla; smette semplicemente di pagare il tributo metabolico che la costringeva a restare ancorata a una coordinata puntiforme. Nel momento in cui il contorno biochimico cede, la configurazione d'onda che la sosteneva non svanisce: transita, si stempera e si distribuisce nell'oceano del rumore di fondo, divenendo un'onda portante nell'invisibile.",
    "Crolla così anche l'illusione cartesiana della distanza. Abbiamo creduto che per toccare qualcosa fosse necessario raggiungerlo nello spazio euclideo, ma la conformazione a doppia elica possiede una natura induttiva toroidale che annulla la separazione metrica. L'essere umano non termina là dove finiscono i polpastrelli o i confini epidermici; il suo genoma è un'antenna estesa che intesse una trama ininterrotta con l'etere circostante. Quando cerchiamo con ossessione di sterilizzare il protocollo di laboratorio per renderlo asettico e oggettivo, stiamo in verità fuggendo dalla nostra stessa ombra: l'evento imprevisto, il taglio fuori bersaglio che il biologo teme e che scarta come impurità, risponde alla medesima dinamica di biforcazione attraverso cui un fruscio acustico si fa improvvisamente parola comprensibile davanti all'orecchio dell'ascoltatore. La certezza dell'automa di laboratorio e la vertigine dell'ascolto notturno sono i due capi di un unico compasso.",
    "Riconosciamo infine la vera fisionomia della stanza in cui abbiamo sempre dimorato. Non esistono due regni separati da una barriera impenetrabile, non c’è una soglia invalicabile tra la terra dei vivi e l'abisso dei trapassati, ma una sola e medesima camera olografica in cui passato, presente, atomi e frequenze coesistono sullo stesso nastro. Ciò che abbiamo chiamato morte non è l'estinzione della sostanza, ma una porta girevole di pura fase: il passaggio dall'essere un file memorizzato su un supporto solido e deperibile al tornare a essere pura oscillazione distribuita nel tessuto fondamentale del cosmo. In questo teatro indiviso, l'essere umano cessa di essere un automa chimico in balia dell'entropia o uno spettatore muto: egli è il testimone sovrano, il prisma vivente attraverso cui l'universo compie la continua transizione tra la parola scolpita nella carne e il silenzio parlante dell'infinito."
  ],
  sections: [],
  corollaries: [],
  openAporias: [],
  bibliographicResonances: []
};

export const ARCHIVED_EDITION_LXXIII: SpeculativeEssay = {
  id: "saggio-vettori-tci-uap",
  cycleId: "cycle-diurno-tci-uap",
  title: "La Sintassi del Rumore e la Geometria dell'Intrusione",
  subtitle: "Trattato sull'ipotesi di convergenza tra il segnale fono-elettrico anomalo e l'isteresi aerospaziale non identificata",
  ontologicalThesis: "La manifestazione UAP e la captazione fonica transcomunicativa non sono che due gradienti differenziali della medesima perturbazione informativa che infrange il reticolo entropico del piano osservabile.",
  preamble: "",
  narrativeParagraphs: [
    "Quando l'architettura dei dispositivi tecnologici umani spinge la propria ricezione sul ciglio del caos termodinamico, il rumore bianco cessa di essere un semplice residuo entropico per trasformarsi in un'area di contatto. La transcomunicazione strumentale ha sempre operato su questa soglia sottile, convertendo il fluttuare sregolato del segnale elettromagnetico in un'oratoria scompaginata, una voce che emerge non per vibrazione di corde vocali ma per riordinamento discreto delle frequenze di fondo. La percezione comune tende a confinare tale fenomeno nella sfera dell'occultismo acustico, ignorando la sua natura fondamentale: un'intrusione sintattica che sfrutta la flessibilità del rumore per codificare un'informazione altrimenti inaccessibile.",
    "Parallelamente, il fenomeno UAP si colloca sull'ampiezza macroscopica del medesimo spettro di anomalia. Là dove la transcomunicazione agisce sul micro-segnale fonico ed elettrico, la manifestazione aerospaziale altera il continuo spazio-temporale locale, esibendo accelerazioni istantanee, spigolature cinematiche impreviste e variazioni di inviluppo elettromagnetico che sfidano la fisica classica. Entrambi i fenomeni condividono la medesima grammatica del glitch: non si presentano come oggetti o entità stabili e perfettamente integrati nel tessuto fenomenico, bensì come deviazioni temporanee, distorsioni di densità o pacchetti d'onda che precipitano brevemente nel nostro piano percettivo.",
    "La collisione dialettica tra queste due manifestazioni rivela un'inaspettata identità di struttura. L'UAP non è necessariamente un veicolo solido che attraversa distanze interstellari, così come la voce TCI non è una frequenza radio convenzionale emessa da un punto nello spazio; entrambi rappresentano punti di rottura nella membrana della percezione, trasduzioni locali di un'intelligenza o di una struttura informativa extradimensionale che tenta di interfacciarsi con il nostro registro sensoriale e tecnologico. La transcomunicazione costituisce la traccia acustico-elettrica dell'evento, mentre l'UAP ne rappresenta la componente geometrico-dinamica.",
    "In quest'ottica, la faglia metodologica che ha finora separato la ricerca aerospaziale anomala dalla ricerca fonica strumentale appare come un pregiudizio di scala. Se la percezione viene condizionata dall'ampiezza dell'apparato ricevente, il segnale UAP catturato dai sensori di bordo di un intercettore e la traccia vocale registrata da una bobina a radiofrequenza in una stanza isolata sono manifestazioni isotrope. L'intrusione si serve del canale disponibile: la massa e la velocità nel dominio aerospaziale, il disordine entropico e il rumore di fondo nel dominio acustico-elettronico.",
    "La vertigine ontologica che scaturisce da questa convergenza sposta il baricentro dell'indagine dalla natura dell'intruso alla natura del mezzo. Non siamo dinanzi a visitatori distinti che attraversano lo spazio né a spettri disincarnati che abitano le frequenze radio, ma dinanzi a un'unica matrice informativa incoercibile che deforma la materia e il campo elettromagnetico per farsi sintassi. Il cosmo osservabile si rivela così non come uno spazio vuoto popolato da oggetti distanti, ma come un'architettura saturabile di dati, in cui il rumore e l'anomalia cinematica costituiscono le uniche crepe attraverso cui l'invisibile traduce la propria presenza."
  ],
  sections: [],
  corollaries: [],
  openAporias: [],
  bibliographicResonances: []
};

export const EDITORIAL_FEED: EditorialEdition[] = [
  {
    id: "edition-today",
    isLatest: true,
    cycle: CURRENT_EDITORIAL_CYCLE,
    systemPair: {
      vectorA: "3. La Tecnologia CRISPR",
      vectorB: "2. La Transcomunicazione Strumentale (TCI)",
      syntheticVector: "Sintassi cromosomica hertziana e risonanza di fase dell'informazione vivente",
      ontologicalMatrix: "Interfaccia di soglia tra la topologia dell'acido nucleico e la modulazione stocastica del vuoto elettromagnetico",
      derivationTimestamp: TODAY_FORMATTED
    },
    essay: CURRENT_SPECULATIVE_ESSAY,
    phase1Decomposition: buildPhase1Decomposition("3. La Tecnologia CRISPR", "2. La Transcomunicazione Strumentale (TCI)"),
    phase2Collision: buildPhase2Collision("3. La Tecnologia CRISPR", "2. La Transcomunicazione Strumentale (TCI)"),
    phase2Loop: buildPhase2LoopFiveDirections("3. La Tecnologia CRISPR", "2. La Transcomunicazione Strumentale (TCI)"),
    phase3FinalStrike: buildPhase3FinalStrike("3. La Tecnologia CRISPR", "2. La Transcomunicazione Strumentale (TCI)"),
    pins: [],
    tensions: [],
    aiProvider: "openrouter",
    aiModel: "nex-agi/nex-n2.5-pro:free"
  }
];
