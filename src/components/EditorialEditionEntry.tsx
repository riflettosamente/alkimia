import React from 'react';
import { EditorialEdition } from '../types';
import { SpeculativeEssayView } from './SpeculativeEssayView';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface EditorialEditionEntryProps {
  edition: EditorialEdition;
  index: number;
}

export const EditorialEditionEntry: React.FC<EditorialEditionEntryProps> = ({
  edition,
  index
}) => {
  const { isLatest, cycle, essay } = edition;

  return (
    <motion.article 
      id={`edition-${edition.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className={`border-b border-[#212634] ${
        isLatest 
          ? 'space-y-6 pt-2 pb-20' 
          : 'space-y-6 pt-8 pb-16 opacity-90 hover:opacity-100 transition-opacity'
      }`}
    >
      {/* Metadati Temporali di Emissione */}
      <div className="max-w-3xl mx-auto flex items-center justify-between text-xs font-mono text-[#8e8779] border-b border-[#1d212b] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#c49b45]" />
          <span>{isLatest ? "Saggio del Giorno" : `Fascicolo Archiviato (-${index * 24}h)`}</span>
        </div>
        <div>
          <span>{cycle.cyclicalDate}</span>
        </div>
      </div>

      {/* Saggio Speculativo Narrativo a Colonna Singola Focalizzata */}
      <div className="w-full">
        <SpeculativeEssayView essay={essay} isLatest={isLatest} />
      </div>
    </motion.article>
  );
};
