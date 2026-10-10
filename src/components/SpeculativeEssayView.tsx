import React, { useState } from 'react';
import { SpeculativeEssay } from '../types';
import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';

interface SpeculativeEssayViewProps {
  essay: SpeculativeEssay;
  isLatest?: boolean;
}

export const SpeculativeEssayView: React.FC<SpeculativeEssayViewProps> = ({ 
  essay,
  isLatest = false,
}) => {
  const [copied, setCopied] = useState(false);

  const cleanLiteraryText = (text?: unknown): string => {
    if (typeof text === 'string') {
      return text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
    }
    if (text && typeof text === 'object') {
      const candidate = (text as any).text || (text as any).paragraph || (text as any).content || (text as any).statement || '';
      if (typeof candidate === 'string') {
        return candidate.replace(/\*\*(.*?)\*\*/g, '$1').trim();
      }
    }
    return '';
  };

  if (!essay) {
    return null;
  }

  // Normalizzazione difensiva dei paragrafi narrativi (evita qualsiasi crash se sections/corollaries sono assenti o se narrativeParagraphs è stringa/oggetto)
  const rawNarrative =
    (essay as any).narrativeParagraphs ??
    (essay as any).paragraphs ??
    (essay as any).body ??
    (essay as any).content;

  let extractedParagraphs: string[] = [];

  if (Array.isArray(rawNarrative) && rawNarrative.length > 0) {
    extractedParagraphs = rawNarrative.map(p => cleanLiteraryText(p)).filter(Boolean);
  } else if (typeof rawNarrative === 'string' && rawNarrative.trim().length > 0) {
    extractedParagraphs = rawNarrative
      .split(/\n\s*\n/)
      .map(p => cleanLiteraryText(p))
      .filter(Boolean);
  }

  if (extractedParagraphs.length === 0) {
    const safeSections = Array.isArray(essay.sections)
      ? essay.sections.flatMap(s =>
          Array.isArray(s?.propositions)
            ? s.propositions.map(p => `${p?.statement || ''} ${p?.commentary || ''}`.trim())
            : []
        )
      : [];
    const safeCorollaries = Array.isArray(essay.corollaries) ? essay.corollaries.join(' ') : '';
    const safeAporias = Array.isArray(essay.openAporias) ? essay.openAporias.join(' ') : '';

    extractedParagraphs = [
      essay.preamble,
      ...safeSections,
      safeCorollaries,
      safeAporias
    ]
      .map(p => cleanLiteraryText(p))
      .filter(Boolean);
  }

  const paragraphs = extractedParagraphs;

  const handleCopyEssay = async () => {
    const title = cleanLiteraryText(essay.title);
    const subtitle = cleanLiteraryText(essay.subtitle);
    const thesis = cleanLiteraryText(essay.ontologicalThesis);

    const parts: string[] = [];
    if (title) parts.push(title);
    if (subtitle) parts.push(subtitle);
    if (thesis) parts.push(`«${thesis}»`);
    if (paragraphs.length > 0) {
      parts.push(...paragraphs);
    }

    const fullText = parts.join('\n\n');

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Impossibile copiare il saggio negli appunti:', err);
    }
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 14, filter: 'blur(2px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#ffffff] border border-[#ded7ca] shadow-md rounded-xs text-[#24211e] max-w-3xl mx-auto relative font-serif ${
        isLatest 
          ? 'p-8 sm:p-14 lg:p-16 ring-1 ring-[#c49b45]/20' 
          : 'p-7 sm:p-12'
      }`}
    >
      
      {/* Nastro discreto superiore */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f4efe6] border border-[#d8d0c2] text-[10px] font-mono uppercase tracking-widest px-4 py-0.5 shadow-xs rotate-[-0.5deg] text-[#6b6456]">
        {isLatest ? "FASE 6 • Saggio del Giorno • Lettura Contemplativa" : "FASE 6 • Fascicolo d'Indagine Archiviato"}
      </div>

      {/* Pulsante Copia Saggio in stile minimal editoriale */}
      <div className="flex justify-end mb-5">
        <button
          type="button"
          onClick={handleCopyEssay}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider text-[#6e685c] hover:text-[#24211e] bg-[#faf8f5] hover:bg-[#f3ede2] border border-[#ded7ca] hover:border-[#c5bcac] rounded-xs shadow-2xs transition-colors cursor-pointer select-none"
          title="Copia il saggio completo negli appunti (Titolo, Sottotitolo, Tesi e Corpo)"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span className="text-[#2e7d32] font-medium">Copiato</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#8c8270]" />
              <span>Copia Saggio</span>
            </>
          )}
        </button>
      </div>

      {/* Titolo e Sottotitolo del Saggio */}
      <motion.header 
        initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.3, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="text-center pb-12 border-b border-[#ded7ca] space-y-6"
      >
        <div className="text-[11px] font-mono tracking-[0.28em] text-[#787164] uppercase">
          Trattato di Speculazione Pura
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#1a1714] leading-[1.22] tracking-tight max-w-2xl mx-auto">
          {cleanLiteraryText(essay.title)}
        </h2>

        <p className="text-lg sm:text-xl italic text-[#544d42] max-w-xl mx-auto leading-[1.8] pt-1">
          {cleanLiteraryText(essay.subtitle)}
        </p>

        {/* Tesi Ontologica Incastonata all'Esordio */}
        <div className="mt-8 p-6 sm:p-7 bg-[#faf8f5] border-l-2 border-[#b0872e] text-left rounded-r-xs shadow-2xs">
          <p className="text-lg sm:text-[19.5px] font-serif text-[#1f1c19] leading-[1.9] italic">
            «{cleanLiteraryText(essay.ontologicalThesis)}»
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
              className={`text-lg sm:text-[19.5px] leading-[2.15] text-[#2c2823] font-serif tracking-normal ${
                idx === 0 
                  ? 'first-letter:float-left first-letter:text-6xl first-letter:font-serif first-letter:mr-4 first-letter:leading-none first-letter:text-[#9e7627]' 
                  : ''
              }`}
            >
              {paragraphText}
            </p>

            {/* Separatore di respiro contemplativo a metà percorso */}
            {idx === Math.floor(paragraphs.length / 2) && paragraphs.length > 2 && (
              <div className="py-4 flex items-center justify-center text-[#9e9687] select-none" aria-hidden="true">
                <span className="font-serif text-sm tracking-[0.6em] opacity-80">✦ ✦ ✦</span>
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
        className="pt-10 border-t border-[#ded7ca] text-center"
      >
        <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#7a7467]">
          Fine della meditazione diurna • Rotazione attiva per 24 ore
        </p>
      </motion.footer>

    </motion.article>
  );
};

