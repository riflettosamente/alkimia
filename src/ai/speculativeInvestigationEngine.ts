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

4. FASE 4: IL LOOP COGNITIVO A 5 PROSPETTIVE (La Collisione Interrogata Sotto 5 Lenti Radicate nell'Archivio Empirico di Fase 2)
   REGOLA TASSATIVA: Ciascuna delle 5 tracce NON deve essere un esercizio filosofico astratto. Deve prendere direttamente in mano gli specifici reperti, strumenti di misura, frequenze, date, testimoni e testi censiti nell'Archivio Empirico di Fase 2 e interrogarli attraverso quella specifica lente ontologica:
   - Traccia 1: Termodinamica / Entropica (degrado vs neghentropia informativa, dissipazione e conservazione dell'ordine). Esamina il costo energetico, il rumore termico di fondo e la dispersione del segnale degli apparati di misura (es. sensori, radar o frequenze) rispetto ai picchi di ordine neghentropico (es. risonanze biologiche o tracciati stabili censiti in Fase 2).
   - Traccia 2: Ecologico-Evolutiva (confine individuo/specie, interfaccia mnestica, co-evoluzione simbiotica). Esamina i dossier storici, le commissioni d'inchiesta, gli studi clinici e le comunità di testimoni censiti in Fase 2 come membrane immunitarie e strategie di adattamento della specie per metabolizzare l'anomalia empirica senza collasso sistemico.
   - Traccia 3: Semiotica / Di Traduzione (segnale sorgente primario, filtri ermeneutici e decodifica del reale). Esamina i libri fondativi, le scale di misura e i protocolli formali della Fase 2 trattandoli come dizionari di cifratura/decifratura; indaga la distanza incolmabile tra il segnale telemetrico grezzo e la lingua simbolica umana.
   - Traccia 4: Metamorfica / Biologica (soglia di fase, mutazione organica, plasticità della materia vivente). Esamina le alterazioni fisiologiche, biologiche e le transizioni di fase della materia documentate nei referti, campioni e testimonianze di Fase 2 (soglie critiche cellulari, tessuti, risonanze sinaptiche).
   - Traccia 5: Architetturale / Sistemica (struttura a strati del reale, limiti di risoluzione e calcolo cosmico). Esamina la risoluzione massima, banda passante e limiti computazionali degli apparati censiti; dimostra la delimitazione architetturale dello stack del reale (lo strumento al livello N, l'anomalia al livello N+1).
   Per ciascuna traccia sviluppa in modo esaustivo:
   * directionNumber (1-5) e directionTitle esatto
   * ontologicalAngle: densa spiegazione (3-4 frasi) dell'angolazione applicata ai reperti e strumenti empirici di Fase 2
   * collision: applica integralmente i 4 step (step1StrippingFunction, step2BlindAxis, step3InvertedDirection, step4CommonMetaphor) costringendoli a operare sui dati e strumenti della Fase 2 sotto quella lente specifica.

5. FASE 5: L'AFFONDO FINALE (Manifesto Operativo e Sigillo della Ricerca)
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
  const col = phase3Collision || {};

  return `SEI IL MOTORE DEL LOOP COGNITIVO A 5 DIREZIONI DI ALKIMIA (FASE 4).
Il tuo compito è sviluppare integralmente la FASE 4 (Loop a 5 Direzioni: Cinque Faglie Ontologiche), costringendo i reperti della FASE 2 (Archivio Empirico) e l'attrito della FASE 3 (La Collisione) a ruotare attraverso 5 lenti ontologiche distinte.

================================================================================
DATI ACQUISITI DALLE FASI PRECEDENTI:
PRIMO ARGOMENTO: ${vectorA.name}
- Strumenti e Reperti (Fase 2): ${empA.materialEvidenceAndTools || ''}
- Opere e Testimoni (Fase 2): ${empA.foundationalTexts || ''} | ${empA.keyFiguresAndWitnesses || ''}

SECONDO ARGOMENTO: ${vectorB.name}
- Strumenti e Reperti (Fase 2): ${empB.materialEvidenceAndTools || ''}
- Opere e Testimoni (Fase 2): ${empB.foundationalTexts || ''} | ${empB.keyFiguresAndWitnesses || ''}

COLLISIONE FONDAMENTALE (Fase 3):
- Verbi estratti: ${col.step1StrippingFunction?.fundamentalVerbA || ''} × ${col.step1StrippingFunction?.fundamentalVerbB || ''}
- Crepa sull'Asse Cieco: ${col.step2BlindAxis?.creviceContactPoint || ''}
- Metafora Comune: ${col.step4CommonMetaphor?.masterMetaphorTitle || ''}
================================================================================

REGOLA TASSATIVA PER LE 5 DIREZIONI DELLA FASE 4:
Non scrivere mai formule generiche o vuote. Ciascuna delle 5 tracce deve interrogare direttamente gli **strumenti**, le **frequenze**, i **testimoni** e i **dossier** della Fase 2 secondo la propria lente:
- Direzione 1: Prospettiva Termodinamica / Entropica (costo energetico, rumore termico dei sensori, dispersione del segnale vs picchi di neghentropia e ordine biologico/informativo).
- Direzione 2: Prospettiva Ecologico-Evolutiva (i dossier, le commissioni e i testimoni di Fase 2 letti come membrane immunitarie e adattamento simbiotico della specie).
- Direzione 3: Prospettiva Semiotica / Di Traduzione (le scale di misura, i tracciati e i libri di Fase 2 come dizionari di cifratura/decifratura tra segnale grezzo e lingua umana).
- Direzione 4: Prospettiva Metamorfica / Biologica (soglie critiche cellulari, tessuti, risonanze sinaptiche e mutazioni fisiologiche dell'osservatore documentate nei referti).
- Direzione 5: Prospettiva Architetturale / Sistemica (limiti di risoluzione, banda passante e campionamento degli strumenti; lo strumento al livello N e il fenomeno al livello N+1 dello stack del reale).

Rispondi RIGOROSAMENTE con questo JSON contenente tutte e 5 le tracce complete:
{
  "phase2Loop": {
    "theoreticalPreamble": "string (introduzione teorica densa di 3-4 frasi sulla quintuplice rotazione applicata agli apparati di Fase 2 e alla collisione di Fase 3)",
    "tracks": [
      {
        "directionNumber": 1,
        "directionTitle": "Direzione 1: Prospettiva Termodinamica / Entropica",
        "ontologicalAngle": "string (3 frasi dense sull'angolazione termodinamica applicata ai reperti di Fase 2)",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "string (singolo verbo)", "abstractFunctionA": "string", "fundamentalVerbB": "string (singolo verbo)", "abstractFunctionB": "string", "functionalSynthesis": "string" },
          "step2BlindAxis": { "boundaryA": "string", "accessDoorToB": "string", "creviceContactPoint": "string" },
          "step3InvertedDirection": { "methodAAppliedToB": "string", "provocativeViolationQuestion": "string", "counterIntuitiveInsight": "string" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "string", "cosmologicalAnthropologicalGround": "string", "unifyingVision": "string" }
        }
      },
      {
        "directionNumber": 2,
        "directionTitle": "Direzione 2: Prospettiva Ecologico-Evolutiva",
        "ontologicalAngle": "string",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "string", "abstractFunctionA": "string", "fundamentalVerbB": "string", "abstractFunctionB": "string", "functionalSynthesis": "string" },
          "step2BlindAxis": { "boundaryA": "string", "accessDoorToB": "string", "creviceContactPoint": "string" },
          "step3InvertedDirection": { "methodAAppliedToB": "string", "provocativeViolationQuestion": "string", "counterIntuitiveInsight": "string" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "string", "cosmologicalAnthropologicalGround": "string", "unifyingVision": "string" }
        }
      },
      {
        "directionNumber": 3,
        "directionTitle": "Direzione 3: Prospettiva Semiotica / Di Traduzione",
        "ontologicalAngle": "string",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "string", "abstractFunctionA": "string", "fundamentalVerbB": "string", "abstractFunctionB": "string", "functionalSynthesis": "string" },
          "step2BlindAxis": { "boundaryA": "string", "accessDoorToB": "string", "creviceContactPoint": "string" },
          "step3InvertedDirection": { "methodAAppliedToB": "string", "provocativeViolationQuestion": "string", "counterIntuitiveInsight": "string" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "string", "cosmologicalAnthropologicalGround": "string", "unifyingVision": "string" }
        }
      },
      {
        "directionNumber": 4,
        "directionTitle": "Direzione 4: Prospettiva Metamorfica / Biologica",
        "ontologicalAngle": "string",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "string", "abstractFunctionA": "string", "fundamentalVerbB": "string", "abstractFunctionB": "string", "functionalSynthesis": "string" },
          "step2BlindAxis": { "boundaryA": "string", "accessDoorToB": "string", "creviceContactPoint": "string" },
          "step3InvertedDirection": { "methodAAppliedToB": "string", "provocativeViolationQuestion": "string", "counterIntuitiveInsight": "string" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "string", "cosmologicalAnthropologicalGround": "string", "unifyingVision": "string" }
        }
      },
      {
        "directionNumber": 5,
        "directionTitle": "Direzione 5: Prospettiva Architetturale / Sistemica",
        "ontologicalAngle": "string",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "string", "abstractFunctionA": "string", "fundamentalVerbB": "string", "abstractFunctionB": "string", "functionalSynthesis": "string" },
          "step2BlindAxis": { "boundaryA": "string", "accessDoorToB": "string", "creviceContactPoint": "string" },
          "step3InvertedDirection": { "methodAAppliedToB": "string", "provocativeViolationQuestion": "string", "counterIntuitiveInsight": "string" },
          "step4CommonMetaphor": { "masterMetaphorTitle": "string", "cosmologicalAnthropologicalGround": "string", "unifyingVision": "string" }
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
  const tracksSummary = Array.isArray(phase4Loop?.tracks)
    ? phase4Loop.tracks
        .map(
          (t: any) =>
            `- ${t.directionTitle}: ${t.ontologicalAngle || ''} | Intuizione: ${t.collision?.step3InvertedDirection?.counterIntuitiveInsight || ''}`
        )
        .join('\n')
    : '';

  return `SEI IL SIGILLO EPISTEMOLOGICO DI ALKIMIA (FASE 5: L'AFFONDO FINALE).
Il tuo compito è trasformare le scoperte emerse nelle Fasi 2, 3 e 4 tra «${vectorA.name}» e «${vectorB.name}» nel Manifesto Operativo dell'Indagine Speculativa (FASE 5).

================================================================================
SINTESI DELLE 5 FAGLIE EMERSE NEL LOOP DI FASE 4:
${tracksSummary}

METAFORA CARDINE DI FASE 3:
${phase3Collision?.step4CommonMetaphor?.masterMetaphorTitle || ''} — ${phase3Collision?.step4CommonMetaphor?.unifyingVision || ''}

CONVERGENZA EMPIRICA DI FASE 2:
${phase2EmpiricalArchive?.crossArchiveSynthesis || ''}
================================================================================

DIRETTIVE PER LA FASE 5:
- È VIETATO usare le espressioni "Vettore A" o "Vettore B".
- Formula tesi argomentate, taglienti e dirompenti (2-3 frasi ciascuna) sia per la sintesi macro generale sia per ciascuna delle 5 direzioni in directionStrikes:
  1. cuiProdest: Quale dogma riduzionista viene smantellato e come ne esce emancipato il soggetto umano.
  2. groundbreakingDiscovery: Qual è il principio innovativo unificante emerso dalla collisione dei reperti.
  3. uninvestigatedBias: Quale pregiudizio metodologico o recinto accademico aveva impedito finora di unire questi due ambiti.
  4. researchFocusIntersection: Su quale esatta intersezione strumentale e sperimentale va indirizzata la futura ricerca.
  5. dizzyingRevelation: Quale orizzonte speculativo vertiginoso si apre sull'infrastruttura del cosmo e del vivente.

Rispondi RIGOROSAMENTE con questo JSON:
{
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
      },
      {
        "directionNumber": 2,
        "directionTitle": "Direzione 2: Prospettiva Ecologico-Evolutiva",
        "ontologicalAngle": "string",
        "cuiProdest": "string",
        "groundbreakingDiscovery": "string",
        "uninvestigatedBias": "string",
        "researchFocusIntersection": "string",
        "dizzyingRevelation": "string"
      },
      {
        "directionNumber": 3,
        "directionTitle": "Direzione 3: Prospettiva Semiotica / Di Traduzione",
        "ontologicalAngle": "string",
        "cuiProdest": "string",
        "groundbreakingDiscovery": "string",
        "uninvestigatedBias": "string",
        "researchFocusIntersection": "string",
        "dizzyingRevelation": "string"
      },
      {
        "directionNumber": 4,
        "directionTitle": "Direzione 4: Prospettiva Metamorfica / Biologica",
        "ontologicalAngle": "string",
        "cuiProdest": "string",
        "groundbreakingDiscovery": "string",
        "uninvestigatedBias": "string",
        "researchFocusIntersection": "string",
        "dizzyingRevelation": "string"
      },
      {
        "directionNumber": 5,
        "directionTitle": "Direzione 5: Prospettiva Architetturale / Sistemica",
        "ontologicalAngle": "string",
        "cuiProdest": "string",
        "groundbreakingDiscovery": "string",
        "uninvestigatedBias": "string",
        "researchFocusIntersection": "string",
        "dizzyingRevelation": "string"
      }
    ]
  }
}`;
}
