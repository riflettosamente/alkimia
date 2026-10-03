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

1.5 FASE 1.5: L'ARCHIVIO FENOMENICO E MATERIALE (I Fatti Concreti, le Opere, i Testimoni e i Reperti)
   Censisci per ciascun argomento la massa critica reale di dati, fatti e fonti. 
   REGOLA TASSATIVA PER LA FASE 1.5:
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

2. FASE 2: LA COLLISIONE FONDAMENTALE (I 4 Passaggi di Attrito Radicati nell'Archivio Empirico di Fase 1.5)
   REGOLA TASSATIVA: La collisione non deve essere un esercizio filosofico astratto. Deve far collidere i protocolli tecnici, gli strumenti di rilevazione (radar, spettrometri, tracciati EEG, campioni) e le testimonianze storiche censite nella FASE 1.5:
   - step1StrippingFunction: Trapianto di Funzione (Dai concetti ai gesti tecnici)
     * Isola il singolo verbo ontologico fondante all'infinito per ciascun argomento, estraendolo direttamente dal gesto operativo, dallo strumento tecnico o dal metodo di lavoro documentato nella Fase 1.5.
     * Spiega le rispettive funzioni astratte radicate nelle tecnologie e pratiche dei due argomenti in 2 frasi ciascuna.
     * Formula una sintesi funzionale d'attrito in 2-3 frasi dense.
   - step2BlindAxis: Asse Cieco (L'Impotenza e il Vicolo Cieco dello Strumento di Misura)
     * Articola il limite o confine invalicabile del primo argomento come limite fisico, di frequenza o di risoluzione del suo strumento materiale censito in Fase 1.5 (2-3 frasi).
     * Spiega come il vicolo cieco e l'impotenza di tale apparato strumentale diventi la porta d'accesso e la condizione di necessità per accogliere il secondo argomento (2-3 frasi).
     * Individua il punto esatto di frattura sulla crepa ontologica tra i due apparati empirici (2-3 frasi).
   - step3InvertedDirection: Inversione di Dominio (L'Esperimento Mentale di Laboratorio Incrociato)
     * Prendi lo strumento tecnologico o il protocollo di rilevazione reale del primo argomento censito in Fase 1.5 (es. radar a scansione di fase, spettrometro di massa, sequencing genomico, interferometro) e applicalo brutalmente al fenomeno o al soggetto del secondo (2-3 frasi).
     * Formula una domanda provocatoria di rottura incentrata su questo esperimento incrociato di laboratorio.
     * Sviluppa un'intuizione controintuitiva che sovverte il paradigma ordinario (2-3 frasi).
   - step4CommonMetaphor: Metafora Comune e Reperto Unificante
     * Titolo evocativo della metafora generatrice radicata nei supporti materiali dell'uomo (tracciati, memorie magnetiche, cristalli di silicio, monumenti o circuiti risonanti).
     * Esplicita la radice cosmologica e antropologica profonda che unisce i due reperti (2-3 frasi).
     * Formula la visione unificante a livello sistemico (2-3 frasi).

3. FASE 3: IL LOOP COGNITIVO A 5 PROSPETTIVE (La Collisione Interrogata Sotto 5 Lenti Radicate nell'Archivio Empirico di Fase 1.5)
   REGOLA TASSATIVA: Ciascuna delle 5 tracce NON deve essere un esercizio filosofico astratto. Deve prendere direttamente in mano gli specifici reperti, strumenti di misura, frequenze, date, testimoni e testi censiti nell'Archivio Empirico di Fase 1.5 e interrogarli attraverso quella specifica lente ontologica:
   - Traccia 1: Termodinamica / Entropica (degrado vs neghentropia informativa, dissipazione e conservazione dell'ordine). Esamina il costo energetico, il rumore termico di fondo e la dispersione del segnale degli apparati di misura (es. sensori, radar o frequenze) rispetto ai picchi di ordine neghentropico (es. risonanze biologiche o tracciati stabili censiti in Fase 1.5).
   - Traccia 2: Ecologico-Evolutiva (confine individuo/specie, interfaccia mnestica, co-evoluzione simbiotica). Esamina i dossier storici, le commissioni d'inchiesta, gli studi clinici e le comunità di testimoni censiti in Fase 1.5 come membrane immunitarie e strategie di adattamento della specie per metabolizzare l'anomalia empirica senza collasso sistemico.
   - Traccia 3: Semiotica / Di Traduzione (segnale sorgente primario, filtri ermeneutici e decodifica del reale). Esamina i libri fondativi, le scale di misura e i protocolli formali della Fase 1.5 trattandoli come dizionari di cifratura/decifratura; indaga la distanza incolmabile tra il segnale telemetrico grezzo e la lingua simbolica umana.
   - Traccia 4: Metamorfica / Biologica (soglia di fase, mutazione organica, plasticità della materia vivente). Esamina le alterazioni fisiologiche, biologiche e le transizioni di fase della materia documentate nei referti, campioni e testimonianze di Fase 1.5 (soglie critiche cellulari, tessuti, risonanze sinaptiche).
   - Traccia 5: Architetturale / Sistemica (struttura a strati del reale, limiti di risoluzione e calcolo cosmico). Esamina la risoluzione massima, banda passante e limiti computazionali degli apparati censiti; dimostra la delimitazione architetturale dello stack del reale (lo strumento al livello N, l'anomalia al livello N+1).
   Per ciascuna traccia sviluppa in modo esaustivo:
   * directionNumber (1-5) e directionTitle esatto
   * ontologicalAngle: densa spiegazione (3-4 frasi) dell'angolazione applicata ai reperti e strumenti empirici di Fase 1.5
   * collision: applica integralmente i 4 step (step1StrippingFunction, step2BlindAxis, step3InvertedDirection, step4CommonMetaphor) costringendoli a operare sui dati e strumenti della Fase 1.5 sotto quella lente specifica.

4. FASE 4: L'AFFONDO FINALE (Manifesto Operativo e Sigillo della Ricerca)
   Formula tesi argomentate e dirompenti per:
   - cuiProdest: Smantellamento del dogma riduzionista ed emancipazione ontologica dell'uomo (2-3 frasi)
   - groundbreakingDiscovery: Principio innovativo unificante emerso dalla sintesi (2-3 frasi)
   - uninvestigatedBias: Pregiudizio metodologico o recinto disciplinare mai esplorato prima (2-3 frasi)
   - researchFocusIntersection: Intersezione interdisciplinare esatta su cui indirizzare la futura sperimentazione (2-3 frasi)
   - dizzyingRevelation: Orizzonte speculativo profondo sull'infrastruttura del cosmo e del vivente (2-3 frasi)
   - directionStrikes: Array delle 5 declinazioni specifiche con gli stessi 5 criteri applicati a ciascuna delle 5 prospettive del Loop.

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
 * Prompt per il PASSO 2: Composizione Letteraria Pura (Fase 5: Saggio del Giorno).
 * Riceve come input il dossier analitico del Passo 1 ed esegue la trasfigurazione letteraria.
 */
export function buildStep2LiteraryEssayPrompt(
  step1Dossier: any,
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic
): string {
  // Estrazione sintetica e densa delle scoperte del Passo 1 da fornire come "appunti di bottega"
  const syntheticVector = step1Dossier?.systemPair?.syntheticVector || `Collisione tra ${vectorA.name} e ${vectorB.name}`;
  const ontologicalMatrix = step1Dossier?.systemPair?.ontologicalMatrix || "Matrice d'Attrito Ontologico";
  
  const vA = step1Dossier?.phase1Decomposition?.vectorA;
  const vB = step1Dossier?.phase1Decomposition?.vectorB;
  const empA = step1Dossier?.phase1EmpiricalArchive?.vectorA;
  const empB = step1Dossier?.phase1EmpiricalArchive?.vectorB;
  const empSynthesis = step1Dossier?.phase1EmpiricalArchive?.crossArchiveSynthesis;
  const p2 = step1Dossier?.phase2Collision;
  const p3 = step1Dossier?.phase3FinalStrike;
  const loopTracks = step1Dossier?.phase2Loop?.tracks || [];

  const loopInsightsSummary = loopTracks.map((t: any) => 
    `• [${t.directionTitle || 'Faglia'}]: ${t.collision?.step4CommonMetaphor?.masterMetaphorTitle || ''} — ${t.collision?.step3InvertedDirection?.counterIntuitiveInsight || t.ontologicalAngle || ''}`
  ).join('\n');

  return `HAI A DISPOSIZIONE QUESTA ANALISI INVESTIGATIVA PRELIMINARE (IL TACCUINO DI LABORATORIO).
IL TUO UNICO COMPITO ORA È COMPORRE IL SAGGIO DEL GIORNO IN PURA PROSA CONTINUA (1.200 - 1.800 PAROLE), TRASFORMANDO QUESTI NUCLEI TEMATICI IN LETTERATURA SPECULATIVA, SENZA ELENCHI E SENZA GERGO ANALITICO.

================================================================================
DOSSIER DI RICERCA (GLI APPUNTI DEL TACCUINO)
================================================================================
VETTORE A: ${vectorA.name}
VETTORE B: ${vectorB.name}
SINTESI D'ATTRITO: ${syntheticVector}
MATRICE ONTOLOGICA: ${ontologicalMatrix}

MASSA CRITICA E REPERTI EMPIRICI CENSITI (ARCHIVIO FENOMENICO):
- Fonti e Opere chiave di A: ${empA?.foundationalTexts || 'Monografie storiche e dossier d\'archivio'}
- Reperti e Strumenti di A: ${empA?.materialEvidenceAndTools || 'Rilevazioni fMRI/EEG e tracciati di laboratorio'}
- Fonti e Opere chiave di B: ${empB?.foundationalTexts || 'Trattati antichi e saggi d\'avanguardia'}
- Reperti e Strumenti di B: ${empB?.materialEvidenceAndTools || 'Anomalie fotogrammetriche e tracciati di frequenza'}
- Convergenza dei reperti: ${empSynthesis || 'Incrocio della massa critica di dati tra i due vettori'}

RADICI FENOMENICHE INDAGATE:
- Vettore A: ${vA?.whichBoundary || vectorA.operationalDefinition} (Traccia latente: ${vA?.whyVeiled || 'Dimensioni non-locali'})
- Vettore B: ${vB?.whichBoundary || vectorB.operationalDefinition} (Traccia latente: ${vB?.whyVeiled || 'Dimensioni non-locali'})

PUNTO DI FUSIONE E METAFORA CARDINE:
- Verbi fondamentali: ${p2?.step1StrippingFunction?.fundamentalVerbA || 'Ordinare'} vs ${p2?.step1StrippingFunction?.fundamentalVerbB || 'Trasdurre'}
- Asse di contatto: ${p2?.step2BlindAxis?.creviceContactPoint || ''}
- Metafora generatrice: ${p2?.step4CommonMetaphor?.masterMetaphorTitle || ''} — ${p2?.step4CommonMetaphor?.unifyingVision || ''}

FAGLIE DEL LOOP COGNITIVO EMERSE:
${loopInsightsSummary || 'Cinque angolazioni di attrito tra entropia, semiotica, metamorfosi e struttura'}

SCOPERTE OPERATIVE E APORIE DA SCIOGLIERE:
- Dogma e paradigma da decostruire: ${p3?.cuiProdest || ''}
- Principio innovativo unificante: ${p3?.groundbreakingDiscovery || ''}
- Pregiudizio metodologico: ${p3?.uninvestigatedBias || ''}
- Intersezione disciplinare d'avanguardia: ${p3?.researchFocusIntersection || ''}
- Orizzonte cosmologico: ${p3?.dizzyingRevelation || ''}

================================================================================
DIRETTIVE DI COMPOSIZIONE LETTERARIA (LA TRASFIGURAZIONE NEL SAGGIO)
================================================================================
Non limitarti a riassumere il taccuino: devi farlo sparire, fondendolo in una grande opera di pensiero continuo.
1. Scegli le 2-3 intuizioni più dirompenti e vertiginose emerse dal loop cognitivo e fanne il filo conduttore dell'argomentazione.
2. Sciogli la tensione iniziale tra ${vectorA.name} e ${vectorB.name} mostrando come non siano due entità distinte, ma manifestazioni complementari della medesima dinamica del reale.
3. Il saggio deve articolarsi in 5 ampi paragrafi narrativi continui, densi, profondi, senza stacchi bruschi:
   - Paragrafo 1: Esordio speculativo e apertura destabilizzante sulla natura fenomenica dei due elementi.
   - Paragrafo 2: Dissoluzione della dicotomia superficiale ed esplorazione fenomenologica della loro soglia comune.
   - Paragrafo 3: L'affondo centrale: sviluppo organico delle intuizioni del loop (senza mai chiamarlo "loop").
   - Paragrafo 4: Decostruzione dei recinti epistemologici correnti, emancipazione ontologica del soggetto conoscente e aperture di ricerca.
   - Paragrafo 5: Chiusura contemplativa di massimo respiro cosmologico sul senso della realtà e la permeabilità dei suoi piani.

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
- Sintassi: nobile, fluida, armoniosa, priva di ridondanze o affettazioni barocche.

================================================================================
NEGATIVE CONSTRAINT LIST (LISTA NERA ASSOLUTA - MAI NEL TESTO)
================================================================================
Nel testo del saggio (titolo, sottotitolo, tesi ontologica, paragrafi) È TASSATIVAMENTE VIETATO:
- NON USARE parole deformate, neologismi spuri o calchi non italiani (es. "regula", "ipotese", "pinealico", "spaziativa")
- NON USARE le formule: "Cui prodest", "Cui prodest?", "A chi giova"
- NON USARE la formula: "La vertigine finale" o "vertigine finale"
- NON USARE formule preconfezionate come: "Stanza del reale", "porte girevoli tra i piani"
- NON USARE etichette procedurali: "Fase 1", "Fase 2", "Fase 3", "Fase 4", "Fase 5", "Passo 1", "Passo 2"
- NON USARE nomi di passaggi: "Loop cognitivo", "5 direzioni", "Asse cieco", "Trapianto di funzione", "When/Where", "What", "How"
- NON USARE elenchi puntati, elenchi numerati, né titoletti o notazioni (§)
- NON USARE formule metanarrative da chatbot ("In questo saggio...", "Analizzeremo ora...")

COMPUTO TOTALE PAROLE: Rigorosamente compreso tra 1.200 e 1.800 parole.

Rispondi RIGOROSAMENTE con questo JSON:
{
  "essay": {
    "title": "string (titolo austero, nobile, evocativo e filosoficamente denso, privo di numeri)",
    "subtitle": "string (sintesi morfologica del saggio)",
    "ontologicalThesis": "string (tesi ontologica apodittica e incontrovertibile incastonata all'esordio del discorso)",
    "narrativeParagraphs": [
      "string (Paragrafo 1: Esordio speculativo e radice fenomenica dei due elementi, minimo 250 parole)",
      "string (Paragrafo 2: Anatomia della soglia e superamento della dicotomia, minimo 250 parole)",
      "string (Paragrafo 3: La collisione profonda e le intuizioni salienti della ricerca, minimo 300 parole)",
      "string (Paragrafo 4: Decostruzione dei paradigmi, emancipazione del soggetto e nuovi orizzonti d'indagine, minimo 250 parole)",
      "string (Paragrafo 5: Orizzonte cosmologico conclusivo e visione unificata della realtà, minimo 250 parole)"
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
 * Prompt dedicato per la compilazione autonoma della FASE 1.5: ARCHIVIO EMPIRICO.
 * Basato esclusivamente sulle fonti e dati concreti emersi dalla ricerca web live a costo zero.
 * Progettato per essere eseguito con Groq a zero token Gemini.
 */
export function buildPhase1_5EmpiricalPrompt(
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic,
  webContextA: string,
  webContextB: string
): string {
  return `SEI IL CUSTODE DELL'ARCHIVIO EMPIRICO E FENOMENICO DI ALKIMIA.
Il tuo compito è compilare la FASE 1.5 (Archivio dei Fatti, delle Opere, dei Testimoni e delle Strumentazioni)
per i due argomenti del giorno, attingendo ai riscontri oggettivi raccolti sul web in tempo reale.

================================================================================
PRIMO ARGOMENTO: ${vectorA.name}
FONTI WEB RACCOLTE IN TEMPO REALE:
${webContextA || 'Nessuna fonte web specifica reperita.'}

SECONDO ARGOMENTO: ${vectorB.name}
FONTI WEB RACCOLTE IN TEMPO REALE:
${webContextB || 'Nessuna fonte web specifica reperita.'}
================================================================================

REGOLA TASSATIVA PER LA FASE 1.5:
1. È SEVERAMENTE VIETATO usare le parole "Vettore A", "Vettore B", "Argomento I", "Argomento II" nel testo!
2. È SEVERAMENTE VIETATO usare formule vaghe come "alcuni scienziati", "studi recenti", "varie monografie".
3. DEVI OBBLIGATORIAMENTE citare NOMI E COGNOMI REALI, DATE ESATTE, TITOLI D'OPERA O DOSSIER TRA VIRGOLETTE, SITI ARCHEOLOGICI O MONUMENTI, NOMI DI STRUMENTI TECNOLOGICI E RILEVATORI SPECIALISTICI.
4. EVIDENZIA OGNI NOME, DATA, TITOLO E STRUMENTO USANDO IL GRASSETTO **termine**!

Rispondi RIGOROSAMENTE con questo JSON:
{
  "phase1EmpiricalArchive": {
    "vectorA": {
      "topicName": "${vectorA.name}",
      "foundationalTexts": "string (titoli di libri, dossier, codici, autori e date esatte in grassetto, 2-3 frasi dense)",
      "keyFiguresAndWitnesses": "string (scienziati, pionieri, testimoni oculari con nome e cognome in grassetto e date, 2-3 frasi)",
      "materialEvidenceAndTools": "string (strumentazioni tecnologiche, frequenze, misurazioni EEG/radar, monumenti in grassetto, 2-3 frasi)",
      "breakthroughTheories": "string (modelli teorici e teoremi con formulatore e data in grassetto, 2-3 frasi)"
    },
    "vectorB": {
      "topicName": "${vectorB.name}",
      "foundationalTexts": "string",
      "keyFiguresAndWitnesses": "string",
      "materialEvidenceAndTools": "string",
      "breakthroughTheories": "string"
    },
    "crossArchiveSynthesis": "string (sintesi dell'incrocio tra la massa critica dei fatti reali dei due argomenti, 2-3 frasi dense)"
  }
}`;
}
