export type EditorialPhase = 
  | 'postulazione_assiomatica'
  | 'formulazione_dialettica'
  | 'distillazione_corollari'
  | 'pubblicato_contemplazione';

export interface EditorialPipelineStep {
  id: string;
  name: string;
  phase: EditorialPhase;
  description: string;
  status: 'completato' | 'in_corso' | 'in_attesa';
  timestamp?: string;
}

export interface EditorialTelemetry {
  coherenceIndex: number; // 0.0 - 1.0
  dialecticalTension: number; // 0.0 - 1.0
  axiomaticDensity: string;
  speculativeHorizon: string;
  cycleInterval: string;
}

export interface EditorialCycle {
  editionNumber: string;
  cyclicalDate: string;
  investigativeDomain: string;
  currentPhase: EditorialPhase;
  nextScheduledPublication: string;
  telemetry: EditorialTelemetry;
  pipeline: EditorialPipelineStep[];
}

export interface Proposition {
  notation: string; // es. "§ 1.1", "§ 1.2"
  statement: string;
  commentary?: string;
}

export interface EssaySection {
  numeral: string;
  title: string;
  propositions: Proposition[];
}

export interface SpeculativeEssay {
  id: string;
  cycleId: string;
  title: string;
  subtitle: string;
  ontologicalThesis: string;
  preamble: string;
  narrativeParagraphs?: string[]; // Saggio narrativo privo di elenchi, numeri o marcatori procedurali
  sections: EssaySection[];
  corollaries: string[];
  openAporias: string[];
  bibliographicResonances: {
    author: string;
    concept: string;
    note: string;
  }[];
}

export interface WhiteboardPin {
  id: string;
  marker: string; // es. "POSTULATO α", "LEMMA γ"
  text: string;
  context: string;
  type: 'postulato' | 'aporia' | 'faglia' | 'evidenza';
  rotationDeg?: number;
}

export interface DialecticalTension {
  id: string;
  poleA: string;
  poleB: string;
  field: string;
  state: string;
}

export interface SystemConceptualPair {
  vectorA: string;
  vectorB: string;
  syntheticVector: string;
  ontologicalMatrix: string;
  derivationTimestamp: string;
}

export interface OntologicalEssence {
  id: string;
  name: string;
  philosophicalLineage: string[];
  conceptualCore: string;
  structuralDynamics: string;
  axiomaticPostulate: string;
  dialecticalTension: string;
  prohibitedSuperficialities: string[];
}

export interface EditorialEdition {
  id: string;
  cycle: EditorialCycle;
  systemPair: SystemConceptualPair;
  essay: SpeculativeEssay;
  pins: WhiteboardPin[];
  tensions: DialecticalTension[];
  isLatest: boolean;
}
