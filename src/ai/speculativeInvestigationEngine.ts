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
    "dizzyingRevelation": "string",
    "directionStrikes": [
      {
        "directionNumber": 1,
        "directionTitle": "Direzione 1: Prospettiva Termodinamica / Entropica",
        "ontologicalAngle": "string",
        "cuiProdest": "string",
        "groundbreakingDiscovery": "string",
        "uninvestigatedBias": "string",
        "researchFocusIntersection": "string",
        "dizzyingRevelation": "string"
      }
    ]
  }
}
(Nota per directionStrikes: compila un elemento per ciascuna delle 5 direzioni con gli stessi campi).`;
}

/**
 * /**
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

  const loopInsightsSummary = loopTracks.map((t: any) => 
    `• [${t.directionTitle || 'Faglia'} | Reperti: ${stripMdBold(t.empiricalEvidenceExamined)}]: Angolo: ${stripMdBold(t.ontologicalAngle)} | Esperimento: ${stripMdBold(t.collision?.step3InvertedDirection?.methodAAppliedToB)} | Intuizione: ${stripMdBold(t.collision?.step3InvertedDirection?.counterIntuitiveInsight)} | Metafora: ${stripMdBold(t.collision?.step4CommonMetaphor?.masterMetaphorTitle)}`
  ).join('\n');

  const directionStrikesSummary = Array.isArray(p3?.directionStrikes)
    ? p3.directionStrikes.map((ds: any) =>
        `• [${ds.directionTitle}]: Scoperta: ${stripMdBold(ds.groundbreakingDiscovery)} | Protocollo: ${stripMdBold(ds.researchFocusIntersection)}`
      ).join('\n')
    : '';

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

4. LE 5 FAGLIE DEI CASSETTI (dalla Fase 4):
${loopInsightsSummary}

5. PROTOCOLLO SPERIMENTALE E AFFONDO FINALE (dalla Fase 5):
- Dogma istituzionale infranto: ${stripMdBold(p3?.cuiProdest)}
- Legge unificante: ${stripMdBold(p3?.groundbreakingDiscovery)}
- Cecità incrociata degli specialisti: ${stripMdBold(p3?.uninvestigatedBias)}
- Protocollo di laboratorio prescritto: ${stripMdBold(p3?.researchFocusIntersection)}
- Rivelazione cosmologica: ${stripMdBold(p3?.dizzyingRevelation)}
${directionStrikesSummary}

================================================================================
DIRETTIVE DI COMPOSIZIONE LETTERARIA DEI 5 PARAGRAFI (ZERO GRASSETTI, MASSIMA CONCRETEZZA STORICA E SCIENTIFICA)
================================================================================
Quello che deve sparire nella Fase 6 NON sono i fatti della Fase 2, ma solo l'impalcatura scolastica (i numeri delle fasi, le parole "Cassetto", "Loop", "Asse cieco"). I reperti della Fase 2 (nomi e cognomi di scienziati e testimoni, date esatte, titoli di libri e dossier, nomi di telescopi/radar/EEG, frequenze e teoremi) devono diventare la carne viva del racconto filosofico, incastonati in una prosa purissima degna di Adelphi, Roberto Calasso, Borges o Oliver Sacks.

REGOLA TIPOGRAFICA TASSATIVA PER LA FASE 6:
- NON USARE MAI IL GRASSETTO (**termine**) né asterischi nel titolo, nel sottotitolo, nella tesi o nei 5 paragrafi! La pagina del Saggio deve essere tipograficamente limpida come una pagina di libro.

Struttura il saggio in 5 ampi paragrafi narrativi continui (1.200 - 1.800 parole complessive):
- Paragrafo 1 — L'Incipit Storico e Fenomenico (Fase 1 + Cassetto Testimoni e Opere di Fase 2):
  Non aprire con generalità astratte ("Fin dall'antichità l'uomo..."), ma entra in medias res mettendo in scena due episodi storici, due date esatte, due testimoni o due testi reali della Fase 2 (citandoli per nome e anno senza grassetti), mostrando subito la vertigine del loro accostamento.
- Paragrafo 2 — L'Anatomia degli Strumenti e la Soglia Cieca (Cassetto Strumenti di Fase 2 + Fase 3 La Collisione):
  Porta il lettore dentro i laboratori; nomina gli strumenti reali, i rilevatori e le frequenze della Fase 2 e racconta in prosa letteraria l'impotenza dello strumento di misura e l'esperimento incrociato scoperti nella Fase 3 (dove la macchina fisica si arresta e si apre il varco del secondo fenomeno).
- Paragrafo 3 — L'Attraversamento delle Faglie: Materia, Lingua, Corpo e Sistema (Fase 4 Il Loop dei 5 Cassetti):
  Il cuore speculativo centrale del saggio; intreccia in un unico flusso narrativo le scoperte emerse smontando i 5 Cassetti nella Fase 4 (il rumore termico dei sensori, la reazione immunitaria dei testimoni e delle commissioni, l'intraducibilità dei dossier e dei libri, la mutazione fisiologica del corpo dell'osservatore e l'architettura dei teoremi), citando i nomi reali ma senza mai usare le parole "Loop", "Cassetto" o "Direzione".
- Paragrafo 4 — La Frattura del Dogma e il Nuovo Orizzonte Sperimentale (Fase 5 L'Affondo Finale):
  Trasforma in prosa civile ed epistemologica il crollo del dogma, la cecità incrociata tra gli specialisti e il protocollo sperimentale di laboratorio della Fase 5, citando per nome i modelli teorici, i formulatori e gli apparati che la nuova scienza dovrà incrociare.
- Paragrafo 5 — Il Sigillo Cosmologico e la Metafora Madre (La Chiusura Contemplativa):
  Riprende la Metafora Comune nata in Fase 3 e la porta al massimo respiro filosofico e poetico, chiudendo il cerchio aperto con gli episodi storici del primo paragrafo.

================================================================================
REGOLA FONDAMENTALE DI PUREZZA LESSICALE (LINGUA ITALIANA IMPECCABILE)
================================================================================
- Scrivi esclusivamente in ITALIANO LETTERARIO MODERNO, COLTO, NATURALE E SCORREVOLE.
- È SEVERAMENTE VIETATO inventare vocaboli, alterare suffissi o desinenze, mescolare radici spagnole/francesi/latine, o usare calchi anglofoni sgrammaticati.
- ESEMPI DI ERRORI GRAVI E ASSOLUTAMENTE PROIBITI:
  * NON SCRIVERE "regula" (scrivi: "regola" o "canone" o "costante");
  * NON SCRIVERE "ipotese" (scrivi: "ipotesi");
  * NON SCRIVERE "pinealico" (scrivi: "pineale");
  * NON SCRIVERE "spaziativa" o "località spaziativa" (scrivi: "estensione spaziale" o "coordinate dello spazio");
  * NON SCRIVERE "piante cerebrale" (scrivi: "architettura neurale" o "struttura encefalica");
  * NON SCRIVERE storpiature fonetiche o calchi grezzi.
- Ogni singola parola adoperata deve essere un lemma autentico e attestato nei dizionari autorevoli della lingua italiana (Treccani, Zingarelli, Devoto-Oli).

================================================================================
NEGATIVE CONSTRAINT LIST (LISTA NERA ASSOLUTA - MAI NEL TESTO)
================================================================================
Nel testo del saggio (titolo, sottotitolo, tesi ontologica, paragrafi) È TASSATIVAMENTE VIETATO:
- NON USARE asterischi o grassetti Markdown (**...**)
- NON USARE parole deformate, neologismi spuri o calchi non italiani (es. "regula", "ipotese", "pinealico", "spaziativa")
- NON USARE le formule: "Cui prodest", "Cui prodest?", "A chi giova"
- NON USARE la formula: "La vertigine finale" o "vertigine finale"
- NON USARE formule preconfezionate come: "Stanza del reale", "porte girevoli tra i piani"
- NON USARE etichette procedurali: "Fase 1", "Fase 2", "Fase 3", "Fase 4", "Fase 5", "Fase 6", "Passo 1", "Passo 2", "Cassetto 1", "Cassetto 2", "Vettore A", "Vettore B"
- NON USARE nomi di passaggi: "Loop cognitivo", "5 direzioni", "Asse cieco", "Trapianto di funzione", "When/Where", "What", "How"
- NON USARE elenchi puntati, elenchi numerati, né titoletti o notazioni (§)
- NON USARE formule metanarrative da chatbot ("In questo saggio...", "Analizzeremo ora...")

COMPUTO TOTALE PAROLE: Rigorosamente compreso tra 1.200 e 1.800 parole.

Rispondi RIGOROSAMENTE con questo JSON:
{
  "essay": {
    "title": "string (titolo austero, nobile, evocativo e filosoficamente denso, privo di numeri e privo di asterischi)",
    "subtitle": "string (sintesi morfologica del saggio, priva di asterischi)",
    "ontologicalThesis": "string (tesi ontologica apodittica e incontrovertibile incastonata all'esordio del discorso, priva di asterischi)",
    "narrativeParagraphs": [
      "string (Paragrafo 1: L'Incipit Storico e Fenomenico con nomi, date e opere reali di Fase 2 ma senza grassetti, minimo 250 parole)",
      "string (Paragrafo 2: L'Anatomia degli Strumenti e la Soglia Cieca con gli strumenti di Fase 2 e l'attrito di Fase 3 senza grassetti, minimo 250 parole)",
      "string (Paragrafo 3: L'Attraversamento delle Faglie: Materia, Lingua, Corpo e Sistema dai 5 Cassetti di Fase 4 senza grassetti, minimo 300 parole)",
      "string (Paragrafo 4: La Frattura del Dogma e il Nuovo Orizzonte Sperimentale dai protocolli e teoremi di Fase 5 senza grassetti, minimo 250 parole)",
      "string (Paragrafo 5: Il Sigillo Cosmologico e la Metafora Madre a chiusura del cerchio senza grassetti, minimo 250 parole)"
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
  phase3Collision: any
): string {
  const empA = phase2EmpiricalArchive?.vectorA || {};
  const empB = phase2EmpiricalArchive?.vectorB || {};
  const empSynthesis = phase2EmpiricalArchive?.crossArchiveSynthesis || '';
  const col = phase3Collision || {};

  return `SEI IL MOTORE DEL LOOP COGNITIVO A 5 DIREZIONI DI ALKIMIA (FASE 4).
Il tuo compito è sviluppare integralmente la FASE 4 (Loop a 5 Direzioni: Cinque Faglie Ontologiche), assegnando a ciascuna delle 5 Direzioni UNO SPECIFICO CASSETTO dell'Archivio Empirico di FASE 2 e sottoponendo quei reperti ai 4 Passaggi di Attrito.

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
- Verbi già usati in Fase 3 (VIETATO riusarli identici in tutte le 5 direzioni!): ${col.step1StrippingFunction?.fundamentalVerbA || ''} × ${col.step1StrippingFunction?.fundamentalVerbB || ''}
- Crepa sull'Asse Cieco: ${col.step2BlindAxis?.creviceContactPoint || ''}
- Metafora Madre: ${col.step4CommonMetaphor?.masterMetaphorTitle || ''}
================================================================================

RIPARTIZIONE OBBLIGATORIA "CASSETTO DI FASE 2 ⟶ LENTE DI FASE 4":
1. Direzione 1 (Termodinamica / Entropica) ⟵ SMONTA IL CASSETTO 1 (STRUMENTI E FREQUENZE di Fase 2):
   - Fa scontrare il consumo energetico, il rumore termico e la dispersione del segnale dello strumento del 1° argomento con l'ordine neghentropico e la coerenza bio-elettrica/fisica misurata dallo strumento del 2° argomento.
2. Direzione 2 (Ecologico-Evolutiva) ⟵ SMONTA IL CASSETTO 2 (PERSONE, SCIENZIATI E TESTIMONI di Fase 2):
   - Non parla più di sensori, ma degli esseri umani e delle comunità censite in Fase 2. Studia i testimoni oculari, i clinici e i pionieri della Fase 2 come "anticorpi", membrane immunitarie o mutazioni adattive con cui la specie umana cerca di reggere l'urto dell'ignoto senza impazzire.
3. Direzione 3 (Semiotica / Di Traduzione) ⟵ SMONTA IL CASSETTO 3 (LIBRI, DOSSIER E TESTI FONDATIVI di Fase 2):
   - Prende per nome, autore e data i testi scritti, i codici e i verbali ufficiali della Fase 2 e li analizza come dizionari di traduzione falliti o parziali tra un segnale che non possiede alfabeto e la lingua umana.
4. Direzione 4 (Metamorfica / Biologica) ⟵ SMONTA IL CASSETTO 4 (IL CORPO E LA MATERIA VIVENTE nei Reperti di Fase 2):
   - Indaga cosa succede alla carne, alle sinapsi, alle cellule e ai biomarcatori quando i due domini collidono: la mutazione fisiologica dell'osservatore trasformato esso stesso nello strumento di rilevazione.
5. Direzione 5 (Architetturale / Sistemica) ⟵ SMONTA IL CASSETTO 5 (PARADIGMI, TEOREMI ED EQUAZIONI di Fase 2):
   - Mette a confronto diretto i modelli matematici, i teoremi e le equazioni (con formulatore e data) dei due argomenti per svelare l'architettura a strati del reale (perché il teorema del 1° argomento si blocca al livello N mentre il modello del 2° argomento descrive il livello N+1).

3 REGOLE TASSATIVE DI STILE E CONTENUTO:
- REGOLA 1 (Reperti in Esame): In ogni direzione compila "empiricalEvidenceExamined" indicando esplicitamente i reperti di Fase 2 messi a confronto (es. "**Strumento/Testo/Autore 1** × **Strumento/Testo/Autore 2**").
- REGOLA 2 (5 Coppie di Verbi Diverse): È SEVERAMENTE VIETATO ripetere gli stessi due verbi in tutte le 5 direzioni! Ogni Direzione deve estrarre una coppia di verbi all'infinito in MAIUSCOLO NUOVA E SPECIFICA legata al cassetto di Fase 2 che sta esaminando (es. verbi strumentali in Dir 1, verbi testimoniali/immunitari in Dir 2, verbi testuali/ermeneutici in Dir 3, verbi somatici/biologici in Dir 4, verbi sistemici/teorici in Dir 5).
- REGOLA 3 (Densità e Grassetti nei 4 Passaggi): VIETATO scrivere frasi mozze di poche parole! Ogni singolo campo dei 4 passaggi (abstractFunctionA, abstractFunctionB, functionalSynthesis, boundaryA, accessDoorToB, creviceContactPoint, methodAAppliedToB, provocativeViolationQuestion, counterIntuitiveInsight, cosmologicalAnthropologicalGround, unifyingVision) deve essere lungo 2-3 frasi complete e DEVE riportare in **grassetto** i nomi propri, le date, i libri e gli strumenti presi dal rispettivo cassetto di Fase 2!

Rispondi RIGOROSAMENTE con questo JSON contenente tutte e 5 le tracce complete:
{
  "phase2Loop": {
    "theoreticalPreamble": "string (introduzione teorica densa di 3-4 frasi sulla ripartizione dei 5 cassetti dell'Archivio Empirico di Fase 2 nelle 5 lenti del Loop, con elementi chiave in **grassetto**)",
    "tracks": [
      {
        "directionNumber": 1,
        "directionTitle": "Direzione 1: Prospettiva Termodinamica / Entropica",
        "empiricalDrawerLabel": "Cassetto 1 di Fase 2 • Reperti, Strumenti e Frequenze",
        "empiricalEvidenceExamined": "string (es. **Strumenti/Frequenze di ${vectorA.name}** × **Strumenti/Frequenze di ${vectorB.name}**)",
        "ontologicalAngle": "string (3 frasi dense con riferimenti in **grassetto** agli strumenti di Fase 2)",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "VERBO SPECIFICO STRUMENTALE A", "abstractFunctionA": "string (2-3 frasi con strumenti di Fase 2 in **grassetto**)", "fundamentalVerbB": "VERBO SPECIFICO STRUMENTALE B", "abstractFunctionB": "string (2-3 frasi con strumenti di Fase 2 in **grassetto**)", "functionalSynthesis": "string (2-3 frasi)" },
          "step2BlindAxis": { "boundaryA": "string (2-3 frasi con **grassetti**)", "accessDoorToB": "string (2-3 frasi con **grassetti**)", "creviceContactPoint": "string (2-3 frasi)" },
          "step3InvertedDirection": { "methodAAppliedToB": "string (2-3 frasi con **grassetti**)", "provocativeViolationQuestion": "string (domanda articolata con **grassetti**)", "counterIntuitiveInsight": "string (2-3 frasi)" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "TITOLO IN MAIUSCOLO", "cosmologicalAnthropologicalGround": "string (2-3 frasi)", "unifyingVision": "string (2-3 frasi)" }
        }
      },
      {
        "directionNumber": 2,
        "directionTitle": "Direzione 2: Prospettiva Ecologico-Evolutiva",
        "empiricalDrawerLabel": "Cassetto 2 di Fase 2 • Persone, Scienziati e Testimoni",
        "empiricalEvidenceExamined": "string (es. **Testimoni/Pionieri di ${vectorA.name}** × **Testimoni/Pionieri di ${vectorB.name}**)",
        "ontologicalAngle": "string (3 frasi dense con nomi dei testimoni e scienziati di Fase 2 in **grassetto**)",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "VERBO SPECIFICO EVOLUTIVO A (diverso da Dir 1)", "abstractFunctionA": "string (2-3 frasi con nomi di Fase 2 in **grassetto**)", "fundamentalVerbB": "VERBO SPECIFICO EVOLUTIVO B (diverso da Dir 1)", "abstractFunctionB": "string (2-3 frasi con nomi di Fase 2 in **grassetto**)", "functionalSynthesis": "string (2-3 frasi)" },
          "step2BlindAxis": { "boundaryA": "string (2-3 frasi con **grassetti**)", "accessDoorToB": "string (2-3 frasi con **grassetti**)", "creviceContactPoint": "string (2-3 frasi)" },
          "step3InvertedDirection": { "methodAAppliedToB": "string (2-3 frasi con **grassetti**)", "provocativeViolationQuestion": "string (domanda articolata con **grassetti**)", "counterIntuitiveInsight": "string (2-3 frasi)" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "TITOLO IN MAIUSCOLO", "cosmologicalAnthropologicalGround": "string (2-3 frasi)", "unifyingVision": "string (2-3 frasi)" }
        }
      },
      {
        "directionNumber": 3,
        "directionTitle": "Direzione 3: Prospettiva Semiotica / Di Traduzione",
        "empiricalDrawerLabel": "Cassetto 3 di Fase 2 • Libri, Dossier e Testi Fondativi",
        "empiricalEvidenceExamined": "string (es. **Opere/Dossier di ${vectorA.name}** × **Opere/Dossier di ${vectorB.name}**)",
        "ontologicalAngle": "string (3 frasi dense con titoli di libri, autori e dossier di Fase 2 in **grassetto**)",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "VERBO SPECIFICO SEMIOTICO A (diverso da Dir 1-2)", "abstractFunctionA": "string (2-3 frasi con titoli e date di Fase 2 in **grassetto**)", "fundamentalVerbB": "VERBO SPECIFICO SEMIOTICO B (diverso da Dir 1-2)", "abstractFunctionB": "string (2-3 frasi con titoli e date di Fase 2 in **grassetto**)", "functionalSynthesis": "string (2-3 frasi)" },
          "step2BlindAxis": { "boundaryA": "string (2-3 frasi con **grassetti**)", "accessDoorToB": "string (2-3 frasi con **grassetti**)", "creviceContactPoint": "string (2-3 frasi)" },
          "step3InvertedDirection": { "methodAAppliedToB": "string (2-3 frasi con **grassetti**)", "provocativeViolationQuestion": "string (domanda articolata con **grassetti**)", "counterIntuitiveInsight": "string (2-3 frasi)" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "TITOLO IN MAIUSCOLO", "cosmologicalAnthropologicalGround": "string (2-3 frasi)", "unifyingVision": "string (2-3 frasi)" }
        }
      },
      {
        "directionNumber": 4,
        "directionTitle": "Direzione 4: Prospettiva Metamorfica / Biologica",
        "empiricalDrawerLabel": "Cassetto 4 di Fase 2 • Corpo, Tessuti e Materia Vivente",
        "empiricalEvidenceExamined": "string (es. **Biomarcatori/Soglie Biologiche di ${vectorA.name}** × **Fisiologia/Neurobiologia di ${vectorB.name}**)",
        "ontologicalAngle": "string (3 frasi dense con riferimenti somatici, cellulari e fisiologici di Fase 2 in **grassetto**)",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "VERBO SPECIFICO BIOLOGICO A (diverso da Dir 1-3)", "abstractFunctionA": "string (2-3 frasi con dati biologici di Fase 2 in **grassetto**)", "fundamentalVerbB": "VERBO SPECIFICO BIOLOGICO B (diverso da Dir 1-3)", "abstractFunctionB": "string (2-3 frasi con dati biologici di Fase 2 in **grassetto**)", "functionalSynthesis": "string (2-3 frasi)" },
          "step2BlindAxis": { "boundaryA": "string (2-3 frasi con **grassetti**)", "accessDoorToB": "string (2-3 frasi con **grassetti**)", "creviceContactPoint": "string (2-3 frasi)" },
          "step3InvertedDirection": { "methodAAppliedToB": "string (2-3 frasi con **grassetti**)", "provocativeViolationQuestion": "string (domanda articolata con **grassetti**)", "counterIntuitiveInsight": "string (2-3 frasi)" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "TITOLO IN MAIUSCOLO", "cosmologicalAnthropologicalGround": "string (2-3 frasi)", "unifyingVision": "string (2-3 frasi)" }
        }
      },
      {
        "directionNumber": 5,
        "directionTitle": "Direzione 5: Prospettiva Architetturale / Sistemica",
        "empiricalDrawerLabel": "Cassetto 5 di Fase 2 • Paradigmi, Teoremi ed Equazioni",
        "empiricalEvidenceExamined": "string (es. **Teorie/Modelli di ${vectorA.name}** × **Teorie/Modelli di ${vectorB.name}**)",
        "ontologicalAngle": "string (3 frasi dense con i teoremi, le equazioni e i formulatori di Fase 2 in **grassetto**)",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "VERBO SPECIFICO ARCHITETTURALE A (diverso da Dir 1-4)", "abstractFunctionA": "string (2-3 frasi con teorie e formulatori di Fase 2 in **grassetto**)", "fundamentalVerbB": "VERBO SPECIFICO ARCHITETTURALE B (diverso da Dir 1-4)", "abstractFunctionB": "string (2-3 frasi con teorie e formulatori di Fase 2 in **grassetto**)", "functionalSynthesis": "string (2-3 frasi)" },
          "step2BlindAxis": { "boundaryA": "string (2-3 frasi con **grassetti**)", "accessDoorToB": "string (2-3 frasi con **grassetti**)", "creviceContactPoint": "string (2-3 frasi)" },
          "step3InvertedDirection": { "methodAAppliedToB": "string (2-3 frasi con **grassetti**)", "provocativeViolationQuestion": "string (domanda articolata con **grassetti**)", "counterIntuitiveInsight": "string (2-3 frasi)" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "TITOLO IN MAIUSCOLO", "cosmologicalAnthropologicalGround": "string (2-3 frasi)", "unifyingVision": "string (2-3 frasi)" }
        }
      }
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
  phase4Loop: any
): string {
  const empA = phase2EmpiricalArchive?.vectorA || {};
  const empB = phase2EmpiricalArchive?.vectorB || {};
  const empSynthesis = phase2EmpiricalArchive?.crossArchiveSynthesis || '';

  const tracksSummary = Array.isArray(phase4Loop?.tracks)
    ? phase4Loop.tracks
        .map(
          (t: any) =>
            `- ${t.directionTitle} [${t.empiricalDrawerLabel || ''}]: Reperti: ${t.empiricalEvidenceExamined || ''} | Angolo: ${t.ontologicalAngle || ''} | Intuizione: ${t.collision?.step3InvertedDirection?.counterIntuitiveInsight || ''}`
        )
        .join('\n')
    : '';

  return `SEI IL SIGILLO EPISTEMOLOGICO E SPERIMENTALE DI ALKIMIA (FASE 5: L'AFFONDO FINALE).
Il tuo compito è trasformare l'Archivio Empirico (FASE 2), la Collisione (FASE 3) e il Loop a 5 Direzioni (FASE 4) tra «${vectorA.name}» e «${vectorB.name}» nel PROTOCOLLO SPERIMENTALE E MANIFESTO OPERATIVO (FASE 5).

================================================================================
INVENTARIO COMPLETO PER CASSETTI DELLA FASE 2 (ARCHIVIO EMPIRICO DA TRASFORMARE IN PROTOCOLLO):

[CASSETTO 1 — STRUMENTI, FREQUENZE E MISURAZIONI (per Direzione 1 Termodinamica)]
- ${vectorA.name}: ${empA.materialEvidenceAndTools || ''}
- ${vectorB.name}: ${empB.materialEvidenceAndTools || ''}

[CASSETTO 2 — PERSONE, SCIENZIATI, CLINICI E TESTIMONI (per Direzione 2 Ecologico-Evolutiva)]
- ${vectorA.name}: ${empA.keyFiguresAndWitnesses || ''}
- ${vectorB.name}: ${empB.keyFiguresAndWitnesses || ''}

[CASSETTO 3 — LIBRI, DOSSIER E TESTI FONDATIVI (per Direzione 3 Semiotica)]
- ${vectorA.name}: ${empA.foundationalTexts || ''}
- ${vectorB.name}: ${empB.foundationalTexts || ''}

[CASSETTO 4 — CORPO, TESSUTI E SOGLIE SOMATICHE (per Direzione 4 Metamorfica/Biologica)]
- ${vectorA.name}: ${empA.materialEvidenceAndTools || ''} | ${empA.keyFiguresAndWitnesses || ''}
- ${vectorB.name}: ${empB.materialEvidenceAndTools || ''} | ${empB.keyFiguresAndWitnesses || ''}

[CASSETTO 5 — PARADIGMI, TEOREMI ED EQUAZIONI (per Direzione 5 Architetturale/Sistemica)]
- ${vectorA.name}: ${empA.breakthroughTheories || ''}
- ${vectorB.name}: ${empB.breakthroughTheories || ''}
- Sintesi d'Incrocio: ${empSynthesis}

METAFORA E INVERSO DI FASE 3:
- Metafora Cardine: ${phase3Collision?.step4CommonMetaphor?.masterMetaphorTitle || ''} — ${phase3Collision?.step4CommonMetaphor?.unifyingVision || ''}
- Esperimento Incrociato: ${phase3Collision?.step3InvertedDirection?.methodAAppliedToB || ''}

RISULTATI DELLE 5 FAGLIE NEL LOOP DI FASE 4:
${tracksSummary}
================================================================================

REGOLE TASSATIVE PER LA FASE 5 (SIA SINTESI MACRO SIA LE 5 SCHEDE DIREZIONALI):
- È SEVERAMENTE VIETATO usare le espressioni "Vettore A" o "Vettore B".
- È SEVERAMENTE VIETATO scrivere frasi filosofiche generiche ("la separazione tra fisica e spiritualità...", "unire scienza e coscienza...").
- DEVI OBBLIGATORIAMENTE citare in **grassetto** i nomi degli scienziati, i testimoni, i libri/dossier, le date, le frequenze e gli strumenti reali della Fase 2 in TUTTI E 5 I PUNTI:

1. cuiProdest (Il Dogma Spezzato nei Testi e nelle Istituzioni di Fase 2):
   - Nomina esplicitamente in **grassetto** quali istituzioni, commissioni, protocolli o paradigmi storici citati nella Fase 2 vengono scardinati e quali testimoni oculari o pionieri della Fase 2 vengono finalmente legittimati (2-3 frasi dense).
2. groundbreakingDiscovery (La Legge Unificante tra i Reperti di Fase 2):
   - Formula il principio innovativo unendo per nome in **grassetto** i teoremi, le equazioni e le misurazioni della Fase 2 (2-3 frasi dense).
3. uninvestigatedBias (La Cecità Incrociata tra gli Specialisti di Fase 2):
   - Spiega perché gli specialisti del 1° argomento (citati in Fase 2) e gli studiosi del 2° argomento (citati in Fase 2) non si sono mai parlati: denuncia l'errore metodologico per cui chi usa il **primo strumento/protocollo di Fase 2** ignora i dati raccolti da chi usa il **secondo strumento/protocollo di Fase 2** (2-3 frasi dense).
4. researchFocusIntersection (Il Protocollo di Laboratorio Reale con gli Strumenti di Fase 2):
   - VIETATO dire genericamente "unire disciplina X e disciplina Y". Prescrivi un ESPERIMENTO CONCRETO DI LABORATORIO che incrocia gli **strumenti reali, le frequenze, i tracciati e i campioni della Fase 2** (2-3 frasi dense con strumenti e parametri in **grassetto**).
5. dizzyingRevelation (L'Orizzonte Ontologico Finale):
   - Parti dal reperto materiale o dall'opera più estrema della Fase 2 (in **grassetto**) per spalancare la visione finale che prepara il terreno al Saggio Letterario di Fase 6 (2-3 frasi dense).

NELLE 5 SCHEDE DIREZIONALI (directionStrikes 1–5):
Ciascuna scheda tira le conclusioni operative sul PROPRIO CASSETTO di Fase 2:
- Direzione 1 (Termodinamica) ⟵ Cassetto 1: Strumenti, Frequenze e Misurazioni di Fase 2.
- Direzione 2 (Ecologico-Evolutiva) ⟵ Cassetto 2: Persone, Scienziati e Testimoni di Fase 2.
- Direzione 3 (Semiotica / Di Traduzione) ⟵ Cassetto 3: Libri, Dossier e Testi Fondativi di Fase 2.
- Direzione 4 (Metamorfica / Biologica) ⟵ Cassetto 4: Corpo, Tessuti e Soglie Somatiche di Fase 2.
- Direzione 5 (Architetturale / Sistemica) ⟵ Cassetto 5: Paradigmi, Teoremi ed Equazioni di Fase 2.

Rispondi RIGOROSAMENTE con questo JSON:
{
  "phase3FinalStrike": {
    "cuiProdest": "string (2-3 frasi dense con istituzioni/testimoni di Fase 2 in **grassetto**)",
    "groundbreakingDiscovery": "string (2-3 frasi dense con teoremi/misurazioni di Fase 2 in **grassetto**)",
    "uninvestigatedBias": "string (2-3 frasi dense sulla cecità incrociata tra i due strumenti/specialisti di Fase 2 in **grassetto**)",
    "researchFocusIntersection": "string (2-3 frasi dense con il protocollo sperimentale di laboratorio tra gli strumenti e frequenze di Fase 2 in **grassetto**)",
    "dizzyingRevelation": "string (2-3 frasi dense ancorate ai reperti più estremi di Fase 2 in **grassetto**)",
    "directionStrikes": [
      {
        "directionNumber": 1,
        "directionTitle": "Direzione 1: Prospettiva Termodinamica / Entropica",
        "empiricalDrawerLabel": "Cassetto 1 di Fase 2 • Strumenti, Frequenze e Misurazioni",
        "empiricalEvidenceExamined": "string (reperti strumentali di Fase 2 in **grassetto**)",
        "ontologicalAngle": "string (2 frasi con riferimenti in **grassetto**)",
        "cuiProdest": "string (2-3 frasi con **grassetti**)",
        "groundbreakingDiscovery": "string (2-3 frasi con **grassetti**)",
        "uninvestigatedBias": "string (2-3 frasi con **grassetti**)",
        "researchFocusIntersection": "string (protocollo sperimentale con gli strumenti del Cassetto 1 in **grassetto**, 2-3 frasi)",
        "dizzyingRevelation": "string (2-3 frasi con **grassetti**)"
      },
      {
        "directionNumber": 2,
        "directionTitle": "Direzione 2: Prospettiva Ecologico-Evolutiva",
        "empiricalDrawerLabel": "Cassetto 2 di Fase 2 • Persone, Scienziati e Testimoni",
        "empiricalEvidenceExamined": "string (testimoni e scienziati di Fase 2 in **grassetto**)",
        "ontologicalAngle": "string (2 frasi con **grassetti**)",
        "cuiProdest": "string (2-3 frasi con **grassetti**)",
        "groundbreakingDiscovery": "string (2-3 frasi con **grassetti**)",
        "uninvestigatedBias": "string (2-3 frasi con **grassetti**)",
        "researchFocusIntersection": "string (protocollo di studio clinico/antropologico sui testimoni del Cassetto 2 in **grassetto**, 2-3 frasi)",
        "dizzyingRevelation": "string (2-3 frasi con **grassetti**)"
      },
      {
        "directionNumber": 3,
        "directionTitle": "Direzione 3: Prospettiva Semiotica / Di Traduzione",
        "empiricalDrawerLabel": "Cassetto 3 di Fase 2 • Libri, Dossier e Testi Fondativi",
        "empiricalEvidenceExamined": "string (opere, libri e dossier di Fase 2 in **grassetto**)",
        "ontologicalAngle": "string (2 frasi con **grassetti**)",
        "cuiProdest": "string (2-3 frasi con **grassetti**)",
        "groundbreakingDiscovery": "string (2-3 frasi con **grassetti**)",
        "uninvestigatedBias": "string (2-3 frasi con **grassetti**)",
        "researchFocusIntersection": "string (protocollo di decodifica comparata sui testi/dossier del Cassetto 3 in **grassetto**, 2-3 frasi)",
        "dizzyingRevelation": "string (2-3 frasi con **grassetti**)"
      },
      {
        "directionNumber": 4,
        "directionTitle": "Direzione 4: Prospettiva Metamorfica / Biologica",
        "empiricalDrawerLabel": "Cassetto 4 di Fase 2 • Corpo, Tessuti e Soglie Somatiche",
        "empiricalEvidenceExamined": "string (biomarcatori, tessuti e parametri fisiologici di Fase 2 in **grassetto**)",
        "ontologicalAngle": "string (2 frasi con **grassetti**)",
        "cuiProdest": "string (2-3 frasi con **grassetti**)",
        "groundbreakingDiscovery": "string (2-3 frasi con **grassetti**)",
        "uninvestigatedBias": "string (2-3 frasi con **grassetti**)",
        "researchFocusIntersection": "string (protocollo bio-fisiologico sui parametri somatici del Cassetto 4 in **grassetto**, 2-3 frasi)",
        "dizzyingRevelation": "string (2-3 frasi con **grassetti**)"
      },
      {
        "directionNumber": 5,
        "directionTitle": "Direzione 5: Prospettiva Architetturale / Sistemica",
        "empiricalDrawerLabel": "Cassetto 5 di Fase 2 • Paradigmi, Teoremi ed Equazioni",
        "empiricalEvidenceExamined": "string (teoremi, equazioni e formulatori di Fase 2 in **grassetto**)",
        "ontologicalAngle": "string (2 frasi con **grassetti**)",
        "cuiProdest": "string (2-3 frasi con **grassetti**)",
        "groundbreakingDiscovery": "string (2-3 frasi con **grassetti**)",
        "uninvestigatedBias": "string (2-3 frasi con **grassetti**)",
        "researchFocusIntersection": "string (protocollo di unificazione formale tra i modelli del Cassetto 5 in **grassetto**, 2-3 frasi)",
        "dizzyingRevelation": "string (2-3 frasi con **grassetti**)"
      }
    ]
  }
}`;
}
