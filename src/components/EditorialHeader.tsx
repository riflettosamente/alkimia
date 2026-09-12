import React from 'react';
import { EditorialCycle } from '../types';
import { Calendar } from 'lucide-react';

interface EditorialHeaderProps {
  cycle: EditorialCycle;
  aiProvider?: 'openrouter' | 'cloudflare' | 'gemini';
  aiModel?: string;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({ 
  cycle, 
  aiProvider = 'openrouter',
  aiModel 
}) => {
  // verde: se ha utilizzato OpenRouter e/o Cloudflare (token gratuiti / non Gemini)
  // rosso: se è stata costretta ad utilizzare i token e le API di Google Gemini
  const isGemini = aiProvider === 'gemini';

  const dotColorClass = isGemini
    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
    : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';

  const statusLabel = isGemini
    ? `Gemini API (Token Google consumati)${aiModel ? ` · Modello: ${aiModel}` : ''}`
    : `Provider non-Gemini attivo: ${aiProvider === 'openrouter' ? 'OpenRouter' : 'Cloudflare Workers AI'} (Zero token Gemini consumati)${aiModel ? ` · Modello: ${aiModel}` : ''}`;

  return (
    <header className="border-b border-[#ded7ca] pb-8 pt-4 text-center space-y-3">
      <div className="inline-flex items-center justify-center gap-2 text-[11px] font-mono tracking-[0.3em] uppercase text-[#736c60]">
        <span>Indagine Ontologica Quotidiana</span>
        <span 
          id="ai-provider-token-indicator"
          title={statusLabel}
          aria-label={statusLabel}
          className="relative flex items-center justify-center cursor-help group"
        >
          <span className={`w-2 h-2 rounded-full ${dotColorClass} transition-colors duration-300`} />
          <span 
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap px-2.5 py-1 text-[10px] font-mono tracking-normal normal-case text-[#ffffff] bg-[#1a1714] rounded shadow-md pointer-events-none"
          >
            {isGemini ? (
              <span className="text-rose-300 font-medium">● Token Gemini utilizzati</span>
            ) : (
              <span className="text-emerald-300 font-medium">● {aiProvider === 'cloudflare' ? 'Cloudflare' : 'OpenRouter'} (Nessun token Gemini)</span>
            )}
          </span>
        </span>
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
