import React from 'react';
import { EditorialEdition } from '../types';
import { SpeculativeEssayView } from './SpeculativeEssayView';
import { Phase1StructuralDecompositionView } from './Phase1StructuralDecompositionView';
import { EmpiricalArchiveSection } from './EmpiricalArchiveSection';
import { Phase2CollisionView } from './Phase2CollisionView';
import { Phase2LoopFiveDirectionsView } from './Phase2LoopFiveDirectionsView';
import { Phase3FinalStrikeView } from './Phase3FinalStrikeView';
import { Calendar, Layers, Database, Zap, Repeat, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface EditorialEditionEntryProps {
  edition: EditorialEdition;
  index: number;
}

type PhaseNumber = 1 | 2 | 3 | 4 | 5 | 6;

function detectActivePhase(): PhaseNumber {
  if (typeof window !== 'undefined') {
    const pathMatch = window.location.pathname.match(/\/fase-([1-6])(?:\.html)?$/i);
    if (pathMatch) {
      const num = parseInt(pathMatch[1], 10);
      if (num >= 1 && num <= 6) return num as PhaseNumber;
    }
    const rootAttr = document.getElementById('root')?.getAttribute('data-phase');
    if (rootAttr) {
      const num = parseInt(rootAttr, 10);
      if (num >= 1 && num <= 6) return num as PhaseNumber;
    }
  }
  return 1;
}

export const EditorialEditionEntry: React.FC<EditorialEditionEntryProps> = ({
  edition,
  index
}) => {
  const { isLatest, cycle, essay, systemPair, phase1Decomposition, phase1EmpiricalArchive, phase2Collision, phase2Loop, phase3FinalStrike } = edition;
  const activePhase = detectActivePhase();

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

      {/* Selettore dei Tab di Consultazione (6 Pagine HTML distinte) */}
      <div className="max-w-4xl mx-auto flex items-center justify-center sm:justify-start">
        <nav 
          role="tablist"
          aria-label="Pagine di indagine speculativa (Fase 1 - Fase 6)"
          className="inline-flex p-1 bg-[#ede9e0] border border-[#d8d0c2] rounded-sm gap-1 flex-wrap sm:flex-nowrap"
        >
          <a
            id="tab-phase-1"
            role="tab"
            href="/fase-1.html"
            aria-selected={activePhase === 1}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer no-underline ${
              activePhase === 1
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${activePhase === 1 ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 1: Scomposizione</span>
          </a>

          <a
            id="tab-phase-2"
            role="tab"
            href="/fase-2.html"
            aria-selected={activePhase === 2}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer no-underline ${
              activePhase === 2
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <Database className={`w-3.5 h-3.5 ${activePhase === 2 ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 2: Archivio Empirico</span>
          </a>

          <a
            id="tab-phase-3"
            role="tab"
            href="/fase-3.html"
            aria-selected={activePhase === 3}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer no-underline ${
              activePhase === 3
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${activePhase === 3 ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 3: La Collisione</span>
          </a>

          <a
            id="tab-phase-4"
            role="tab"
            href="/fase-4.html"
            aria-selected={activePhase === 4}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer no-underline ${
              activePhase === 4
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <Repeat className={`w-3.5 h-3.5 ${activePhase === 4 ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 4: Loop 5 Direzioni</span>
          </a>

          <a
            id="tab-phase-5"
            role="tab"
            href="/fase-5.html"
            aria-selected={activePhase === 5}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer no-underline ${
              activePhase === 5
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activePhase === 5 ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 5: L'Affondo Finale</span>
          </a>

          <a
            id="tab-phase-6"
            role="tab"
            href="/fase-6.html"
            aria-selected={activePhase === 6}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wide rounded-sm transition-all cursor-pointer no-underline ${
              activePhase === 6
                ? 'bg-[#ffffff] text-[#1a1714] font-medium border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714] hover:bg-[#f3efe7] border border-transparent'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${activePhase === 6 ? 'text-[#9e7627]' : 'text-[#7e7667]'}`} />
            <span>Fase 6: Saggio del Giorno</span>
          </a>
        </nav>
      </div>

      {/* Contenuto dedicato alla singola pagina HTML della Fase attiva */}
      <div className="w-full">
        {activePhase === 1 && (
          <Phase1StructuralDecompositionView 
            systemPair={systemPair} 
            decomposition={phase1Decomposition} 
          />
        )}
        {activePhase === 2 && (
          <EmpiricalArchiveSection 
            systemPair={systemPair} 
            archive={phase1EmpiricalArchive} 
          />
        )}
        {activePhase === 3 && (
          <Phase2CollisionView 
            systemPair={systemPair} 
            collision={phase2Collision} 
          />
        )}
        {activePhase === 4 && (
          <Phase2LoopFiveDirectionsView 
            systemPair={systemPair} 
            loop={phase2Loop} 
          />
        )}
        {activePhase === 5 && (
          <Phase3FinalStrikeView 
            systemPair={systemPair} 
            finalStrike={phase3FinalStrike} 
          />
        )}
        {activePhase === 6 && (
          <SpeculativeEssayView 
            essay={essay} 
            isLatest={isLatest} 
          />
        )}
      </div>
    </motion.article>
  );
};

