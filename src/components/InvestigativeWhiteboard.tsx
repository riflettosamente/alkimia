import React from 'react';
import { EditorialCycle, SpeculativeEssay, WhiteboardPin, DialecticalTension } from '../types';
import { AutonomousPipelineTracker } from './AutonomousPipelineTracker';
import { SpeculativeEssayView } from './SpeculativeEssayView';
import { WhiteboardPinsPanel } from './WhiteboardPinsPanel';

interface InvestigativeWhiteboardProps {
  cycle: EditorialCycle;
  essay: SpeculativeEssay;
  pins: WhiteboardPin[];
  tensions: DialecticalTension[];
}

export const InvestigativeWhiteboard: React.FC<InvestigativeWhiteboardProps> = ({
  cycle,
  essay,
  pins,
  tensions
}) => {
  return (
    <main className="min-h-screen bg-investigative-grid bg-[#f6f3eb] text-[#24201b] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* Pipeline / Editorial Flow Tracker */}
        <section aria-label="Flusso Editoriale Autonomo">
          <AutonomousPipelineTracker 
            pipeline={cycle.pipeline} 
            telemetry={cycle.telemetry} 
          />
        </section>

        {/* Investigative Whiteboard Canvas: Central Treatise + Perimetral Axioms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column: Central Speculative Essay for Contemplative Reading (8 cols on large) */}
          <div className="lg:col-span-8 space-y-6">
            <SpeculativeEssayView essay={essay} />
          </div>

          {/* Side Column: Investigative Whiteboard Pins and Dialectical Tension (4 cols on large) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <WhiteboardPinsPanel pins={pins} tensions={tensions} />
          </div>

        </div>

        {/* Editorial Colophon / Daily Contemplative Footer */}
        <footer className="pt-12 border-t border-[#d8cebe] text-center font-serif text-xs text-[#6e6354] space-y-1">
          <div className="font-mono text-[10px] tracking-widest uppercase text-[#8a754b]">
            Sistema di Indagine Ontologica & Speculazione Autonoma
          </div>
          <p>
            Pubblicazione continua ad accesso libero e contemplazione diurna • Nessun algoritmo di profilazione o input utente
          </p>
          <div className="text-[10px] font-mono text-[#8a8070]">
            Tutti i trattati sono generati e articolati autonomamente dal ciclo editoriale.
          </div>
        </footer>

      </div>
    </main>
  );
};
