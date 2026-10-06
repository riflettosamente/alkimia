/**
 * Motore Logico dell'Indagine Speculativa
 * 
 * Architettura a Due Passi (Officina Analitica + Composizione Letteraria Pura):
 * 
 * • Passo 1 (Analisi e Collisione): Il motore genera le Fasi 1, 2, 3 e 4.
 *   Si concentra unicamente sul rigore analitico, sulla collisione e sulle 5 lenti del Loop.
 * 
 * • Passo 2 (Composizione Letteraria Pura): Il motore riceve l'output del Passo 1
 *   come "dati di input / appunti di bottega" e compone un saggio di 1.200 - 1.800 parole
 *   in prosa continua, privo di etichette metodologiche e gergo procedurale.
 */

import { KeyOntologicalTopic } from './ontologicalSystemPrompt';
import { 
  Phase1StructuralDecomposition,
  Phase1EmpiricalArchive,
  Phase2CollisionDecomposition,
  Phase2LoopFiveDirections,
  Phase3FinalStrike,
  SpeculativeEssay,
  SystemConceptualPair
} from '../types';

export interface CompleteInvestigationPayload {
  systemPair: {
    vectorA: string;
    vectorB: string;
    syntheticVector: string;
    ontologicalMatrix: string;
    derivationTimestamp: string;
  };
  phase1Decomposition?: Phase1StructuralDecomposition;
  phase1EmpiricalArchive?: Phase1EmpiricalArchive;
  phase2Collision?: Phase2CollisionDecomposition;
  phase2Loop?: Phase2LoopFiveDirections;
  phase3FinalStrike?: Phase3FinalStrike;
  essay: {
    title: string;
    subtitle: string;
    ontologicalThesis: string;
    narrativeParagraphs: string[];
  };
}

/**
 * Prompt per il PASSO 1: Analisi e Collisione Ontologica (Fasi 1, 2, 3 e 4).
 * Focus assoluto sul rigore analitico, l'esplorazione tassonomica e la formulazione delle faglie.
 */
export function buildStep1AnalysisPrompt(
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic,
  webContextA?: string,
  webContextB?: string
): string {
  const webEvidenceSection = (webContextA || webContextB)
    ? `\n================================================================================
REPERTI, FONTI DOCUMENTALI E RICERCA WEB LIVE A COSTO ZERO:
Dati oggettivi e fonti estratti per «${vectorA.name}»:
${webContextA || 'Nessuna fonte specifica'}

Dati oggettivi e fonti estratti per «${vectorB.name}»:
${webContextB || 'Nessuna fonte specifica'}
================================================================================
ISTRUZIONE OBBLIGATORIA PER LA FASE 1.5 (ARCHIVIO EMPIRICO):
Attingi rigorosamente ai fatti, libri, scienziati, testimoni, date e strumenti emersi dalle fonti web live sopra riportate.
`
    : '';

  return `SEI IL MOTORE LOGICO D'INDAGINE ANALITICA DI ALKIMIA.
Conduci l'indagine speculativa preparatoria tra i seguenti due vettori ontologici:

================================================================================
VETTORE A: ${vectorA.name}
Definizione Filosofico-Operativa: ${vectorA.operationalDefinition}

VETTORE B: ${vectorB.name}
Definizione Filosofico-Operativa: ${vectorB.operationalDefinition}
================================================================================
${webEvidenceSection}
Esegui con il massimo rigore le 4 fasi di ricerca preliminare.
REGOLA FONDAMENTALE DI PROFONDITÀ (ANTI-STERILITÀ):
- È SEVERAMENTE VIETATO rispondere con singole parole, elenchi telegrafici o definizioni ridotte all'osso.
- Ogni campo deve consistere in un'analisi concettuale densa, articolata e filosoficamente pregnante (da 2 a 4 frasi dense per ogni proprietà, salvo i soli verbi fondamentali all'infinito).
- La ricerca deve illuminare le fratture epistemologiche, la fenomenologia dell'esperienza e le implicazioni ontologiche profonde.

1. FASE 1: SCOMPOSIZIONE STRUTTURALE (Coordinate 6W + Il Velato per entrambi i vettori)
   Analizza per Vettore A e Vettore B:
   - whenWhere: Contesto Storico e Spaziale (genesi culturale, epoca o trauma collettivo d'origine, almeno 2-3 frasi dense)
   - what: Definizione Scientifica o Fisica oggettiva (descrizione rigorosa e meccanicistica del fenomeno, 2-3 frasi)
   - how: Meccanismo d'Azione o "ferro del mestiere" (processo operativo e dinamica materiale/informativa, 2-3 frasi)
   - who: Percezione ed Esperienza Umana (risonanza viscerale, psicologica e fenomenologica nella coscienza, 2-3 frasi)
   - whichBoundary: Confine Sfidato tra noto e ignoto (la soglia di realtà o il limite epistemico messo in crisi, 2-3 frasi)
   - whyVeiled: La Traccia e il Velato (l'intuizione di una dimensione latente non ancora codificata dalla scienza ordinaria, 2-3 frasi)

2. FASE 2: L'ARCHIVIO EMPIRICO E MATERIALE (I Fatti Concreti, le Opere, i Testimoni e i Reperti)
   Censisci per ciascun argomento la massa critica reale di dati, fatti e fonti. 
   REGOLA TASSATIVA PER LA FASE 2:
   - È SEVERAMENTE VIETATO usare le parole "Vettore A", "Vettore B", "Argomento I", "Argomento II" nel testo!
   - È SEVERAMENTE VIETATO usare generalità astratte o formule generiche (es. "alcuni scienziati", "monografie storiche", "strumenti di laboratorio").
   - DEVI OBBLIGATORIAMENTE citare NOMI E COGNOMI REALI, DATE ESATTE, TITOLI D'OPERA O DOSSIER TRA VIRGOLETTE, NOMI DI MONUMENTI/SITI ARCHEOLOLOGICI, NOMI DI STRUMENTI/DISPOSITIVI E DI RILEVATORI SPECIALISTICI.
   - USA IL GRASSETTO **nome / titolo / data / strumento** per evidenziare visivamente ogni nome, cognome, data, titolo di libro e strumento citato!
   
   Campi da compilare per ciascun argomento:
   - foundationalTexts: Supporti e Opere Fondative (**titoli di libri/dossier/codici**, **autori**, **date di pubblicazione/emissione**, 2-3 frasi dense)
   - keyFiguresAndWitnesses: Persone e Testimoni (**scienziati**, **pionieri**, **filosofi**, **testimoni oculari/militari/clinici** con nome, cognome e ruolo reale, 2-3 frasi)
   - materialEvidenceAndTools: Reperti, Strumenti e Misurazioni (**strumentazioni tecnologiche specifiche**, **frequenze/bande**, **misurazioni EEG/fMRI/SPECT/radar**, **monumenti**, **siti archeologici** o **anomalie materiali**, 2-3 frasi)
   - breakthroughTheories: Paradigmi e Teorie di Svolta (**modelli teorici e teoremi storici con nome, cognome del formulatore e anno**, 2-3 frasi)
   - crossArchiveSynthesis: Sintesi dell'Incrocio (come la combinazione di questi reperti reali apre l'accesso alla collisione, 2-3 frasi)

3. FASE 3: LA COLLISIONE FONDAMENTALE (I 4 Passaggi di Attrito Radicati nell'Archivio Empirico di Fase 2)
   REGOLA TASSATIVA: La collisione non deve essere un esercizio filosofico astratto. Deve far collidere i protocolli tecnici, gli strumenti di rilevazione (radar, spettrometri, tracciati EEG, campioni) e le testimonianze storiche censite nella FASE 2:
   - step1StrippingFunction: Trapianto di Funzione (Dai concetti ai gesti tecnici)
     * Isola il singolo verbo ontologico fondante all'infinito per ciascun argomento, estraendolo direttamente dal gesto operativo, dallo strumento tecnico o dal metodo di lavoro documentato nella Fase 2.
     * Spiega le rispettive funzioni astratte radicate nelle tecnologie e pratiche dei due argomenti in 2 frasi ciascuna.
     * Formula una sintesi funzionale d'attrito in 2-3 frasi dense.
   - step2BlindAxis: Asse Cieco (L'Impotenza e il Vicolo Cieco dello Strumento di Misura)
     * Articola il limite o confine invalicabile del primo argomento come limite fisico, di frequenza o di risoluzione del suo strumento materiale censito in Fase 2 (2-3 frasi).
     * Spiega come il vicolo cieco e l'impotenza di tale apparato strumentale diventi la porta d'accesso e la condizione di necessità per accogliere il secondo argomento (2-3 frasi).
     * Individua il punto esatto di frattura sulla crepa ontologica tra i due apparati empirici (2-3 frasi).
   - step3InvertedDirection: Inversione di Dominio (L'Esperimento Mentale di Laboratorio Incrociato)
     * Prendi lo strumento tecnologico o il protocollo di rilevazione reale del primo argomento censito in Fase 2 (es. radar a scansione di fase, spettrometro di massa, sequencing genomico, interferometro) e applicalo brutalmente al fenomeno o al soggetto del secondo (2-3 frasi).
     * Formula una domanda provocatoria di rottura incentrata su questo esperimento incrociato di laboratorio.
     * Sviluppa un'intuizione controintuitiva che sovverte il paradigma ordinario (2-3 frasi).
   - step4CommonMetaphor: Metafora Comune e Reperto Unificante
     * Titolo evocativo della metafora generatrice radicata nei supporti materiali dell'uomo (tracciati, memorie magnetiche, cristalli di silicio, monumenti o circuiti risonanti).
     * Esplicita la radice cosmologica e antropologica profonda che unisce i due reperti (2-3 frasi).
     * Formula la visione unificante a livello sistemico (2-3 frasi).

4. FASE 4: IL LOOP COGNITIVO A 5 PROSPETTIVE (La Collisione Interrogata Sotto 5 Lenti Accoppiate ai Cassetti dell'Archivio Empirico di Fase 2)
   REGOLA TASSATIVA: Ciascuna delle 5 Direzioni NON deve essere una variazione filosofica astratta, ma deve prelevare e smontare UNO SPECIFICO CASSETTO dell'Archivio Empirico di Fase 2, estraendo una COPPIA DI VERBI NUOVA E DIVERSA per ogni direzione e mantenendo il grassetto **termine** su nomi, date, opere e strumenti nei 4 passaggi:
   - Direzione 1 (Termodinamica / Entropica) ⟵ INTERROGA IL CASSETTO "STRUMENTI E FREQUENZE" (materialEvidenceAndTools di Fase 2):
     Fa scontrare il consumo energetico, il rumore termico e la dispersione del segnale dello strumento del 1° argomento con l'ordine neghentropico e la coerenza bio-elettrica/fisica misurata dallo strumento del 2° argomento.
   - Direzione 2 (Ecologico-Evolutiva) ⟵ INTERROGA IL CASSETTO "PERSONE, SCIENZIATI E TESTIMONI" (keyFiguresAndWitnesses di Fase 2):
     Studia i testimoni oculari, i clinici, gli scienziati e le istituzioni censiti in Fase 2 come anticorpi, membrane immunitarie o mutazioni adattive con cui la specie umana regge l'urto dell'ignoto senza collasso sistemico.
   - Direzione 3 (Semiotica / Di Traduzione) ⟵ INTERROGA IL CASSETTO "OPERE, LIBRI E DOSSIER FONDATIVI" (foundationalTexts di Fase 2):
     Prende per titolo e data i libri, i codici e i verbali ufficiali della Fase 2 e li analizza come dizionari di traduzione parziali o falliti tra un segnale sorgente che non possiede alfabeto e la lingua umana.
   - Direzione 4 (Metamorfica / Biologica) ⟵ INTERROGA IL CASSETTO "CORPO, TESSUTI E MATERIA VIVENTE" (elementi biologici/chimici/somatici in materialEvidenceAndTools e keyFiguresAndWitnesses di Fase 2):
     Indaga cosa accade alla carne, alle sinapsi, alle cellule e ai biomarcatori quando i due domini collidono: la mutazione fisiologica dell'osservatore trasformato nello strumento di rilevazione.
   - Direzione 5 (Architetturale / Sistemica) ⟵ INTERROGA IL CASSETTO "PARADIGMI, TEOREMI ED EQUAZIONI" (breakthroughTheories e crossArchiveSynthesis di Fase 2):
     Mette a confronto diretto i modelli teorici, i teoremi e le equazioni con nome del formulatore e anno della Fase 2 per svelare l'architettura a strati del reale (il modello del 1° argomento bloccato al livello N, il modello del 2° argomento operante al livello N+1).
   Per ciascuna traccia sviluppa in modo esaustivo:
   * directionNumber (1-5) e directionTitle esatto
   * empiricalDrawerLabel: l'etichetta del cassetto di Fase 2 interrogato
   * empiricalEvidenceExamined: l'elenco esplicito (in **grassetto**) dei reperti di Fase 2 del 1° e del 2° argomento messi in collisione in questa specifica direzione
   * ontologicalAngle: densa spiegazione (3-4 frasi con riferimenti in **grassetto**) dell'angolazione applicata a quei reperti
   * collision: applica integralmente i 4 step (step1StrippingFunction con 2 verbi nuovi e specifici per questa lente, step2BlindAxis, step3InvertedDirection, step4CommonMetaphor), ciascuno di 2-3 frasi dense con i nomi, le date e gli strumenti di Fase 2 evidenziati in **grassetto**.

5. FASE 5: L'AFFONDO FINALE (Protocollo Sperimentale e Manifesto Operativo Radicato nei 5 Cassetti della Fase 2)
   REGOLA TASSATIVA: La Fase 5 trasforma l'Archivio Empirico (Fase 2), la Collisione (Fase 3) e il Loop a 5 Direzioni (Fase 4) in un PROTOCOLLO DI SPERIMENTAZIONE REALE.
   - È SEVERAMENTE VIETATO usare frasi generiche ("unire fisica e spiritualità", "superare il riduzionismo cartesiano").
   - DEVI OBBLIGATORIAMENTE nominare e mettere in **grassetto** gli **strumenti**, le **frequenze**, i **testimoni/scienziati**, i **libri/dossier** e i **teoremi** emersi nella Fase 2 sia nella Sintesi Macro sia nelle 5 schede direzionali (directionStrikes):
   - cuiProdest: Il Dogma Spezzato nei Testi e nelle Istituzioni di Fase 2 (nomina in **grassetto** quali istituzioni, commissioni o paradigmi storici della Fase 2 vengono scardinati e quali testimoni o pionieri vengono legittimati, 2-3 frasi).
   - groundbreakingDiscovery: La Legge Unificante tra i Reperti di Fase 2 (formula il principio nuovo unendo per nome in **grassetto** i teoremi, le equazioni e le misurazioni della Fase 2, 2-3 frasi).
   - uninvestigatedBias: La Cecità Incrociata tra gli Specialisti di Fase 2 (spiega perché chi usa il **primo strumento/protocollo di Fase 2** ha sempre ignorato i dati raccolti da chi usa il **secondo strumento/protocollo di Fase 2**, 2-3 frasi).
   - researchFocusIntersection: Il Protocollo di Laboratorio Reale con gli Strumenti di Fase 2 (prescrivi un esperimento concreto di laboratorio che incrocia gli **strumenti reali, le frequenze e i campioni della Fase 2**, 2-3 frasi).
   - dizzyingRevelation: L'Orizzonte Ontologico Finale (parti dal reperto materiale più estremo della Fase 2 in **grassetto** per aprire la visione finale che prepara il Saggio di Fase 6, 2-3 frasi).
   - directionStrikes: Array delle 5 declinazioni specifiche in cui ogni Direzione tira le conclusioni operative sul PROPRIO CASSETTO di Fase 2 (1: Strumenti e Frequenze, 2: Testimoni e Scienziati, 3: Libri e Dossier, 4: Corpo e Soglie Somatiche, 5: Teoremi e Paradigmi), con riferimenti in **grassetto**.

Rispondi RIGOROSAMENTE con un oggetto JSON valido avente questa struttura:
{
  "systemPair": {
    "vectorA": "${vectorA.name}",
    "vectorB": "${vectorB.name}",
    "syntheticVector": "string (sintesi concisa dell'intuizione scaturita dalla collisione)",
    "ontologicalMatrix": "string (campo d'attrito e matrice ontologica)"
  },
  "phase1Decomposition": {
    "vectorA": {
      "topicName": "${vectorA.name}",
      "whenWhere": "string",
      "what": "string",
      "how": "string",
      "who": "string",
      "whichBoundary": "string",
      "whyVeiled": "string"
    },
    "vectorB": {
      "topicName": "${vectorB.name}",
      "whenWhere": "string",
      "what": "string",
      "how": "string",
      "who": "string",
      "whichBoundary": "string",
      "whyVeiled": "string"
    }
  },
  "phase1EmpiricalArchive": {
    "vectorA": {
      "topicName": "${vectorA.name}",
      "foundationalTexts": "string (libri, trattati, dossier e testi fondativi, 2-3 frasi)",
      "keyFiguresAndWitnesses": "string (figure, scienziati, pionieri e testimoni chiave, 2-3 frasi)",
      "materialEvidenceAndTools": "string (reperti, tracciati radar/EEG, fotogrammi, anomalie fisiche o monumenti, 2-3 frasi)",
      "breakthroughTheories": "string (paradigmi e modelli interpretativi storici di svolta, 2-3 frasi)"
    },
    "vectorB": {
      "topicName": "${vectorB.name}",
      "foundationalTexts": "string",
      "keyFiguresAndWitnesses": "string",
      "materialEvidenceAndTools": "string",
      "breakthroughTheories": "string"
    },
    "crossArchiveSynthesis": "string (sintesi dell'incrocio tra la massa critica dei fatti di A e B, 2-3 frasi)"
  },
  "phase2Collision": {
    "step1StrippingFunction": {
      "fundamentalVerbA": "string (singolo verbo all'infinito tratto dal gesto tecnico/metodo di A censito in Fase 1.5)",
      "abstractFunctionA": "string (funzione astratta radicata nell'apparato strumentale di A, 2 frasi)",
      "fundamentalVerbB": "string (singolo verbo all'infinito tratto dal gesto tecnico/metodo di B censito in Fase 1.5)",
      "abstractFunctionB": "string (funzione astratta radicata nell'apparato strumentale di B, 2 frasi)",
      "functionalSynthesis": "string (sintesi dell'attrito tra i due gesti operativi, 2-3 frasi)"
    },
    "step2BlindAxis": {
      "boundaryA": "string (limite o vicolo cieco insuperabile dello strumento/protocollo di misura di A censito in Fase 1.5)",
      "accessDoorToB": "string (come l'impotenza dello strumento di A dischiude la necessità dell'esperienza/fenomeno di B)",
      "creviceContactPoint": "string (punto esatto di frattura sulla crepa ontologica tra i due apparati empirici, 2-3 frasi)"
    },
    "step3InvertedDirection": {
      "methodAAppliedToB": "string (esperimento di laboratorio incrociato: lo strumento/protocollo reale di A applicato brutalmente al materiale di B, 2-3 frasi)",
      "provocativeViolationQuestion": "string (quesito provocatorio di rottura incentrato su questo esperimento tecnico incrociato)",
      "counterIntuitiveInsight": "string (intuizione controintuitiva che sovverte il paradigma ordinario, 2-3 frasi)"
    },
    "step4CommonMetaphor": {
      "masterMetaphorTitle": "string (titolo evocativo della metafora generatrice radicata nei supporti materiali dell'uomo)",
      "cosmologicalAnthropologicalGround": "string (radice antropologica e cosmologica comune che unisce i due reperti materiali, 2-3 frasi)",
      "unifyingVision": "string (visione unificante a livello sistemico, 2-3 frasi)"
    }
  },
  "phase2Loop": {
    "theoreticalPreamble": "string (introduzione teorica alla quintuplice faglia ontologica radicata negli apparati empirici e nei reperti della Fase 1.5)",
    "tracks": [
      {
        "directionNumber": 1,
        "directionTitle": "Direzione 1: Prospettiva Termodinamica / Entropica",
        "ontologicalAngle": "string (angolazione specifica declinata sui parametri fisici, dissipativi e strumenti censiti in Fase 1.5)",
        "collision": {
          "step1StrippingFunction": {
            "fundamentalVerbA": "string (singolo verbo all'infinito tratto dalla pratica tecnica di A censita in Fase 1.5)",
            "abstractFunctionA": "string (funzione astratta radicata nella tecnica di A)",
            "fundamentalVerbB": "string (singolo verbo all'infinito tratto dalla pratica tecnica di B censita in Fase 1.5)",
            "abstractFunctionB": "string (funzione astratta radicata nella tecnica di B)",
            "functionalSynthesis": "string (sintesi di contatto e attrito funzionale sotto questa lente)"
          },
          "step2BlindAxis": {
            "boundaryA": "string (limite fisico o di banda passante dello strumento di A censito in Fase 1.5)",
            "accessDoorToB": "string (come l'impotenza dello strumento di A spalanca la necessità di B)",
            "creviceContactPoint": "string (punto esatto di frattura ontologica tra i due apparati sotto questa lente)"
          },
          "step3InvertedDirection": {
            "methodAAppliedToB": "string (applicazione brutale del protocollo/strumento materiale di A al fenomeno di B)",
            "provocativeViolationQuestion": "string (domanda di laboratorio provocatoria e radicale)",
            "counterIntuitiveInsight": "string (scoperta controintuitiva scaturita dall'inversione sperimentale)"
          },
          "step4CommonMetaphor": {
            "masterMetaphorTitle": "string (titolo archetipale radicato nel supporto materiale o tracciato comune)",
            "cosmologicalAnthropologicalGround": "string (radice antropologica o cosmologica profonda)",
            "unifyingVision": "string (visione unificante del continuum tra i due fenomeni)"
          }
        }
      }
    ]
  },
  "phase3FinalStrike": {
    "cuiProdest": "string",
    "groundbreakingDiscovery": "string",
    "uninvestigatedBias": "string",
    "researchFocusIntersection": "string",
    "dizzyingRevelation": "string"
  }
}`;
}

/**
 * Prompt per lo STADIO 6 (ex Passo 2): Composizione Letteraria Pura (Fase 6: Saggio del Giorno).
 * Riceve come input l'intero dossier analitico delle Fasi 1, 2, 3, 4 e 5 ed esegue la trasfigurazione letteraria.
 */
export function buildStep2LiteraryEssayPrompt(
  step1Dossier: any,
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic
): string {
  // Funzione interna per rimuovere i marcatori **...** dagli appunti passati alla Fase 6,
  // così il modello riceve i nomi propri, le date e gli strumenti puliti e non copia gli asterischi nel saggio.
  const stripMdBold = (s?: string) => (s ? s.replace(/\*\*(.*?)\*\*/g, '$1') : '');

  const syntheticVector = stripMdBold(step1Dossier?.systemPair?.syntheticVector) || `Collisione tra ${vectorA.name} e ${vectorB.name}`;
  const ontologicalMatrix = stripMdBold(step1Dossier?.systemPair?.ontologicalMatrix) || "Matrice d'Attrito Ontologico";
  
  const vA = step1Dossier?.phase1Decomposition?.vectorA;
  const vB = step1Dossier?.phase1Decomposition?.vectorB;
  const empA = step1Dossier?.phase1EmpiricalArchive?.vectorA;
  const empB = step1Dossier?.phase1EmpiricalArchive?.vectorB;
  const empSynthesis = stripMdBold(step1Dossier?.phase1EmpiricalArchive?.crossArchiveSynthesis);
  const p2 = step1Dossier?.phase2Collision;
  const p3 = step1Dossier?.phase3FinalStrike;
  const loopTracks = step1Dossier?.phase2Loop?.tracks || [];

  const loopInsightsSummary = loopTracks.map((t: any, idx: number) => {
    const dirNum = t.directionNumber || idx + 1;
    const s1 = t.collision?.step1StrippingFunction || {};
    const s2 = t.collision?.step2BlindAxis || {};
    const s3 = t.collision?.step3InvertedDirection || {};
    const s4 = t.collision?.step4CommonMetaphor || {};
    return [
      `• DIREZIONE #${dirNum} — ${stripMdBold(t.directionTitle || 'Faglia Ontologica')} (Reperti esaminati: ${stripMdBold(t.empiricalEvidenceExamined)}):`,
      `  - Inquadramento del Cassetto: ${stripMdBold(t.ontologicalAngle)}`,
      `  - Verbi Specifici del Cassetto: ${stripMdBold(s1.fundamentalVerbA)} × ${stripMdBold(s1.fundamentalVerbB)}`,
      `  - Sintesi Funzionale: ${stripMdBold(s1.functionalSynthesis)}`,
      `  - Punto di Contatto (Soglia e Varco): ${stripMdBold(s2.boundaryA)} ⟶ ${stripMdBold(s2.accessDoorToB)}`,
      `  - Crepa Asimmetrica: ${stripMdBold(s2.creviceContactPoint)}`,
      `  - Inversione Operativa: ${stripMdBold(s3.methodAAppliedToB)} (Domanda di violazione: ${stripMdBold(s3.provocativeViolationQuestion)})`,
      `  - Intuizione Contro-Intuitiva: ${stripMdBold(s3.counterIntuitiveInsight)}`,
      `  - Simbolo Archetipale e Visione: ${stripMdBold(s4.masterMetaphorTitle)} — ${stripMdBold(s4.cosmologicalAnthropologicalGround)} — ${stripMdBold(s4.unifyingVision)}`
    ].join('\n');
  }).join('\n\n');

  return `HAI A DISPOSIZIONE L'INTERA INDAGINE PRELIMINARE ARTICOLATA NELLE FASI 1, 2, 3, 4 E 5.
IL TUO UNICO COMPITO ORA È COMPORRE IL SAGGIO DEL GIORNO (FASE 6) IN PURA PROSA CONTINUA D'AUTORE (1.200 - 1.800 PAROLE), SENZA ELENCHI, SENZA GERGO PROCEDURALE E SENZA ALCUN GRASSETTO (**).

================================================================================
DOSSIER COMPLETO DELLE FASI PRECEDENTI (DA INCARDINARE NELLA PROSA DEL SAGGIO)
================================================================================
PRIMO ARGOMENTO: ${vectorA.name}
SECONDO ARGOMENTO: ${vectorB.name}
SINTESI D'ATTRITO: ${syntheticVector}
MATRICE ONTOLOGICA: ${ontologicalMatrix}

1. COORDINATE E SOGLIE (dalla Fase 1):
- ${vectorA.name}: Contesto: ${stripMdBold(vA?.whenWhere)} | Confine: ${stripMdBold(vA?.whichBoundary)} | Il Velato: ${stripMdBold(vA?.whyVeiled)}
- ${vectorB.name}: Contesto: ${stripMdBold(vB?.whenWhere)} | Confine: ${stripMdBold(vB?.whichBoundary)} | Il Velato: ${stripMdBold(vB?.whyVeiled)}

2. ARCHIVIO EMPIRICO INTEGRALE DEI 4 CASSETTI (dalla Fase 2 — I NOMI, LE DATE, LE OPERE E GLI STRUMENTI DEVONO ESSERE CITATI NEL SAGGIO!):
- [Cassetto Opere e Dossier di ${vectorA.name}]: ${stripMdBold(empA?.foundationalTexts)}
- [Cassetto Scienziati e Testimoni di ${vectorA.name}]: ${stripMdBold(empA?.keyFiguresAndWitnesses)}
- [Cassetto Strumenti, Frequenze e Reperti di ${vectorA.name}]: ${stripMdBold(empA?.materialEvidenceAndTools)}
- [Cassetto Teoremi e Paradigmi di ${vectorA.name}]: ${stripMdBold(empA?.breakthroughTheories)}
- [Cassetto Opere e Dossier di ${vectorB.name}]: ${stripMdBold(empB?.foundationalTexts)}
- [Cassetto Scienziati e Testimoni di ${vectorB.name}]: ${stripMdBold(empB?.keyFiguresAndWitnesses)}
- [Cassetto Strumenti, Frequenze e Reperti di ${vectorB.name}]: ${stripMdBold(empB?.materialEvidenceAndTools)}
- [Cassetto Teoremi e Paradigmi di ${vectorB.name}]: ${stripMdBold(empB?.breakthroughTheories)}
- [Sintesi dell'Incrocio Empirico]: ${empSynthesis}

3. LA COLLISIONE E L'ESPERIMENTO INCROCIATO (dalla Fase 3):
- Verbi estratti: ${stripMdBold(p2?.step1StrippingFunction?.fundamentalVerbA)} × ${stripMdBold(p2?.step1StrippingFunction?.fundamentalVerbB)} (${stripMdBold(p2?.step1StrippingFunction?.functionalSynthesis)})
- Limite Strumentale e Soglia Cieca: ${stripMdBold(p2?.step2BlindAxis?.boundaryA)} ⟶ ${stripMdBold(p2?.step2BlindAxis?.accessDoorToB)} (${stripMdBold(p2?.step2BlindAxis?.creviceContactPoint)})
- Esperimento di Laboratorio Incrociato: ${stripMdBold(p2?.step3InvertedDirection?.methodAAppliedToB)} — ${stripMdBold(p2?.step3InvertedDirection?.counterIntuitiveInsight)}
- Metafora Madre: ${stripMdBold(p2?.step4CommonMetaphor?.masterMetaphorTitle)} — ${stripMdBold(p2?.step4CommonMetaphor?.unifyingVision)}

4. LE 5 DIREZIONI INTEGRALI DEL LOOP: SINTESI FUNZIONALI, CREPE ASIMMETRICHE E INTUIZIONI CONTRO-INTUITIVE (dalla Fase 4):
${loopInsightsSummary}

5. SINTESI NARRATIVA GENERALE DELL'INDAGINE INTEGRALE NEI 5 PUNTI ESTESI (dalla Fase 5):
- [§1 Cosa cambia nella nostra comprensione]:
${stripMdBold(p3?.cuiProdest)}
- [§2 Il filo invisibile che unisce i due fenomeni]:
${stripMdBold(p3?.groundbreakingDiscovery)}
- [§3 Perché finora nessuno aveva unito i puntini]:
${stripMdBold(p3?.uninvestigatedBias)}
- [§4 La prova sul campo e la verifica sperimentale]:
${stripMdBold(p3?.researchFocusIntersection)}
- [§5 Lo sguardo d'insieme]:
${stripMdBold(p3?.dizzyingRevelation)}

================================================================================
DIRETTIVE DI COMPOSIZIONE PLASTICA DEL SAGGIO FINALE (LA VERA ALKIMIA E I NUOVI ORIZZONTI)
================================================================================
Il Saggio del Giorno (Fase 6) non deve essere una fredda cronaca di nomi e date, né un esercizio estetico astratto. Deve far capire con forza e chiarezza al lettore:
1. QUAL È LA VERA ALKIMIA TRA «${vectorA.name}» E «${vectorB.name}»: cosa succede quando questi due mondi smettono di essere separati e si fecondano a vicenda?
2. QUALE NUOVA INTUIZIONE ABBIAMO RIVELATO: qual è la scoperta concettuale o empirica emersa attraverso la Collisione (Fase 3) e le 5 Direzioni (Fase 4) che prima rimaneva invisibile?
3. QUALI NUOVI CAMPI DI RICERCA E APPLICAZIONI POSSIAMO ESPLORARE: quali indagini scientifiche, tecnologiche, cliniche, antropologiche o filosofiche nascono da questa sintesi (Fase 5)?

REGOLA DI PLASTICITÀ SU MISURA PER LA COPPIA «${vectorA.name}» × «${vectorB.name}»:
Adatta con intelligenza il registro, il lessico e la natura delle applicazioni ai due argomenti in gioco:
- Se i due argomenti sono prevalentemente fisici, genetici o neurobiologici, approfondisci i meccanismi sperimentali, biofisici e tecnologici.
- Se uno o entrambi gli argomenti riguardano l'esperienza interiore, la Spiritualità o l'Aldilà, non forzare artificiosamente gerghi di laboratorio dove suonerebbero finti: esplora con rigore e profondità la fenomenologia della coscienza, le scienze contemplative, la trasformazione interiore dell'uomo e le nuove domande filosofiche sul vivere e sul morire.
- Se gli argomenti toccano anomalie di frontiera (UFO/UAP, Extraterrestri, Transcomunicazione), metti al centro il problema della percezione, della decodifica del segnale, dei limiti degli strumenti umani e dell'incontro con l'alterità cosmica.
- Usa i nomi, le date, le opere e gli strumenti della Fase 2 come fondamenta reali del discorso, spiegando sempre PERCHÉ sono decisivi per la nostra tesi.

REGOLA TIPOGRAFICA E LINGUISTICA TASSATIVA PER LA FASE 6:
- NON USARE MAI IL GRASSETTO (**termine**) né asterischi nel titolo, nel sottotitolo, nella tesi o nei 5 paragrafi!
- Scrivi in un ITALIANO CONTEMPORANEO LIMPIDO, NATURALE, SCORREVOLE E INCISIVO: frasi ben costruite, nessi logici cristallini, zero parole inventate o calchi innaturali, zero pose criptiche o barocche.

Struttura il saggio in 5 ampi paragrafi narrativi continui (1.200 - 1.800 parole complessive):
- Paragrafo 1 — L'Innesco e il Paradosso di Partenza:
  Entra nel vivo mettendo in scena il contrasto apparente tra «${vectorA.name}» e «${vectorB.name}» attraverso i fatti, i protagonisti o i testi più emblematici dell'indagine (senza grassetti), facendo subito percepire al lettore quale grande domanda si nasconde dietro la loro separazione.
- Paragrafo 2 — La Soglia Condivisa e il Punto di Contatto:
  Racconta in modo limpido dove gli strumenti, i modelli o i linguaggi del primo ambito incontrano il proprio limite e mostra come proprio quella soglia apra il varco verso il secondo fenomeno (integrando con naturalezza la Collisione di Fase 3).
- Paragrafo 3 — La Trasmutazione Alchemica e le Nuove Intuizioni:
  Il cuore pulsante del saggio: intreccia in un discorso fluido e illuminante le Sintesi Funzionali, le Crepe Asimmetriche e le Intuizioni Contro-Intuitive emerse nelle 5 direzioni della Fase 4 (senza mai usare le parole "Loop", "Cassetto" o "Direzione"). Spiega chiaramente qual è la nuova chiave di lettura che trasforma entrambi gli argomenti.
- Paragrafo 4 — Nuovi Campi di Ricerca, Applicazioni e Indagini Filosofiche:
  Raccogli la ricchezza dei 5 punti della Fase 5 e mostra concretamente quali orizzonti inediti si aprono: quali nuovi esperimenti, protocolli di osservazione, applicazioni pratiche o nuove ricerche filosofiche sulla mente, sulla materia e sull'uomo diventano finalmente possibili grazie a questa Alkimia.
- Paragrafo 5 — Lo Sguardo d'Insieme e la Nuova Prospettiva sul Reale:
  Riprende l'immagine unificante del dossier e porta il discorso alla sua conclusione più ampia e luminosa, lasciando al lettore una visione chiara, profonda e trasformativa del legame tra i due mondi.

================================================================================
NEGATIVE CONSTRAINT LIST (LISTA NERA ASSOLUTA - MAI NEL TESTO)
================================================================================
Nel testo del saggio (titolo, sottotitolo, tesi ontologica, paragrafi) È TASSATIVAMENTE VIETATO:
- NON USARE asterischi o grassetti Markdown (**...**)
- NON USARE parole deformate, neologismi spuri o calchi non italiani (es. "regula", "ipotese", "pinealico", "spaziativa", "piante cerebrale")
- NON USARE le formule: "Cui prodest", "Cui prodest?", "A chi giova", "viene scardinato", "vengono legittimati", "monopolio interpretativo"
- NON USARE la formula: "La vertigine finale" o "vertigine finale"
- NON USARE formule preconfezionate come: "Stanza del reale", "porte girevoli tra i piani"
- NON USARE etichette procedurali: "Fase 1", "Fase 2", "Fase 3", "Fase 4", "Fase 5", "Fase 6", "Passo 1", "Passo 2", "Cassetto 1", "Cassetto 2", "Cassetto", "Vettore A", "Vettore B"
- NON USARE nomi di passaggi: "Loop cognitivo", "5 direzioni", "Asse cieco", "Trapianto di funzione", "When/Where", "What", "How"
- NON USARE elenchi puntati, elenchi numerati, né titoletti o notazioni (§)
- NON USARE formule metanarrative da chatbot ("In questo saggio...", "Analizzeremo ora...")

COMPUTO TOTALE PAROLE: Rigorosamente compreso tra 1.200 e 1.800 parole.

Rispondi RIGOROSAMENTE con questo JSON:
{
  "essay": {
    "title": "string (titolo limpido, evocativo e incisivo che esprima l'Alkimia tra i due argomenti, privo di numeri e privo di asterischi)",
    "subtitle": "string (sottotitolo chiaro che sintetizzi la nuova intuizione e l'orizzonte di ricerca, privo di asterischi)",
    "ontologicalThesis": "string (la tesi centrale dell'Alkimia formulata in modo cristallino, profondo e memorabile, priva di asterischi)",
    "narrativeParagraphs": [
      "string (Paragrafo 1: L'Innesco e il Paradosso di Partenza, in italiano limpido e senza grassetti, minimo 250 parole)",
      "string (Paragrafo 2: La Soglia Condivisa e il Punto di Contatto, senza grassetti, minimo 250 parole)",
      "string (Paragrafo 3: La Trasmutazione Alchemica e le Nuove Intuizioni emerse dall'indagine, senza grassetti, minimo 300 parole)",
      "string (Paragrafo 4: Nuovi Campi di Ricerca, Applicazioni e Indagini Filosofiche aperti da questa Alkimia, senza grassetti, minimo 280 parole)",
      "string (Paragrafo 5: Lo Sguardo d'Insieme e la Nuova Prospettiva sul Reale, senza grassetti, minimo 250 parole)"
    ]
  }
}`;
}

/**
 * Funzione unificata di compatibilità a ritroso (aggiornata senza etichette trappola).
 */
export function buildSequentialInvestigationPrompt(
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic
): string {
  return buildStep1AnalysisPrompt(vectorA, vectorB);
}

/**
 * STADIO 1 — Prompt dedicato per FASE 1: SCOMPOSIZIONE STRUTTURALE (Le 6 Domande / 5W + Il Velato).
 */
export function buildStage1DecompositionPrompt(
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic,
  webContextA?: string,
  webContextB?: string
): string {
  return `SEI IL MOTORE DI SCOMPOSIZIONE STRUTTURALE DI ALKIMIA (FASE 1).
Il tuo compito è compilare con estremo rigore analitico la FASE 1 (Scomposizione Strutturale nelle 6 Coordinate) per i due argomenti del giorno.

================================================================================
PRIMO ARGOMENTO: ${vectorA.name}
Definizione operativa: ${vectorA.operationalDefinition}
${webContextA ? `Contesto reale: ${webContextA.slice(0, 1200)}` : ''}

SECONDO ARGOMENTO: ${vectorB.name}
Definizione operativa: ${vectorB.operationalDefinition}
${webContextB ? `Contesto reale: ${webContextB.slice(0, 1200)}` : ''}
================================================================================

DIRETTIVE PER LA FASE 1 (SCOMPOSIZIONE STRUTTURALE):
- È VIETATO usare le espressioni "Vettore A" o "Vettore B" nel testo generato; usa sempre i nomi reali dei due argomenti.
- Compila per ciascun argomento le 6 coordinate con spiegazioni dense, tecniche e incisive (2-3 frasi ciascuna):
  1. whenWhere: Contesto Storico, Geografico e Culturale (epoca, luogo e vuoto collettivo in cui il fenomeno si radica)
  2. what: Definizione Scientifica o Fisica oggettiva (descrizione rigorosa del fenomeno spogliata da ogni alone vago)
  3. how: Meccanismo d'Azione o "ferro del mestiere" (processo operativo e interazione con materia/informazione)
  4. who: Percezione ed Esperienza Umana (risonanza viscerale, psicologica e fenomenologica nella coscienza)
  5. whichBoundary: Confine Sfidato tra noto e ignoto (la barriera epistemica messa in discussione)
  6. whyVeiled: La Traccia e il Velato (l'intuizione di una realtà porosa e latente non ancora decifrata)

Rispondi RIGOROSAMENTE con questo JSON:
{
  "systemPair": {
    "vectorA": "${vectorA.name}",
    "vectorB": "${vectorB.name}",
    "syntheticVector": "string (sintesi concisa dell'intuizione scaturita dall'accostamento dei due argomenti)",
    "ontologicalMatrix": "string (campo d'attrito e matrice ontologica condivisa)"
  },
  "phase1Decomposition": {
    "vectorA": {
      "topicName": "${vectorA.name}",
      "whenWhere": "string",
      "what": "string",
      "how": "string",
      "who": "string",
      "whichBoundary": "string",
      "whyVeiled": "string"
    },
    "vectorB": {
      "topicName": "${vectorB.name}",
      "whenWhere": "string",
      "what": "string",
      "how": "string",
      "who": "string",
      "whichBoundary": "string",
      "whyVeiled": "string"
    }
  }
}`;
}

/**
 * STADIO 2 — Prompt dedicato per FASE 2: ARCHIVIO EMPIRICO.
 * Basato sulle fonti e dati concreti emersi dalla ricerca web live a costo zero e dalla Fase 1.
 */
export function buildStage2EmpiricalPrompt(
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic,
  webContextA: string,
  webContextB: string,
  phase1Decomposition?: any
): string {
  const p1A = phase1Decomposition?.vectorA;
  const p1B = phase1Decomposition?.vectorB;

  return `SEI IL CUSTODE DELL'ARCHIVIO EMPIRICO E FENOMENICO DI ALKIMIA (FASE 2).
Il tuo compito è compilare la FASE 2 (Archivio dei Fatti, delle Opere, dei Testimoni e delle Strumentazioni)
per i due argomenti del giorno, attingendo ai riscontri oggettivi raccolti sul web in tempo reale e alle coordinate di Fase 1.

================================================================================
PRIMO ARGOMENTO: ${vectorA.name}
${p1A ? `Coordinate di Fase 1: Contesto: ${p1A.whenWhere} | Meccanismo: ${p1A.how}` : ''}
FONTI WEB RACCOLTE IN TEMPO REALE:
${webContextA || 'Nessuna fonte web specifica reperita.'}

SECONDO ARGOMENTO: ${vectorB.name}
${p1B ? `Coordinate di Fase 1: Contesto: ${p1B.whenWhere} | Meccanismo: ${p1B.how}` : ''}
FONTI WEB RACCOLTE IN TEMPO REALE:
${webContextB || 'Nessuna fonte web specifica reperita.'}
================================================================================

REGOLA TASSATIVA PER LA FASE 2 (ARCHIVIO EMPIRICO):
1. È SEVERAMENTE VIETATO usare le parole "Vettore A", "Vettore B", "Argomento I", "Argomento II" nel testo!
2. È SEVERAMENTE VIETATO usare formule vaghe come "alcuni scienziati", "studi recenti", "varie monografie".
3. DEVI OBBLIGATORIAMENTE citare NOMI E COGNOMI REALI, DATE ESATTE, TITOLI D'OPERA O DOSSIER TRA VIRGOLETTE, SITI ARCHEOLOGICI O MONUMENTI, NOMI DI STRUMENTI TECNOLOGICI E RILEVATORI SPECIALISTICI.
4. EVIDENZIA OGNI NOME, DATA, TITOLO E STRUMENTO USANDO IL GRASSETTO **termine**!

Rispondi RIGOROSAMENTE con questo JSON:
{
  "phase1EmpiricalArchive": {
    "vectorA": {
      "topicName": "${vectorA.name}",
      "foundationalTexts": "string (titoli di libri, dossier, codici, autori e date esatte in grassetto **...**, 2-3 frasi dense)",
      "keyFiguresAndWitnesses": "string (scienziati, pionieri, testimoni oculari con nome e cognome in grassetto **...** e date, 2-3 frasi)",
      "materialEvidenceAndTools": "string (strumentazioni tecnologiche, frequenze, misurazioni EEG/radar, monumenti in grassetto **...**, 2-3 frasi)",
      "breakthroughTheories": "string (modelli teorici e teoremi con formulatore e data in grassetto **...**, 2-3 frasi)"
    },
    "vectorB": {
      "topicName": "${vectorB.name}",
      "foundationalTexts": "string (titoli di libri, dossier, codici, autori e date esatte in grassetto **...**, 2-3 frasi dense)",
      "keyFiguresAndWitnesses": "string (scienziati, pionieri, testimoni oculari con nome e cognome in grassetto **...** e date, 2-3 frasi)",
      "materialEvidenceAndTools": "string (strumentazioni tecnologiche, frequenze, misurazioni EEG/radar, monumenti in grassetto **...**, 2-3 frasi)",
      "breakthroughTheories": "string (modelli teorici e teoremi con formulatore e data in grassetto **...**, 2-3 frasi)"
    },
    "crossArchiveSynthesis": "string (sintesi dell'incrocio tra la massa critica dei fatti e reperti reali dei due argomenti, con elementi chiave in grassetto **...**, 2-3 frasi dense)"
  }
}`;
}

export const buildPhase1_5EmpiricalPrompt = buildStage2EmpiricalPrompt;

/**
 * STADIO 3 — Prompt dedicato per FASE 3: LA COLLISIONE (I 4 Passaggi di Attrito).
 * Riceve direttamente in ingresso l'Archivio Empirico appena generato nella Fase 2!
 */
export function buildStage3CollisionPrompt(
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic,
  phase1Decomposition: any,
  phase2EmpiricalArchive: any
): string {
  const empA = phase2EmpiricalArchive?.vectorA || {};
  const empB = phase2EmpiricalArchive?.vectorB || {};
  const empSynthesis = phase2EmpiricalArchive?.crossArchiveSynthesis || '';

  return `SEI IL LABORATORIO DI COLLISIONE ONTOLOGICA DI ALKIMIA (FASE 3: LA COLLISIONE).
Il tuo compito è eseguire i 4 Passaggi di Attrito della FASE 3 facendo collidere DIRETTAMENTE E MATERIALMENTE i reperti, gli strumenti, i testimoni e le opere appena censiti nella FASE 2 (Archivio Empirico).

================================================================================
INVENTARIO VINCOLANTE DELLA FASE 2 (ARCHIVIO EMPIRICO APPENA SALVATO):

PRIMO ARGOMENTO: ${vectorA.name}
- Opere e Dossier Fondativi: ${empA.foundationalTexts || ''}
- Scienziati, Pionieri e Testimoni: ${empA.keyFiguresAndWitnesses || ''}
- Strumenti, Frequenze e Reperti Materiali: ${empA.materialEvidenceAndTools || ''}
- Teorie di Svolta: ${empA.breakthroughTheories || ''}

SECONDO ARGOMENTO: ${vectorB.name}
- Opere e Dossier Fondativi: ${empB.foundationalTexts || ''}
- Scienziati, Pionieri e Testimoni: ${empB.keyFiguresAndWitnesses || ''}
- Strumenti, Frequenze e Reperti Materiali: ${empB.materialEvidenceAndTools || ''}
- Teorie di Svolta: ${empB.breakthroughTheories || ''}

INCROCIO PRELIMINARE DEI REPERTI:
${empSynthesis}
================================================================================

REGOLA TASSATIVA PER LA FASE 3 (LA COLLISIONE):
- È SEVERAMENTE VIETATO restare sul piano filosofico astratto o usare le diciture "Vettore A" / "Vettore B".
- DEVI OBBLIGATORIAMENTE citare e far scontrare nei 4 passaggi gli **strumenti tecnici**, i **testimoni/scienziati**, le **date/frequenze** e i **dossier/libri** elencati qui sopra nella Fase 2, evidenziandoli in grassetto **termine**!

1. step1StrippingFunction (Trapianto di Funzione: Dai Reperti al Verbo):
   - fundamentalVerbA: Singolo verbo all'infinito in MAIUSCOLO che esprime il gesto tecnico dello strumento di ${vectorA.name} censito in Fase 2.
   - abstractFunctionA: Spiega (2-3 frasi) la funzione astratta di ${vectorA.name} partendo dai suoi **strumenti e protocolli reali** della Fase 2.
   - fundamentalVerbB: Singolo verbo all'infinito in MAIUSCOLO che esprime il gesto tecnico o fenomenico di ${vectorB.name} censito in Fase 2.
   - abstractFunctionB: Spiega (2-3 frasi) la funzione astratta di ${vectorB.name} partendo dai suoi **reperti, studi e misurazioni reali** della Fase 2.
   - functionalSynthesis: Sintesi d'attrito (2-3 frasi) che mostra come i due gesti strumentali operino sulla medesima soglia.

2. step2BlindAxis (Cercare l'Asse Cieco: Il Fallimento dello Strumento di Fase 2):
   - boundaryA: Indica il punto esatto in cui lo **strumento di misura o protocollo** di ${vectorA.name} citato in Fase 2 tocca il suo limite fisico, di frequenza o di risoluzione (2-3 frasi con nomi in **grassetto**).
   - accessDoorToB: Mostra come quel vicolo cieco strumentale diventi la porta d'accesso per i **fenomeni, testimoni o tracciati** di ${vectorB.name} censiti in Fase 2 (2-3 frasi con nomi in **grassetto**).
   - creviceContactPoint: Il punto esatto di frattura sulla crepa ontologica tra i due apparati empirici (2-3 frasi).

3. step3InvertedDirection (Ribaltare la Direzione: L'Esperimento di Laboratorio Incrociato):
   - methodAAppliedToB: Prendi per nome uno **strumento tecnologico o protocollo** di ${vectorA.name} (dalla Fase 2) e applicalo brutalmente a un **reperto, caso clinico o testo** di ${vectorB.name} (dalla Fase 2) (2-3 frasi con elementi in **grassetto**).
   - provocativeViolationQuestion: Una domanda provocatoria e radicale centrata su questo esperimento incrociato tra i reperti di Fase 2.
   - counterIntuitiveInsight: L'intuizione controintuitiva che ribalta il paradigma ordinario (2-3 frasi).

4. step4CommonMetaphor (Isolare la Metafora Comune):
   - masterMetaphorTitle: Titolo evocativo in MAIUSCOLO della metafora generatrice radicata nei supporti materiali di Fase 2.
   - cosmologicalAnthropologicalGround: La radice antropologica e cosmologica profonda che unisce i due reperti (2-3 frasi).
   - unifyingVision: La visione unificante a livello sistemico che fonde i due archivi empirici (2-3 frasi).

Rispondi RIGOROSAMENTE con questo JSON:
{
  "phase2Collision": {
    "step1StrippingFunction": {
      "fundamentalVerbA": "string",
      "abstractFunctionA": "string",
      "fundamentalVerbB": "string",
      "abstractFunctionB": "string",
      "functionalSynthesis": "string"
    },
    "step2BlindAxis": {
      "boundaryA": "string",
      "accessDoorToB": "string",
      "creviceContactPoint": "string"
    },
    "step3InvertedDirection": {
      "methodAAppliedToB": "string",
      "provocativeViolationQuestion": "string",
      "counterIntuitiveInsight": "string"
    },
    "step4CommonMetaphor": {
      "masterMetaphorTitle": "string",
      "cosmologicalAnthropologicalGround": "string",
      "unifyingVision": "string"
    }
  }
}`;
}

/**
 * STADIO 4 — Prompt dedicato per FASE 4: LOOP A 5 DIREZIONI.
 * Riceve in ingresso l'Archivio Empirico (Fase 2) e la Collisione (Fase 3).
 */
export function buildStage4LoopPrompt(
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic,
  phase2EmpiricalArchive: any,
  phase3Collision: any,
  batch: 'part1' | 'part2' | 'all' = 'all'
): string {
  const empA = phase2EmpiricalArchive?.vectorA || {};
  const empB = phase2EmpiricalArchive?.vectorB || {};
  const empSynthesis = phase2EmpiricalArchive?.crossArchiveSynthesis || '';
  const col = phase3Collision || {};

  const trackSchema = (
    dirNum: number,
    dirTitle: string,
    drawerLabel: string,
    evidenceHint: string,
    verbHint: string
  ) => `      {
        "directionNumber": ${dirNum},
        "directionTitle": "${dirTitle}",
        "empiricalDrawerLabel": "${drawerLabel}",
        "empiricalEvidenceExamined": "string (${evidenceHint})",
        "ontologicalAngle": "string (4-5 frasi narrative, limpide e approfondite che spiegano l'angolazione di questa direzione con riferimenti in **grassetto** ai reperti di Fase 2)",
        "collision": {
          "step1StrippingFunction": {
            "fundamentalVerbA": "VERBO SPECIFICO ${verbHint} A (in MAIUSCOLO)",
            "abstractFunctionA": "string (4-5 frasi narrative, chiare e approfondite che raccontano come opera concretamente il primo fenomeno in questo cassetto, con riferimenti di Fase 2 in **grassetto**)",
            "fundamentalVerbB": "VERBO SPECIFICO ${verbHint} B (in MAIUSCOLO)",
            "abstractFunctionB": "string (4-5 frasi narrative, chiare e approfondite che raccontano come opera concretamente il secondo fenomeno in questo cassetto, con riferimenti di Fase 2 in **grassetto**)",
            "functionalSynthesis": "string (VIETATO scrivere uno slogan di 1 riga! Scrivi 5-6 frasi narrative e scorrevoli divise in 2 capoversi con \\n\\n che spiegano nel dettaglio cosa accade quando questi due verbi operano insieme e perché sono complementari, citando i reperti in **grassetto**)"
          },
          "step2BlindAxis": {
            "boundaryA": "string (4-5 frasi narrative e ben argomentate che spiegano dove e perché si arresta lo strumento o il modello del primo argomento, con **grassetti**)",
            "accessDoorToB": "string (4-5 frasi narrative e ben argomentate che raccontano come proprio quel limite apra il varco verso il secondo argomento, con **grassetti**)",
            "creviceContactPoint": "string (VIETATO scrivere un aforisma breve! Scrivi 5-6 frasi limpide, narrative e profonde divise in 2 capoversi con \\n\\n che raccontano l'anello di congiunzione esatto in cui il limite del primo argomento diventa l'inizio del secondo, con **grassetti**)"
          },
          "step3InvertedDirection": {
            "methodAAppliedToB": "string (4-5 frasi narrative che raccontano nel dettaglio l'esperimento incrociato: cosa succede applicando gli strumenti/metodi di A ai materiali di B, con **grassetti**)",
            "provocativeViolationQuestion": "string (2-3 frasi che formulano un quesito sperimentale chiaro, incisivo e provocatorio con **grassetti**)",
            "counterIntuitiveInsight": "string (VIETATO scrivere una sola frase! Scrivi 5-6 frasi narrative e comprensibili divise in 2 capoversi con \\n\\n che rispondono al quesito e spiegano passo dopo passo quale scoperta inattesa emerge da questo ribaltamento di prospettiva, con **grassetti**)"
          },
          "step4CommonMetaphor": {
            "masterMetaphorTitle": "TITOLO EVOCATIVO DELLA METAFORA IN MAIUSCOLO",
            "cosmologicalAnthropologicalGround": "string (4-5 frasi narrative e profonde che raccontano la radice umana, storica e naturale comune ai due fenomeni)",
            "unifyingVision": "string (4-5 frasi limpide e conclusive che mostrano la visione d'insieme emersa in questa direzione)"
          }
        }
      }`;

  const tracksJsonList: string[] = [];
  if (batch === 'part1' || batch === 'all') {
    tracksJsonList.push(
      trackSchema(
        1,
        'Direzione 1: Prospettiva Termodinamica / Entropica',
        'Cassetto 1 di Fase 2 • Reperti, Strumenti e Frequenze',
        `es. **Strumenti/Frequenze di ${vectorA.name}** × **Strumenti/Frequenze di ${vectorB.name}**`,
        'STRUMENTALE'
      ),
      trackSchema(
        2,
        'Direzione 2: Prospettiva Ecologico-Evolutiva',
        'Cassetto 2 di Fase 2 • Persone, Scienziati e Testimoni',
        `es. **Testimoni/Pionieri di ${vectorA.name}** × **Testimoni/Pionieri di ${vectorB.name}**`,
        'EVOLUTIVO'
      ),
      trackSchema(
        3,
        'Direzione 3: Prospettiva Semiotica / Di Traduzione',
        'Cassetto 3 di Fase 2 • Libri, Dossier e Testi Fondativi',
        `es. **Opere/Dossier di ${vectorA.name}** × **Opere/Dossier di ${vectorB.name}**`,
        'SEMIOTICO'
      )
    );
  }
  if (batch === 'part2' || batch === 'all') {
    tracksJsonList.push(
      trackSchema(
        4,
        'Direzione 4: Prospettiva Metamorfica / Biologica',
        'Cassetto 4 di Fase 2 • Corpo, Tessuti e Materia Vivente',
        `es. **Biomarcatori/Soglie Biologiche di ${vectorA.name}** × **Fisiologia/Neurobiologia di ${vectorB.name}**`,
        'BIOLOGICO'
      ),
      trackSchema(
        5,
        'Direzione 5: Prospettiva Architetturale / Sistemica',
        'Cassetto 5 di Fase 2 • Paradigmi, Teoremi ed Equazioni',
        `es. **Teorie/Modelli di ${vectorA.name}** × **Teorie/Modelli di ${vectorB.name}**`,
        'ARCHITETTURALE'
      )
    );
  }

  const batchHeader =
    batch === 'part1'
      ? 'Il tuo compito in questa chiamata è sviluppare con la MASSIMA PROFONDITÀ NARRATIVA le DIREZIONI 1, 2 e 3 della FASE 4 (Loop a 5 Direzioni).'
      : batch === 'part2'
      ? 'Il tuo compito in questa chiamata è sviluppare con la MASSIMA PROFONDITÀ NARRATIVA le DIREZIONI 4 e 5 della FASE 4 (Loop a 5 Direzioni).'
      : 'Il tuo compito è sviluppare integralmente le 5 DIREZIONI della FASE 4 (Loop a 5 Direzioni).';

  return `SEI IL MOTORE DEL LOOP COGNITIVO A 5 DIREZIONI DI ALKIMIA (FASE 4).
${batchHeader}

================================================================================
INVENTARIO INTEGRALE PER CASSETTI DELLA FASE 2 (ARCHIVIO EMPIRICO):

[CASSETTO 1 — STRUMENTI, FREQUENZE E REPERTI MATERIALI (materialEvidenceAndTools)]
- ${vectorA.name}: ${empA.materialEvidenceAndTools || ''}
- ${vectorB.name}: ${empB.materialEvidenceAndTools || ''}

[CASSETTO 2 — PERSONE, SCIENZIATI, CLINICI E TESTIMONI (keyFiguresAndWitnesses)]
- ${vectorA.name}: ${empA.keyFiguresAndWitnesses || ''}
- ${vectorB.name}: ${empB.keyFiguresAndWitnesses || ''}

[CASSETTO 3 — SUPPORTI, LIBRI E DOSSIER FONDATIVI (foundationalTexts)]
- ${vectorA.name}: ${empA.foundationalTexts || ''}
- ${vectorB.name}: ${empB.foundationalTexts || ''}

[CASSETTO 4 — CORPO, BIOLOGIA E SOGLIE SOMATICHE (Dati biologici/fisiologici/chimici dai Reperti e Testimoni)]
- ${vectorA.name}: ${empA.materialEvidenceAndTools || ''} | ${empA.keyFiguresAndWitnesses || ''}
- ${vectorB.name}: ${empB.materialEvidenceAndTools || ''} | ${empB.keyFiguresAndWitnesses || ''}

[CASSETTO 5 — PARADIGMI, TEOREMI ED EQUAZIONI DI SVOLTA (breakthroughTheories + Sintesi)]
- ${vectorA.name}: ${empA.breakthroughTheories || ''}
- ${vectorB.name}: ${empB.breakthroughTheories || ''}
- Sintesi d'Incrocio: ${empSynthesis}

COLLISIONE MADRE DI FASE 3 (DA NON RIPETERE NEI VERBI):
- Verbi già usati in Fase 3 (VIETATO riusarli identici!): ${col.step1StrippingFunction?.fundamentalVerbA || ''} × ${col.step1StrippingFunction?.fundamentalVerbB || ''}
- Crepa sull'Asse Cieco: ${col.step2BlindAxis?.creviceContactPoint || ''}
- Metafora Madre: ${col.step4CommonMetaphor?.masterMetaphorTitle || ''}
================================================================================

RIPARTIZIONE OBBLIGATORIA "CASSETTO DI FASE 2 ⟶ LENTE DI FASE 4":
1. Direzione 1 (Termodinamica / Entropica) ⟵ SMONTA IL CASSETTO 1 (STRUMENTI E FREQUENZE di Fase 2):
   - Confronta in modo chiaro e narrativo il consumo energetico, il rumore termico e la dispersione del segnale dello strumento del 1° argomento con l'ordine e la coerenza misurata dallo strumento del 2° argomento.
2. Direzione 2 (Ecologico-Evolutiva) ⟵ SMONTA IL CASSETTO 2 (PERSONE, SCIENZIATI E TESTIMONI di Fase 2):
   - Non parla più di sensori, ma degli esseri umani e delle comunità censite in Fase 2. Racconta come i testimoni oculari, i clinici e i pionieri della Fase 2 cerchino di interpretare e reggere l'incontro con l'ignoto.
3. Direzione 3 (Semiotica / Di Traduzione) ⟵ SMONTA IL CASSETTO 3 (LIBRI, DOSSIER E TESTI FONDATIVI di Fase 2):
   - Prende per nome, autore e data i testi scritti, i codici e i verbali ufficiali della Fase 2 e racconta come tentino di tradurre in linguaggio umano un fenomeno che sfugge alle parole ordinarie.
4. Direzione 4 (Metamorfica / Biologica) ⟵ SMONTA IL CASSETTO 4 (IL CORPO E LA MATERIA VIVENTE nei Reperti di Fase 2):
   - Racconta in modo comprensibile e concreto cosa succede al corpo, alle sinapsi, alle cellule e ai parametri fisiologici quando i due domini si incontrano e l'osservatore stesso diventa lo strumento di rilevazione.
5. Direzione 5 (Architetturale / Sistemica) ⟵ SMONTA IL CASSETTO 5 (PARADIGMI, TEOREMI ED EQUAZIONI di Fase 2):
   - Mette a confronto diretto i modelli teorici, i teoremi e le equazioni (con formulatore e data) dei due argomenti per spiegare con limpidezza perché il primo modello descrive un livello della realtà e il secondo ne illumina il livello successivo.

REGOLE TASSATIVE DI AMPIEZZA NARRATIVA E CHIAREZZA (VIETATO ESSERE SINTETICI!):
- REGOLA 1 (Ampiezza di 4-5 Frasi per Ogni Singolo Campo): È SEVERAMENTE VIETATO scrivere frasi brevi, telegrafiche o riassuntive di 1-2 righe! Ogni singola sezione (Verbi Specifici del Cassetto, Punto di Contatto, Inversione Operativa, Simbolo Archetipale) deve essere un racconto argomentato, ricco, scorrevole e comprensibile di ALMENO 4-5 FRASI COMPLETE (circa 80-110 parole per ciascun sotto-campo!).
- REGOLA 2 (Stile Narrativo e Comprensibile): Evita il gergo astruso o criptico; spiega sempre al lettore il *perché* e il *come* dei fenomeni con una prosa limpida, colta e naturale, mettendo in **grassetto** i nomi propri, le date, i libri e gli strumenti presi dal rispettivo cassetto di Fase 2.
- REGOLA 3 (Coppie di Verbi Diverse): Ogni Direzione deve estrarre una coppia di verbi all'infinito in MAIUSCOLO NUOVA E SPECIFICA legata al cassetto di Fase 2 che sta esaminando.

Rispondi RIGOROSAMENTE con questo JSON:
{
  "phase2Loop": {
    "tracks": [
${tracksJsonList.join(',\n')}
    ]
  }
}`;
}

/**
 * STADIO 5 — Prompt dedicato per FASE 5: L'AFFONDO FINALE (Il Sigillo della Ricerca).
 * Riceve in ingresso i risultati del Loop di Fase 4, della Collisione di Fase 3 e dell'Archivio di Fase 2.
 */
export function buildStage5FinalStrikePrompt(
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic,
  phase2EmpiricalArchive: any,
  phase3Collision: any,
  phase4Loop: any,
  batch: 'part1' | 'part2' | 'all' = 'all'
): string {
  const empA = phase2EmpiricalArchive?.vectorA || {};
  const empB = phase2EmpiricalArchive?.vectorB || {};
  const empSynthesis = phase2EmpiricalArchive?.crossArchiveSynthesis || '';

  const tracksSummary = Array.isArray(phase4Loop?.tracks)
    ? phase4Loop.tracks
        .map(
          (t: any) =>
            `- ${t.directionTitle} [${t.empiricalDrawerLabel || ''}]: Reperti: ${t.empiricalEvidenceExamined || ''} | Angolo: ${t.ontologicalAngle || ''} | Punto di contatto: ${t.collision?.step2BlindAxis?.creviceContactPoint || ''} | Esperimento: ${t.collision?.step3InvertedDirection?.methodAAppliedToB || ''} | Intuizione: ${t.collision?.step3InvertedDirection?.counterIntuitiveInsight || ''} | Metafora: ${t.collision?.step4CommonMetaphor?.masterMetaphorTitle || ''}`
        )
        .join('\n')
    : '';

  const part1Instructions = `1. cuiProdest (Cosa cambia nella nostra comprensione — 8-10 frasi limpide in 2-3 capoversi separati da \\n\\n):
   - Spiega in modo chiaro e discorsivo quale vecchia abitudine mentale ci faceva tenere separati «${vectorA.name}» e «${vectorB.name}».
   - Racconta come le vicende storiche, i libri e le osservazioni dei protagonisti citati nella Fase 2 (in **grassetto**) acquistano improvvisamente un significato molto più chiaro, logico e concreto quando li leggiamo gli uni accanto agli altri invece di isolarli.

2. groundbreakingDiscovery (Il filo invisibile che unisce i due fenomeni — 8-10 frasi limpide in 2-3 capoversi separati da \\n\\n):
   - Spiega con parole chiare e appassionate qual è il meccanismo concreto — fisico, biologico o umano — che accomuna «${vectorA.name}» e «${vectorB.name}».
   - Accompagna il lettore a capire *come* e *perché* i due fenomeni obbediscono alla stessa regola di fondo, collegando in modo comprensibile i modelli teorici, i processi del corpo e i dati emersi tra la Fase 2 e la Fase 4 (con i riferimenti chiave in **grassetto**).

3. uninvestigatedBias (Perché finora nessuno aveva unito i puntini — 8-10 frasi limpide in 2-3 capoversi separati da \\n\\n):
   - Racconta con semplicità perché chi studia «${vectorA.name}» e chi indaga «${vectorB.name}» non si sono mai accorti di osservare due lati dello stesso processo.
   - Mostra concretamente come gli strumenti e i metodi del primo campo (in **grassetto**) siano stati calibrati per scartare come semplice disturbo proprio quei segnali sottili che gli studiosi del secondo campo cercavano invece di cogliere senza avere gli strumenti adatti.`;

  const part2Instructions = `4. researchFocusIntersection (La prova sul campo: come verificarlo concretamente — 8-10 frasi limpide in 2-3 capoversi separati da \\n\\n):
   - Descrivi in modo narrativo e visivo un esperimento concreto e realizzabile (o un protocollo di osservazione/indagine adatto alla natura dei due argomenti) che permetta di mettere alla prova questa connessione.
   - Racconta passo dopo passo cosa accadrebbe se incrociassimo gli **strumenti, i testi e i protocolli di misura** della Fase 2 per osservare dal vivo il fenomeno, spiegando con chiarezza cosa misureremmo e quale risultato preciso dovremmo aspettarci di vedere.

5. dizzyingRevelation (Lo sguardo d'insieme: verso il Saggio del Giorno — 8-10 frasi limpide in 2-3 capoversi separati da \\n\\n):
   - Chiudi l'indagine con una riflessione ampia, limpida e suggestiva che raccoglie il senso umano e filosofico dell'intero percorso compiuto dalla Fase 1 alla Fase 4.
   - Parti dall'episodio o dal reperto più significativo della Fase 2 e dalla **Metafora Comune** della Fase 3 per lasciare al lettore una visione d'insieme nitida e profonda, che apre naturalmente la strada al Saggio del Giorno (Fase 6).`;

  const selectedInstructions =
    batch === 'part1'
      ? part1Instructions
      : batch === 'part2'
      ? part2Instructions
      : `${part1Instructions}\n\n${part2Instructions}`;

  const jsonFields =
    batch === 'part1'
      ? `    "cuiProdest": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, senza gergo forzato, con protagonisti e opere di Fase 2 in **grassetto**)",
    "groundbreakingDiscovery": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, che spiegano con chiarezza il legame profondo tra i due fenomeni con riferimenti di Fase 2 in **grassetto**)",
    "uninvestigatedBias": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, che spiegano perché finora i due mondi non si erano parlati, con strumenti e autori di Fase 2 in **grassetto**)"`
      : batch === 'part2'
      ? `    "researchFocusIntersection": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, che raccontano l'esperimento concreto sul campo con gli strumenti di Fase 2 in **grassetto**)",
    "dizzyingRevelation": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, che offrono lo sguardo d'insieme finale verso il Saggio di Fase 6)"`
      : `    "cuiProdest": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, senza gergo forzato, con protagonisti e opere di Fase 2 in **grassetto**)",
    "groundbreakingDiscovery": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, che spiegano con chiarezza il legame profondo tra i due fenomeni con riferimenti di Fase 2 in **grassetto**)",
    "uninvestigatedBias": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, che spiegano perché finora i due mondi non si erano parlati, con strumenti e autori di Fase 2 in **grassetto**)",
    "researchFocusIntersection": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, che raccontano l'esperimento concreto sul campo con gli strumenti di Fase 2 in **grassetto**)",
    "dizzyingRevelation": "string (8-10 frasi narrative e limpide in 2-3 capoversi separati da \\n\\n, che offrono lo sguardo d'insieme finale verso il Saggio di Fase 6)"`;

  return `SEI IL NARRATORE SCIENTIFICO E FILOSOFICO DI ALKIMIA (FASE 5: L'AFFONDO FINALE — SINTESI GENERALE DELL'INDAGINE).
Il tuo compito è tirare le fila dell'Archivio Empirico (FASE 2), della Collisione (FASE 3) e delle 5 Direzioni del Loop (FASE 4) tra «${vectorA.name}» e «${vectorB.name}» in una SINTESI NARRATIVA CHIARA, SCORREVOLE E PROFONDAMENTE COMPRENSIBILE.

================================================================================
MATERIALE DELL'INDAGINE DA RACCONTARE E UNIFICARE NELLA SINTESI:

[CASSETTO 1 — STRUMENTI, FREQUENZE E MISURAZIONI]
- ${vectorA.name}: ${empA.materialEvidenceAndTools || ''}
- ${vectorB.name}: ${empB.materialEvidenceAndTools || ''}

[CASSETTO 2 — PERSONE, SCIENZIATI, CLINICI E TESTIMONI]
- ${vectorA.name}: ${empA.keyFiguresAndWitnesses || ''}
- ${vectorB.name}: ${empB.keyFiguresAndWitnesses || ''}

[CASSETTO 3 — LIBRI, DOSSIER E TESTI FONDATIVI]
- ${vectorA.name}: ${empA.foundationalTexts || ''}
- ${vectorB.name}: ${empB.foundationalTexts || ''}

[CASSETTO 4 — CORPO, TESSUTI E ESPERIENZA UMANA]
- ${vectorA.name}: ${empA.materialEvidenceAndTools || ''} | ${empA.keyFiguresAndWitnesses || ''}
- ${vectorB.name}: ${empB.materialEvidenceAndTools || ''} | ${empB.keyFiguresAndWitnesses || ''}

[CASSETTO 5 — PARADIGMI, TEOREMI E MODELLI INTERPRETATIVI]
- ${vectorA.name}: ${empA.breakthroughTheories || ''}
- ${vectorB.name}: ${empB.breakthroughTheories || ''}
- Sintesi d'Incrocio: ${empSynthesis}

SCOPERTE EMERSE IN FASE 3 (LA COLLISIONE):
- Gesti operativi: ${phase3Collision?.step1StrippingFunction?.fundamentalVerbA || ''} × ${phase3Collision?.step1StrippingFunction?.fundamentalVerbB || ''}
- Punto di contatto sul limite strumentale: ${phase3Collision?.step2BlindAxis?.creviceContactPoint || ''}
- Esperimento incrociato: ${phase3Collision?.step3InvertedDirection?.methodAAppliedToB || ''}
- Metafora Comune: ${phase3Collision?.step4CommonMetaphor?.masterMetaphorTitle || ''} — ${phase3Collision?.step4CommonMetaphor?.unifyingVision || ''}

SCOPERTE EMERSE NELLE 5 DIREZIONI DI FASE 4:
${tracksSummary}
================================================================================

REGOLE TASSATIVE DI CHIAREZZA NARRATIVA E LINGUAGGIO PER LA FASE 5:
- SCRIVI PER FAR CAPIRE DAVVERO IL SENSO GENERALE AL LETTORE: usa una prosa narrativa, limpida, avvincente e naturale (alta divulgazione d'autore). Chi legge deve comprendere immediatamente *perché* questi due argomenti si illuminano a vicenda e *qual è* il ragionamento concreto che li lega.
- PAROLE ED ESPRESSIONI SEVERAMENTE VIETATE: è proibito usare espressioni burocratiche, tribunalesche o da proclama ideologico come "viene scardinato", "viene smantellato", "vengono legittimati", "dogma", "monopolio interpretativo", "cecità incrociata", "recinto disciplinare", "isomorfismo", "epifenomenismo", "Vettore A", "Vettore B".
- Non inventare nomi astrusi di "Teoremi" artificiali: spiega invece i concetti e i meccanismi reali con parole limpide, concrete e ben argomentate.
- AMPIEZZA E STRUTTURA: ciascun punto richiesto deve essere un vero racconto ragionato di 8-10 frasi complete (circa 160-220 parole), suddiviso in 2 o 3 capoversi separati da "\\n\\n" per una lettura piacevole e ariosa.
- Cita in **grassetto** i nomi reali degli scienziati, i testimoni, i libri, le date e gli strumenti della Fase 2 inserendoli con naturalezza dentro la spiegazione narrativa:

${selectedInstructions}

Rispondi RIGOROSAMENTE con questo JSON:
{
  "phase3FinalStrike": {
${jsonFields}
  }
}`;
}
