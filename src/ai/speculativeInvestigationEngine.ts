/**
 * Motore Logico dell'Indagine Speculativa
 * 
 * Integra nativamente le tre fasi sequenziali che l'intelligenza artificiale
 * deve seguire internamente prima di comporre il testo finale:
 * 
 * 1. FASE 1: La Scomposizione Strutturale (Griglia 6W + Velato) per ciascuno dei due argomenti
 * 2. FASE 2: La Collisione e il Loop Cognitivo (5 Prospettive) per generare l'intuizione radicale
 * 3. FASE 3: L'Affondo e la Sintesi Finale (Saggio Narrativo continuo con Zero Structural Leakage)
 */

import { KeyOntologicalTopic } from './ontologicalSystemPrompt';

export interface VectorDecomposition6W {
  topic: KeyOntologicalTopic;
  whenWhere: string;      // Contesto Storico/Spaziale
  what: string;           // Definizione Scientifica/Fisica
  how: string;            // Meccanismo d'Azione o "Ferro del Mestiere"
  who: string;            // Percezione ed Esperienza Umana
  whichBoundary: string;  // Confine Sfidato
  whyVeiled: string;      // La Traccia e il Velato
}

export interface CognitivePerspectiveCollision {
  perspectiveName: 'Termodinamica / Entropica' | 'Ecologico-Evolutiva' | 'Semiotica / Di Traduzione' | 'Metamorfica / Biologica' | 'Architetturale / Sistemica';
  functionTransplant: string;    // Trapianto di Funzione: verbo fondamentale isolato
  blindAxis: string;             // Asse Cieco: attrito limite-chiave d'accesso
  domainInversion: string;       // Inversione di Dominio: cortocircuito logico
  sharedMetaphor: string;        // Metafora Comune generatrice
  radicalInsight: string;        // Intuizione scaturita
}

export interface FinalThrustSynthesis {
  cuiProdest: string;            // A chi giova: blocco culturale/riduzionista smantellato
  uninvestigatedBorder: string;  // Pregiudizio metodologico o recinto disciplinare mai esplorato
  proposedResearchField: string; // Intersezione interdisciplinare (es. topologia dimensionale, neurofenomenologia)
  realityInfrastructure: string; // Rivelazione finale sull'infrastruttura della realtà
}

export interface CompleteInvestigationPayload {
  systemPair: {
    vectorA: string;
    vectorB: string;
    syntheticVector: string;
    ontologicalMatrix: string;
    derivationTimestamp: string;
  };
  essay: {
    title: string;
    subtitle: string;
    ontologicalThesis: string;
    narrativeParagraphs: string[];
  };
}

/**
 * Compila il prompt sequenziale rigido per forzare il modello a eseguire internamente
 * le 3 Fasi Sequenziali del Motore Logico prima di riversare il saggio.
 */
export function buildSequentialInvestigationPrompt(
  vectorA: KeyOntologicalTopic,
  vectorB: KeyOntologicalTopic
): string {
  return `SEI IL MOTORE LOGICO D'INDAGINE SPECOLATIVA.
Esegui nativamente la procedura a TRE FASI SEQUENZIALI OBBLIGATORIE per i seguenti due vettori ontologici:

================================================================================
VETTORE A: ${vectorA.name}
Definizione Operativa: ${vectorA.operationalDefinition}

VETTORE B: ${vectorB.name}
Definizione Operativa: ${vectorB.operationalDefinition}
================================================================================

FASE 1: LA SCOMPOSIZIONE STRUTTURALE (GRIGLIA 6W + VELATO)
Per ciascuno dei due argomenti (Vettore A e Vettore B), analizza implicitamente e con rigore le 6 coordinate:
1. WHEN / WHERE (Contesto Storico/Spaziale): Il vuoto culturale, l'epoca o il trauma collettivo d'origine.
2. WHAT (Definizione Scientifica/Fisica): La descrizione tecnica, oggettiva e spogliata dal mistero.
3. HOW (Meccanismo d'Azione o "Ferro del Mestiere"): Il processo specifico d'interazione con materia o informazione.
4. WHO (Percezione ed Esperienza Umana): La risonanza viscerale, emotiva o psicologica nella coscienza.
5. WHICH BOUNDARY (Confine Sfidato): La barriera apparentemente invalicabile tra noto e ignoto che viene forzata.
6. WHY / THE VEILED REALITY (La Traccia e il Velato): L'aspetto nascosto e poroso che suggerisce una realtà non ancora decifrata.

FASE 2: LA COLLISIONE E IL LOOP COGNITIVO (5 PROSPETTIVE)
Fai collidere i due vettori analizzati facendoli attraversare da 5 prospettive trasversali:
- Prospettiva 1 (Termodinamica / Entropica): L'inversione del degrado della materia e la conservazione dell'informazione come batteria energetica.
- Prospettiva 2 (Ecologico-Evolutiva): Il superamento del confine esterno/interno; l'interfaccia gestita dalla memoria collettiva o dagli antenati.
- Prospettiva 3 (Semiotica / Di Traduzione): Il glitch sintattico; la stessa trasmissione trascesa decodificata male dal software culturale del cervello.
- Prospettiva 4 (Metamorfica / Biologica): Lo stadio di transizione; il bozzolo planetario e la sonda lanciata verso la crisalide dimensionale.
- Prospettiva 5 (Architetturale / Sistemica): Il bug di rendering; la fuoriuscita di stringhe di codice da un livello superiore aperte come pop-up nella percezione.
Fondi queste 5 prospettive estraendo la faglia d'attrito più profonda e un'unica intuizione inedita e radicale.

FASE 3: L'AFFONDO E LA SINTESI FINALE (SAGGIO NARRATIVO CONTINUO)
Traduci l'intera indagine in un saggio narrativo, coerente, profondo e avvolgente.
Il saggio deve necessariamente incorporare e sciogliere in modo fluido all'interno della prosa:
- La risposta a «Cui prodest?» (quale blocco culturale e riduzionista viene smantellato restituendo centralità ontologica all'uomo).
- La denuncia esplicita dei confini disciplinari e dei pregiudizi metodologici finora non investigati.
- La proposta di un nuovo campo o intersezione di ricerca interdisciplinare (es. fisica topologica del vuoto, elettrodinamica quantistica di soglia, neurofenomenologia).
- La rivelazione o vertigine finale sull'infrastruttura della "stanza" del reale e le porte girevoli tra i piani.

CONSTRAINT DI ESTENSIONE E DENSITÀ STRUTTURALE (TASSATIVO):
La lunghezza finale dell'articolo/saggio deve essere compresa rigorosamente tra le 1.200 e le 1.800 parole.
Questo perimetro dimensionale è tassativo: deve fornire lo spazio narrativo necessario per sviluppare organicamente l'apertura destabilizzante, la stratificazione fluida dei passaggi logici derivati dalla scomposizione e dal loop cognitivo a cinque prospettive, e la risoluzione finale dell'affondo ontologico. Ogni sezione argomentativa deve mantenere un'alta densità di pensiero, evitando formule compresse o diluizioni descrittive superflue.

REGOLA TASSATIVA DI SCRITTURA (ZERO STRUCTURAL LEAKAGE):
- Il saggio NON DEVE MAI mostrare schemi, elenchi puntati, elenchi numerati, né etichette come "Fase 1", "Fase 2", "Fase 3", "Conclusione" o "When/Where".
- Nessuna intestazione paratestuale o divisione in bullet points.
- Tutto deve essere fuso organicamente in ampi paragrafi narrativi continui (ciascun paragrafo ricco, denso e approfondito per raggiungere il computo totale tassativo di 1.200 - 1.800 parole), in italiano aulico, denso e contemplativo.

Rispondi rigorosamente con un oggetto JSON valido avente questa precisa struttura:
{
  "systemPair": {
    "vectorA": "${vectorA.name}",
    "vectorB": "${vectorB.name}",
    "syntheticVector": "string (sintesi concisa dell'intuizione scaturita dalla collisione)",
    "ontologicalMatrix": "string (campo d'attrito e matrice ontologica)",
    "derivationTimestamp": "string"
  },
  "essay": {
    "title": "string (titolo austero, evocativo e filosoficamente denso, privo di numeri)",
    "subtitle": "string (sintesi morfologica del saggio)",
    "ontologicalThesis": "string (tesi ontologica apodittica e incontrovertibile all'esordio del discorso)",
    "narrativeParagraphs": [
      "string (Paragrafo 1: Esordio speculativo e radice dell'indagine sui due vettori scomposti)",
      "string (Paragrafo 2: Approfondimento fenomenologico e scioglimento del confine sfidato)",
      "string (Paragrafo 3: Collisione e sintesi del loop a 5 prospettive)",
      "string (Paragrafo 4: Cui prodest, denuncia dei recinti disciplinari non investigati e nuovo campo di ricerca)",
      "string (Paragrafo 5: Vertigine finale sull'infrastruttura della stanza del reale e le porte girevoli tra i piani)"
    ]
  }
}`;
}
