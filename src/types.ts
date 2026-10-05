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
  whenWhere: string;      // 1. WHEN / WHERE (Contesto Storico e Spaziale)
  what: string;           // 2. WHAT (Definizione Scientifica o Fisica)
  how: string;            // 3. HOW (Meccanismo d'Azione)
  who: string;            // 4. WHO (Percezione Umana)
  whichBoundary: string;  // 5. WHICH BOUNDARY (Il Confine Sfidato)
  whyVeiled: string;      // 6. WHY / THE VEILED REALITY (La Traccia e il Velato)
}

export interface EmpiricalTopicArchive {
  topicName: string;
  foundationalTexts: string;          // Supporti e Opere Fondative (libri, dossier, trattati)
  keyFiguresAndWitnesses: string;     // Persone e Testimoni (scienziati, pionieri, testimoni diretti)
  materialEvidenceAndTools: string;   // Reperti, Strumenti e Misurazioni (tracciati radar/EEG, fotogrammi, anomalie, monumenti)
  breakthroughTheories: string;       // Paradigmi e Teorie di Svolta (modelli interpretativi)
}

export interface Phase1EmpiricalArchive {
  vectorA: EmpiricalTopicArchive;
  vectorB: EmpiricalTopicArchive;
  crossArchiveSynthesis: string;
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
  empiricalDrawerLabel?: string;
  empiricalEvidenceExamined?: string;
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
  empiricalDrawerLabel?: string;
  empiricalEvidenceExamined?: string;
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

/**
 * Stato reale della redazione del Saggio del Giorno.
 *
 * - `generated`:    il saggio è stato prodotto da un motore AI.
 * - `generating`:   la generazione è in corso; il contenuto mostrato è provvisorio.
 * - `failed`:       tutti i provider hanno fallito; il contenuto mostrato è il ripiego canonico locale.
 * - `placeholder`:  nessuna generazione è ancora stata tentata (ripiego locale deterministico).
 */
export type EditionGenerationStatus = 'generated' | 'generating' | 'failed' | 'placeholder';

export type PhaseStatus = 'pending' | 'generating' | 'completed' | 'fallback';

export interface PhaseTelemetryItem {
  phaseNumber: 1 | 2 | 3 | 4 | 5 | 6;
  phaseTitle: string;
  status: PhaseStatus;
  provider: 'openai' | 'groq' | 'openrouter' | 'cloudflare' | 'gemini' | 'local' | null;
  model: string | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  completedAt?: string | null;
}

export interface EditorialEdition {
  id: string;
  cycle: EditorialCycle;
  systemPair: SystemConceptualPair;
  essay: SpeculativeEssay;
  phase1Decomposition?: Phase1StructuralDecomposition;
  phase1EmpiricalArchive?: Phase1EmpiricalArchive;
  phase2Collision?: Phase2CollisionDecomposition;
  phase2Loop?: Phase2LoopFiveDirections;
  phase3FinalStrike?: Phase3FinalStrike;
  phaseTelemetry?: PhaseTelemetryItem[];
  pins: WhiteboardPin[];
  tensions: DialecticalTension[];
  isLatest: boolean;
  /**
   * `null` quando il provider non è noto con certezza: prima di questa correzione
   * il front-end dichiarava "openrouter" anche sul contenuto di ripiego, mentendo all'utente.
   */
  aiProvider?: 'openai' | 'groq' | 'openrouter' | 'cloudflare' | 'gemini' | null;
  aiModel?: string | null;
  generationStatus?: EditionGenerationStatus;
  /** Motivo leggibile del fallimento, presente solo con `generationStatus === 'failed'`. */
  generationError?: string | null;
  /** Tentativi per provider effettuati dal server per questa data solare. */
  generationAttempts?: number;
}
