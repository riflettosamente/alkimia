import React from 'react';
import { EditorialEdition } from '../types';
import { AutonomousPipelineTracker } from './AutonomousPipelineTracker';
import { SystemConceptualPairHeader } from './SystemConceptualPairHeader';
import { SpeculativeEssayView } from './SpeculativeEssayView';
import { WhiteboardPinsPanel } from './WhiteboardPinsPanel';
import { Calendar, ShieldCheck, History, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface EditorialEditionEntryProps {
  edition: EditorialEdition;
  index: number;
}

export const EditorialEditionEntry: React.FC<EditorialEditionEntryProps> = ({
  edition,
  index
}) => {
  const { isLatest, cycle, systemPair, essay, pins, tensions } = edition;

  return (
    <motion.article 
      id={`edition-${edition.id}`}
      initial={{ opacity: 0, y: isLatest ? 20 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isLatest ? 1.0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`border-b border-[#212634] ${
        isLatest 
          ? 'space-y-10 pt-2 pb-20 sm:pb-28' 
          : 'space-y-8 pt-4 pb-14 opacity-90 hover:opacity-100 transition-opacity'
      }`}
    >
      {/* Editorial Marker & Archival Timestamp Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#13151c] border border-[#242936] px-4 py-2.5 rounded-xs font-mono text-xs text-[#b8b1a3]">
        <div className="flex items-center gap-2.5">
          {isLatest ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1b202a] text-[#f2ede4] border border-[#2d3446] text-[10px] tracking-wider uppercase font-semibold rounded-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Saggio del Giorno in Primo Piano • 24h Attive
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#171a22] text-[#c7c0b3] border border-[#272c3a] text-[10px] tracking-wider uppercase font-medium rounded-2xs">
              <History className="w-3 h-3 text-[#c49b45]" />
              Fascicolo Archiviato • Ciclo -{index * 24}h
            </span>
          )}
          <span className="font-bold text-[#f5f1e8] font-serif text-sm">
            {cycle.editionNumber}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#8e8779]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#999080]" />
            {cycle.cyclicalDate}
          </span>
          <span className="border-l border-[#272c38] pl-3">
            {cycle.telemetry.cycleInterval}
          </span>
        </div>
      </div>

      {/* Autonomous System Conceptual Pair Derivation (Strictly zero dropdowns or buttons) */}
      <section aria-label="Accoppiamento Concettuale di Sistema">
        <SystemConceptualPairHeader 
          systemPair={systemPair} 
          editionNumber={cycle.editionNumber}
          isLatest={isLatest}
        />
      </section>

      {/* Autonomous Pipeline Tracker (Shows current status or archival closure) */}
      {isLatest ? (
        <section aria-label="Flusso Editoriale Autonomo">
          <AutonomousPipelineTracker 
            pipeline={cycle.pipeline} 
            telemetry={cycle.telemetry} 
          />
        </section>
      ) : (
        <div className="p-3.5 bg-[#111319] border border-[#212633] rounded-xs font-mono text-[11px] text-[#8a8376] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[#bfb8ab]">Ciclo editoriale completato e cristallizzato nel registro permanente.</span>
          </div>
          <span className="text-[10px] text-[#736d62]">
            Indice di coerenza: {(cycle.telemetry.coherenceIndex * 100).toFixed(0)}%
          </span>
        </div>
      )}

      {/* Main Dual Layout: Speculative Essay + Perimetral Investigative Whiteboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Speculative Treatise Main View with generous reading margins */}
        <div className="lg:col-span-8 space-y-6">
          <SpeculativeEssayView essay={essay} isLatest={isLatest} />
        </div>

        {/* Investigative Whiteboard Side Panel */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <WhiteboardPinsPanel pins={pins} tensions={tensions} />
        </div>

      </div>
    </motion.article>
  );
};
