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

export interface VectorPhase1Decomposition {
  topicName: string;
  whenWhere: string;      // 1. WHEN / WHERE (Contesto Storico e Spaziale): Qual è il vuoto culturale, l'epoca o il trauma collettivo in cui l'argomento si radica?
  what: string;           // 2. WHAT (Definizione Scientifica o Fisica): Qual è la descrizione oggettiva e tecnica del fenomeno, spogliata da ogni alone di mistero?
  how: string;            // 3. HOW (Meccanismo d'Azione): Qual è il processo specifico, il "ferro del mestiere" con cui il sistema interagisce con la materia o l'informazione?
  who: string;            // 4. WHO (Percezione Umana): Qual è la reazione viscerale, emotiva o psicologica che l'argomento provoca nella coscienza collettiva?
  whichBoundary: string;  // 5. WHICH BOUNDARY (Il Confine Sfidato): Quale barriera invalicabile tra noto e ignoto, tra possibile e impossibile, questo fenomeno mette in discussione?
  whyVeiled: string;      // 6. WHY / THE VEILED REALITY (La Traccia e il Velato): Quale aspetto nascosto e poroso del cosmo ci suggerisce l'esistenza di una realtà che intuiamo ma non sappiamo ancora decifrare?
}

export interface Phase1StructuralDecomposition {
  vectorA: VectorPhase1Decomposition;
  vectorB: VectorPhase1Decomposition;
}

export interface Phase2Step1StrippingFunction {
  fundamentalVerbA: string;
  abstractFunctionA: string;
  fundamentalVerbB: string;
  abstractFunctionB: string;
  functionalSynthesis: string;
}

export interface Phase2Step2BlindAxis {
  boundaryA: string;
  accessDoorToB: string;
  creviceContactPoint: string;
}

export interface Phase2Step3InvertedDirection {
  methodAAppliedToB: string;
  provocativeViolationQuestion: string;
  counterIntuitiveInsight: string;
}

export interface Phase2Step4CommonMetaphor {
  masterMetaphorTitle: string;
  cosmologicalAnthropologicalGround: string;
  unifyingVision: string;
}

export interface Phase2CollisionDecomposition {
  step1StrippingFunction: Phase2Step1StrippingFunction;
  step2BlindAxis: Phase2Step2BlindAxis;
  step3InvertedDirection: Phase2Step3InvertedDirection;
  step4CommonMetaphor: Phase2Step4CommonMetaphor;
}

export interface Phase2DirectionTrack {
  id: string;
  directionNumber: number;
  directionTitle: string;
  ontologicalAngle: string;
  collision: Phase2CollisionDecomposition;
}

export interface Phase2LoopFiveDirections {
  theoreticalPreamble: string;
  tracks: Phase2DirectionTrack[];
}

export interface DirectionFinalStrikeItem {
  directionNumber: number;
  directionTitle: string;
  ontologicalAngle: string;
  cuiProdest: string;
  groundbreakingDiscovery: string;
  uninvestigatedBias: string;
  researchFocusIntersection: string;
  dizzyingRevelation: string;
}

export interface Phase3FinalStrike {
  cuiProdest: string;
  groundbreakingDiscovery: string;
  uninvestigatedBias: string;
  researchFocusIntersection: string;
  dizzyingRevelation: string;
  directionStrikes?: DirectionFinalStrikeItem[];
}

export interface EditorialEdition {
  id: string;
  cycle: EditorialCycle;
  systemPair: SystemConceptualPair;
  essay: SpeculativeEssay;
  phase1Decomposition?: Phase1StructuralDecomposition;
  phase2Collision?: Phase2CollisionDecomposition;
  phase2Loop?: Phase2LoopFiveDirections;
  phase3FinalStrike?: Phase3FinalStrike;
  pins: WhiteboardPin[];
  tensions: DialecticalTension[];
  isLatest: boolean;
  aiProvider?: 'openrouter' | 'cloudflare' | 'gemini';
  aiModel?: string;
}
