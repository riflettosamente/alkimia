import React, { useState } from 'react';
import { EditorialEdition } from '../types';
import { SpeculativeEssayView } from './SpeculativeEssayView';
import { Phase1StructuralDecompositionView } from './Phase1StructuralDecompositionView';
import { Phase2CollisionView } from './Phase2CollisionView';
import { Phase2LoopFiveDirectionsView } from './Phase2LoopFiveDirectionsView';
import { Phase3FinalStrikeView } from './Phase3FinalStrikeView';
import { Calendar, Layers, Zap, Repeat, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface EditorialEditionEntryProps {
  edition: EditorialEdition;
  index: number;
}

export const EditorialEditionEntry: React.FC<EditorialEditionEntryProps> = ({
  edition,
  index
}) => {
  const { isLatest, cycle, essay, systemPair, phase1Decomposition, phase2Collision, phase2Loop, phase3FinalStrike } = edition;
  const [activeTab, setActiveTab] = useState<'phase1' | 'phase2' | 'phase2_2' | 'phase3' | 'essay'>('phase1');

  return (
    <motion.article 
      id={`edition-${edition.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className={`border-b border-[#ded7ca] ${
        isLatest 
          ? 'space-y-8 pt-2 pb-20' 
          : 'space-y-8 pt-8 pb-16 opacity-90 hover:opacity-100 transition-opacity'
      }`}
    >
      {/* Metadati Temporali di Emissione */}
      <div className="max-w-4xl mx-auto flex items-center justify-between text-xs font-mono text-[#6e685c] border-b border-[#ded7ca] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#9e7627]" />
          <span>{isLatest ? "Edizione Quotidiana" : `Fascicolo Archiviato (-${index * 24}h)`}</span>
        </div>
        <div>
          <span>Data di emissione: {cycle.cyclicalDate}</span>
        </div>
      </div>

      {/* Selettore dei Tab di Consultazione */}
      <div className="max-w-4xl mx-auto flex items-center justify-center sm:justify-start">
        <div 
          role="tablist"
          aria-label="Pagine di indagine speculativa"
          className="inline-flex p-1 bg-[#ede9e0] border border-[#d8d0c2] rounded-sm gap-1 flex-wrap sm:flex-nowrap"
        >
          <button
            id="tab-phase-1"
            role="tab"
            aria-selected={activeTab === 'phase1'}
            onClick={() => setActiveTab('phase1')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer ${
              activeTab === 'phase1'
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${activeTab === 'phase1' ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 1: Scomposizione</span>
          </button>

          <button
            id="tab-phase-2"
            role="tab"
            aria-selected={activeTab === 'phase2'}
            onClick={() => setActiveTab('phase2')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer ${
              activeTab === 'phase2'
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${activeTab === 'phase2' ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 2: La Collisione</span>
          </button>

          <button
            id="tab-phase-3"
            role="tab"
            aria-selected={activeTab === 'phase2_2'}
            onClick={() => setActiveTab('phase2_2')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer ${
              activeTab === 'phase2_2'
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <Repeat className={`w-3.5 h-3.5 ${activeTab === 'phase2_2' ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 3: Loop 5 Direzioni</span>
          </button>

          <button
            id="tab-phase-4"
            role="tab"
            aria-selected={activeTab === 'phase3'}
            onClick={() => setActiveTab('phase3')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer ${
              activeTab === 'phase3'
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'phase3' ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 4: L'Affondo Finale</span>
          </button>

          <button
            id="tab-phase-5"
            role="tab"
            aria-selected={activeTab === 'essay'}
            onClick={() => setActiveTab('essay')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer ${
              activeTab === 'essay'
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'essay' ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 5: Saggio del Giorno</span>
          </button>
        </div>
      </div>

      {/* Contenuto dinamico in base al Tab attivo */}
      <div className="w-full">
        {activeTab === 'phase1' && (
          <Phase1StructuralDecompositionView 
            systemPair={systemPair} 
            decomposition={phase1Decomposition} 
          />
        )}
        {activeTab === 'phase2' && (
          <Phase2CollisionView 
            systemPair={systemPair} 
            collision={phase2Collision} 
          />
        )}
        {activeTab === 'phase2_2' && (
          <Phase2LoopFiveDirectionsView 
            systemPair={systemPair} 
            loop={phase2Loop} 
          />
        )}
        {activeTab === 'phase3' && (
          <Phase3FinalStrikeView 
            systemPair={systemPair} 
            finalStrike={phase3FinalStrike} 
          />
        )}
        {activeTab === 'essay' && (
          <SpeculativeEssayView 
            essay={essay} 
            isLatest={isLatest} 
          />
        )}
      </div>
    </motion.article>
  );
};

