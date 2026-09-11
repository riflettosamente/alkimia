import React from 'react';
import { EditorialCycle } from '../types';
import { Compass, Clock, Cpu } from 'lucide-react';

interface EditorialHeaderProps {
  cycle: EditorialCycle;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({ cycle }) => {
  return (
    <header className="bg-[#12141a] border border-[#232835] p-6 sm:p-8 rounded-xs shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left: Identity and Autonomous System Badge */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono tracking-wider uppercase bg-[#171a23] text-[#ded9ce] border border-[#272d3b] rounded-xs font-medium">
              <Cpu className="w-3.5 h-3.5 text-[#c49b45]" />
              Automa Editoriale Autonomo
            </span>
            <span className="text-xs font-mono text-[#8a8376] border-l border-[#262a33] pl-2.5">
              Flusso non-interattivo • Lettura Contemplativa Quotidiana
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-[#f3efe6]">
            Indagine Ontologica & Saggi Speculativi
          </h1>
          <p className="text-sm sm:text-base font-serif italic text-[#a39b8c] max-w-2xl leading-relaxed">
            {cycle.investigativeDomain}
          </p>
        </div>

        {/* Right: Edition Meta and Next Scheduled Automated Cycle */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 font-mono text-xs text-[#b8b1a3] shrink-0">
          <div className="bg-[#161922] border border-[#262c3a] px-4 py-3 rounded-xs space-y-1 min-w-[140px]">
            <div className="text-[10px] uppercase text-[#736d62] tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#c49b45]" />
              Edizione Diurna
            </div>
            <div className="font-semibold text-sm text-[#ede8de]">{cycle.editionNumber}</div>
            <div className="text-[11px] text-[#878072]">{cycle.cyclicalDate}</div>
          </div>

          <div className="bg-[#161922] border border-[#262c3a] px-4 py-3 rounded-xs space-y-1 min-w-[140px]">
            <div className="text-[10px] uppercase text-[#736d62] tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c49b45]" />
              Prossima Generazione
            </div>
            <div className="font-semibold text-sm text-[#ede8de] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Ciclo Attivo
            </div>
            <div className="text-[11px] text-[#878072]">{cycle.nextScheduledPublication}</div>
          </div>
        </div>

      </div>
    </header>
  );
};
