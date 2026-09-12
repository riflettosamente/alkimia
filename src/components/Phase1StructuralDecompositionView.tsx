import React from 'react';
import { Phase1StructuralDecomposition, SystemConceptualPair } from '../types';
import { buildPhase1Decomposition } from '../data/canonicalDecompositions';
import { Columns2, Compass, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface Phase1StructuralDecompositionViewProps {
  systemPair: SystemConceptualPair;
  decomposition?: Phase1StructuralDecomposition;
}

interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  guidingQuestion: string;
  field: 'whenWhere' | 'what' | 'how' | 'who' | 'whichBoundary' | 'whyVeiled';
}

const STEPS: StepItem[] = [
  {
    id: 'step-1',
    stepNumber: '1',
    title: 'WHEN / WHERE (Contesto Storico e Spaziale)',
    guidingQuestion: "Qual è il vuoto culturale, l'epoca o il trauma collettivo in cui l'argomento si radica?",
    field: 'whenWhere'
  },
  {
    id: 'step-2',
    stepNumber: '2',
    title: 'WHAT (Definizione Scientifica o Fisica)',
    guidingQuestion: 'Qual è la descrizione oggettiva e tecnica del fenomeno, spogliata da ogni alone di mistero?',
    field: 'what'
  },
  {
    id: 'step-3',
    stepNumber: '3',
    title: "HOW (Meccanismo d'Azione)",
    guidingQuestion: "Qual è il processo specifico, il \"ferro del mestiere\" con cui il sistema interagisce con la materia o l'informazione?",
    field: 'how'
  },
  {
    id: 'step-4',
    stepNumber: '4',
    title: 'WHO (Percezione Umana)',
    guidingQuestion: "Qual è la reazione viscerale, emotiva o psicologica che l'argomento provoca nella coscienza collettiva?",
    field: 'who'
  },
  {
    id: 'step-5',
    stepNumber: '5',
    title: 'WHICH BOUNDARY (Il Confine Sfidato)',
    guidingQuestion: 'Quale barriera invalicabile tra noto e ignoto, tra possibile e impossibile, questo fenomeno mette in discussione?',
    field: 'whichBoundary'
  },
  {
    id: 'step-6',
    stepNumber: '6',
    title: 'WHY / THE VEILED REALITY (La Traccia e il Velato)',
    guidingQuestion: 'Quale aspetto nascosto e poroso del cosmo ci suggerisce l\'esistenza di una realtà che intuiamo ma non sappiamo ancora decifrare?',
    field: 'whyVeiled'
  }
];

export const Phase1StructuralDecompositionView: React.FC<Phase1StructuralDecompositionViewProps> = ({
  systemPair,
  decomposition
}) => {
  // Risolve la scomposizione per i due vettori correnti
  const activeDecomposition = decomposition || buildPhase1Decomposition(
    systemPair.vectorA,
    systemPair.vectorB
  );

  const { vectorA, vectorB } = activeDecomposition;

  return (
    <motion.div 
      id="phase1-structural-decomposition"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-10"
    >
      {/* Testata della Fase 1 */}
      <div className="border border-[#ded7ca] bg-[#ffffff] p-6 sm:p-8 rounded-sm space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#9e7627]">
          <Layers className="w-4 h-4" />
          <span>FASE 1: La Scomposizione (Le 6 Domande / Le 5W + Il Velato)</span>
        </div>
        
        <p className="text-sm sm:text-base text-[#3d3830] font-serif leading-relaxed">
          Applicazione della griglia analitica a due argomenti distinti per estrarre la loro infrastruttura oggettiva, il contesto e la risonanza esistenziale.
        </p>

        {/* Intestazione delle due colonne affiancate */}
        <div className="pt-4 border-t border-[#ede7dc] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#faf8f5] p-4 border-l-2 border-[#b0872e] rounded-r-sm">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#787164] block mb-1">
              Argomento I (Vettore A)
            </span>
            <h3 className="text-base font-serif text-[#1a1714] font-semibold">
              {vectorA.topicName}
            </h3>
          </div>

          <div className="bg-[#faf8f5] p-4 border-l-2 border-[#5c6e8c] rounded-r-sm">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#787164] block mb-1">
              Argomento II (Vettore B)
            </span>
            <h3 className="text-base font-serif text-[#1a1714] font-semibold">
              {vectorB.topicName}
            </h3>
          </div>
        </div>
      </div>

      {/* Griglia dei 6 passaggi a colonne affiancate */}
      <div className="space-y-8">
        {STEPS.map((step) => {
          const contentA = vectorA[step.field];
          const contentB = vectorB[step.field];

          return (
            <div 
              key={step.id} 
              id={step.id}
              className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs"
            >
              {/* Intestazione del singolo passaggio */}
              <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono font-bold text-[#9e7627]">
                    § {step.stepNumber}
                  </span>
                  <h4 className="text-sm sm:text-base font-serif text-[#1a1714] font-medium">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
                  {step.guidingQuestion}
                </p>
              </div>

              {/* Colonne affiancate per il confronto in autonomia */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#ded7ca]">
                {/* Colonna Argomento A */}
                <div className="p-5 sm:p-6 space-y-2 bg-[#ffffff]">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-[#9e7627]">
                    <Compass className="w-3.5 h-3.5" />
                    <span className="font-medium">{vectorA.topicName}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#2c2823] font-serif">
                    {contentA}
                  </p>
                </div>

                {/* Colonna Argomento B */}
                <div className="p-5 sm:p-6 space-y-2 bg-[#fcfbfa]">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-[#475b7a]">
                    <Columns2 className="w-3.5 h-3.5" />
                    <span className="font-medium">{vectorB.topicName}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#2c2823] font-serif">
                    {contentB}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
