import React from 'react';
import { EditorialCycle } from '../types';
import { Calendar } from 'lucide-react';

interface EditorialHeaderProps {
  cycle: EditorialCycle;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({ cycle }) => {
  return (
    <header className="border-b border-[#212530] pb-8 pt-4 text-center space-y-3">
      <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#8e8779]">
        Indagine Ontologica Quotidiana
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold tracking-tight text-[#f4f0e8]">
        ALKIMIA
      </h1>
      <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#8a8376] pt-1">
        <Calendar className="w-3.5 h-3.5 text-[#c49b45]" />
        <span>Data di emissione: {cycle.cyclicalDate}</span>
      </div>
    </header>
  );
};
