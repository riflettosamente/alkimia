import React from 'react';
import { SpeculativeEssay } from '../types';
import { motion } from 'motion/react';

interface SpeculativeEssayViewProps {
  essay: SpeculativeEssay;
  isLatest?: boolean;
}

export const SpeculativeEssayView: React.FC<SpeculativeEssayViewProps> = ({ 
  essay,
  isLatest = false,
}) => {
  // Estrazione dei paragrafi narrativi continui privi di elenchi o marcatori procedurali
  const paragraphs: string[] = essay.narrativeParagraphs && essay.narrativeParagraphs.length > 0
    ? essay.narrativeParagraphs
    : [
        essay.preamble,
        ...essay.sections.flatMap(s => s.propositions.map(p => `${p.statement} ${p.commentary || ''}`)),
        essay.corollaries.join(' '),
        essay.openAporias.join(' ')
      ].filter(Boolean);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 14, filter: 'blur(2px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#121419] border border-[#242936] shadow-2xl rounded-xs text-[#e3ded4] max-w-3xl mx-auto relative font-serif ${
        isLatest 
          ? 'p-8 sm:p-14 lg:p-16 ring-1 ring-[#c49b45]/15' 
          : 'p-7 sm:p-12'
      }`}
    >
      
      {/* Nastro discreto superiore */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1b1f29] border border-[#313849] text-[10px] font-mono uppercase tracking-widest px-4 py-0.5 shadow-xs rotate-[-0.5deg] text-[#aba395]">
        {isLatest ? "Saggio del Giorno • Lettura Contemplativa" : "Fascicolo d'Indagine Archiviato"}
      </div>

      {/* Titolo e Sottotitolo del Saggio */}
      <motion.header 
        initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.3, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="text-center pb-12 border-b border-[#222734] space-y-6"
      >
        <div className="text-[11px] font-mono tracking-[0.28em] text-[#8e8779] uppercase">
          Trattato di Speculazione Pura
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#f5f2eb] leading-[1.22] tracking-tight max-w-2xl mx-auto">
          {essay.title}
        </h2>

        <p className="text-lg sm:text-xl italic text-[#b8b0a1] max-w-xl mx-auto leading-[1.8] pt-1">
          {essay.subtitle}
        </p>

        {/* Tesi Ontologica Incastonata all'Esordio */}
        <div className="mt-8 p-6 sm:p-7 bg-[#161a22] border-l-2 border-[#c49b45] text-left rounded-r-xs shadow-xs">
          <p className="text-lg sm:text-[19.5px] font-serif text-[#f4f0e8] leading-[1.9] italic">
            «{essay.ontologicalThesis}»
          </p>
        </div>
      </motion.header>

      {/* Corpo del Saggio: Prosa Narrativa Fluida ed Evocativa (Zero Structural Leakage) */}
      <motion.div 
        initial={{ opacity: 0, y: 10, filter: 'blur(1.5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.3, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="py-12 space-y-9 text-justify"
      >
        {paragraphs.map((paragraphText, idx) => (
          <React.Fragment key={idx}>
            <p 
              className={`text-lg sm:text-[19.5px] leading-[2.15] text-[#ded8cb] font-serif tracking-normal ${
                idx === 0 
                  ? 'first-letter:float-left first-letter:text-6xl first-letter:font-serif first-letter:mr-4 first-letter:leading-none first-letter:text-[#c49b45]' 
                  : ''
              }`}
            >
              {paragraphText}
            </p>

            {/* Separatore di respiro contemplativo a metà percorso */}
            {idx === Math.floor(paragraphs.length / 2) && paragraphs.length > 2 && (
              <div className="py-4 flex items-center justify-center text-[#8a806d] select-none" aria-hidden="true">
                <span className="font-serif text-sm tracking-[0.6em] opacity-60">✦ ✦ ✦</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Chiusura Meditativa Discreta */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="pt-10 border-t border-[#222734] text-center"
      >
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#7a7467]">
          Fine della meditazione diurna • Rotazione attiva per 24 ore
        </p>
      </motion.footer>

    </motion.article>
  );
};

