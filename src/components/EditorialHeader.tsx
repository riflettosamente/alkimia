import React from 'react';
import { EditorialCycle, EditionGenerationStatus } from '../types';
import { Calendar } from 'lucide-react';

type AiProvider = 'openrouter' | 'cloudflare' | 'gemini' | null | undefined;

interface EditorialHeaderProps {
  cycle: EditorialCycle;
  aiProvider?: AiProvider;
  aiModel?: string | null;
  generationStatus?: EditionGenerationStatus;
  generationError?: string | null;
}

/**
 * Testata dell'edizione.
 *
 * Oltre all'indicatore del provider (verde = token gratuiti, rosso = Gemini a pagamento)
 * espone ora lo stato reale della redazione: prima il front-end dichiarava "OpenRouter"
 * anche quando stava mostrando il ripiego canonico locale, rendendo invisibile ogni
 * fallimento della generazione.
 */
export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  cycle,
  aiProvider,
  aiModel,
  generationStatus = 'generated',
  generationError
}) => {
  const providerName =
    aiProvider === 'gemini'
      ? 'Google Gemini'
      : aiProvider === 'cloudflare'
        ? 'Cloudflare Workers AI'
        : aiProvider === 'openrouter'
          ? 'OpenRouter'
          : null;

  // verde: provider a token gratuiti · rosso: Gemini (token Google consumati) o generazione fallita
  const isGemini = aiProvider === 'gemini';
  const isFailed = generationStatus === 'failed';
  const isProvisional = generationStatus === 'generating' || generationStatus === 'placeholder';

  const dotColorClass = isFailed || isGemini
    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
    : isProvisional
      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse'
      : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';

  const statusLabel = isFailed
    ? `Redazione AI non riuscita${aiModel ? ` · Ultimo modello: ${aiModel}` : ''}${generationError ? ` — ${generationError}` : ''}`
    : isProvisional
      ? 'Redazione AI in corso: il testo mostrato è il canone locale provvisorio'
      : `Provider attivo: ${providerName ?? 'non dichiarato'}${isGemini ? ' (token Google consumati)' : ' (zero token Gemini consumati)'}${aiModel ? ` · Modello: ${aiModel}` : ''}`;

  const banner = isFailed
    ? {
        className: 'border-rose-300 bg-rose-50 text-rose-900',
        text: 'Redazione AI non riuscita — in lettura il canone ontologico locale di riserva',
        detail: generationError
      }
    : isProvisional
      ? {
          className: 'border-amber-300 bg-amber-50 text-amber-900',
          text: 'Redazione AI in corso — il saggio definitivo comparirà automaticamente',
          detail: 'Il testo attualmente in lettura è il canone ontologico locale provvisorio.'
        }
      : null;

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
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-72 whitespace-normal px-2.5 py-1.5 text-[10px] font-mono leading-relaxed tracking-normal normal-case text-[#ffffff] bg-[#1a1714] rounded shadow-md pointer-events-none"
          >
            {isFailed ? (
              <span className="text-rose-300 font-medium">● {statusLabel}</span>
            ) : isProvisional ? (
              <span className="text-amber-300 font-medium">● {statusLabel}</span>
            ) : (
              <span className={isGemini ? 'text-rose-300 font-medium' : 'text-emerald-300 font-medium'}>
                ● {statusLabel}
              </span>
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

      {banner && (
        <div
          id="ai-generation-banner"
          role="status"
          className={`mx-auto mt-4 max-w-xl border px-4 py-3 text-left font-mono text-[11px] leading-relaxed ${banner.className}`}
        >
          <div className="font-medium uppercase tracking-[0.15em]">{banner.text}</div>
          {banner.detail && <div className="mt-1 normal-case tracking-normal opacity-80">{banner.detail}</div>}
        </div>
      )}
    </header>
  );
};
