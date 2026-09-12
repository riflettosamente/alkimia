import React from 'react';
import { EditorialCycle } from '../types';
import { Calendar } from 'lucide-react';

interface EditorialHeaderProps {
  cycle: EditorialCycle;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({ cycle }) => {
  return (
    <header className="border-b border-[#ded7ca] pb-8 pt-4 text-center space-y-3">
      <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#736c60]">
        Indagine Ontologica Quotidiana
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold tracking-tight text-[#1a1714]">
        ALKIMIA
      </h1>
      <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#736c60] pt-1">
        <Calendar className="w-3.5 h-3.5 text-[#9e7627]" />
        <span>Data di emissione: {cycle.cyclicalDate}</span>
      </div>
    </header>
  );
};
