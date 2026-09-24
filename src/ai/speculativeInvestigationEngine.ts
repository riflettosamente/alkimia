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
  vectorB: KeyOntologicalTopic
): string {
  return `SEI IL MOTORE LOGICO D'INDAGINE ANALITICA DI ALKIMIA.
Conduci l'indagine speculativa preparatoria tra i seguenti due vettori ontologici:

================================================================================
VETTORE A: ${vectorA.name}
Definizione Filosofico-Operativa: ${vectorA.operationalDefinition}

VETTORE B: ${vectorB.name}
Definizione Filosofico-Operativa: ${vectorB.operationalDefinition}
================================================================================

Esegui con il massimo rigore le 4 fasi di ricerca preliminare:

1. FASE 1: SCOMPOSIZIONE STRUTTURALE (Coordinate 6W + Il Velato per entrambi i vettori)
   Analizza per Vettore A e Vettore B:
   - whenWhere: Contesto Storico e Spaziale (genesi culturale o trauma d'origine)
   - what: Definizione Scientifica o Fisica oggettiva
   - how: Meccanismo d'Azione o "ferro del mestiere"
   - who: Percezione ed Esperienza Umana (risonanza nella coscienza)
   - whichBoundary: Confine Sfidato tra noto e ignoto
   - whyVeiled: La Traccia e il Velato (l'indicazione di una realtà latente)

2. FASE 2: LA COLLISIONE FONDAMENTALE (I 4 Passaggi di Attrito)
   - step1StrippingFunction: Trapianto di funzione (verbo fondamentale di A e B, sintesi funzionale)
   - step2BlindAxis: Asse Cieco (il limite di A che diviene porta d'accesso a B, punto di frattura)
   - step3InvertedDirection: Inversione di Dominio (metodo di A applicato a B, domanda provocatoria, intuizione controintuitiva)
   - step4CommonMetaphor: Metafora Comune (titolo metafora generatrice, radice cosmologica, visione unificante)

3. FASE 3: IL LOOP COGNITIVO A 5 PROSPETTIVE
   Sviluppa 5 tracce distinte applicando la collisione attraverso 5 lenti ontologiche:
   - Traccia 1: Termodinamica / Entropica (degrado vs neghentropia informativa)
   - Traccia 2: Ecologico-Evolutiva (confine individuo/specie, interfaccia mnestica)
   - Traccia 3: Semiotica / Di Traduzione (segnale sorgente e filtri ermeneutici)
   - Traccia 4: Metamorfica / Biologica (soglia di fase, mutazione organica)
   - Traccia 5: Architetturale / Sistemica (struttura a strati del reale, limiti di computazione)
   Per ciascuna traccia fornisci: directionNumber, directionTitle, ontologicalAngle, e i 4 step di collisione.

4. FASE 4: L'AFFONDO FINALE (Manifesto Operativo e Sigillo della Ricerca)
   Genera:
   - cuiProdest: Smantellamento del dogma riduzionista ed emancipazione ontologica dell'uomo
   - groundbreakingDiscovery: Principio innovativo unificante emerso dalla sintesi
   - uninvestigatedBias: Pregiudizio metodologico o recinto disciplinare mai esplorato
   - researchFocusIntersection: Intersezione interdisciplinare esatta su cui focalizzare le ricerche
   - dizzyingRevelation: Orizzonte speculativo profondo sull'infrastruttura del cosmo
   - directionStrikes: Array delle 5 declinazioni specifiche corrispondenti alle 5 direzioni del Loop.

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
  },
  "phase2Loop": {
    "theoreticalPreamble": "string (introduzione teorica alla quintuplice faglia ontologica)",
    "tracks": [
      {
        "directionNumber": 1,
        "directionTitle": "Direzione 1: Prospettiva Termodinamica / Entropica",
        "ontologicalAngle": "string",
        "collision": {
          "step1StrippingFunction": { "fundamentalVerbA": "string", "abstractFunctionA": "string", "fundamentalVerbB": "string", "abstractFunctionB": "string", "functionalSynthesis": "string" },
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
