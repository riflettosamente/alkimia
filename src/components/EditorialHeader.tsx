import React, { useState } from 'react';
import { EditorialCycle, EditionGenerationStatus, PhaseTelemetryItem } from '../types';
import { Calendar } from 'lucide-react';

type AiProvider = 'openai' | 'groq' | 'openrouter' | 'cloudflare' | 'gemini' | null | undefined;

interface EditorialHeaderProps {
  cycle: EditorialCycle;
  aiProvider?: AiProvider;
  aiModel?: string | null;
  phaseTelemetry?: PhaseTelemetryItem[];
  generationStatus?: EditionGenerationStatus;
  generationError?: string | null;
}

const DEFAULT_PHASE_TITLES: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "Fase 1 · Scomposizione",
  2: "Fase 2 · Archivio Empirico",
  3: "Fase 3 · La Collisione",
  4: "Fase 4 · Loop 5 Direzioni",
  5: "Fase 5 · L'Affondo Finale",
  6: "Fase 6 · Saggio del Giorno"
};

function formatShortProvider(provider?: string | null): string {
  switch (provider) {
    case 'openai':
      return 'OpenAI';
    case 'groq':
      return 'Groq';
    case 'openrouter':
      return 'OpenRouter';
    case 'cloudflare':
      return 'Cloudflare';
    case 'gemini':
      return 'Gemini';
    case 'local':
      return 'Locale';
    default:
      return 'In attesa';
  }
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  cycle,
  aiProvider,
  aiModel,
  phaseTelemetry,
  generationStatus = 'generated',
  generationError
}) => {
  const [selectedPhasePopup, setSelectedPhasePopup] = useState<number | null>(null);

  const isFailed = generationStatus === 'failed';
  const isProvisional = generationStatus === 'generating' || generationStatus === 'placeholder';

  const normalizedPhases: PhaseTelemetryItem[] = ([1, 2, 3, 4, 5, 6] as const).map((num) => {
    const found = phaseTelemetry?.find((p) => p.phaseNumber === num);
    if (found) return found;

    const isOverallGenerated = generationStatus === 'generated';
    return {
      phaseNumber: num,
      phaseTitle: DEFAULT_PHASE_TITLES[num],
      status: isOverallGenerated ? 'completed' : 'pending',
      provider: isOverallGenerated ? (aiProvider || 'groq') : null,
      model: isOverallGenerated ? (aiModel || 'openai/gpt-oss-120b') : null,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      completedAt: null
    };
  });

  const completedCount = normalizedPhases.filter(
    (p) => p.status === 'completed' || p.status === 'fallback'
  ).length;

  const banner = isFailed
    ? {
        className: 'border-rose-300 bg-rose-50 text-rose-900',
        text: 'Redazione AI non riuscita — in lettura il canone ontologico locale di riserva',
        detail: generationError
      }
    : isProvisional && completedCount < 6
      ? {
          className: 'border-amber-300 bg-amber-50 text-amber-900',
          text: `Redazione AI sequenziale in corso (${completedCount}/6 Fasi completate)`,
          detail: 'I sei indicatori qui sopra diventano verdi man mano che ciascuna fase viene completata.'
        }
      : null;

  return (
    <header className="border-b border-[#ded7ca] pb-8 pt-4 text-center space-y-2.5">
      {/* Sopratitolo centrato */}
      <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#736c60]">
        <span>Indagine Ontologica Quotidiana</span>
      </div>

      {/* 6 Marcatori rotondi minimali sotto Indagine Ontologica Quotidiana */}
      <div
        id="six-phases-telemetry-bar"
        className="flex items-center justify-center gap-3 py-0.5"
        aria-label="Stato di compilazione delle 6 Fasi"
      >
        {normalizedPhases.map((phase) => {
          const isCompleted = phase.status === 'completed';
          const isGenerating = phase.status === 'generating';
          const isFallback = phase.status === 'fallback';
          const isGemini = phase.provider === 'gemini';
          const isOpen = selectedPhasePopup === phase.phaseNumber;

          const dotClass =
            isCompleted && !isGemini
              ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.55)]'
              : isGenerating
                ? 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)] animate-pulse'
                : isFallback || isGemini
                  ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.55)]'
                  : 'bg-[#cfc8ba]';

          const cleanTitle = DEFAULT_PHASE_TITLES[phase.phaseNumber] || phase.phaseTitle;
          const llmLine = phase.model
            ? `${formatShortProvider(phase.provider)} · ${phase.model}`
            : isGenerating
              ? 'Elaborazione in corso...'
              : 'In coda';

          const tokenLine =
            phase.totalTokens > 0
              ? `${phase.totalTokens.toLocaleString('it-IT')} token (${phase.promptTokens.toLocaleString('it-IT')} in · ${phase.completionTokens.toLocaleString('it-IT')} out)`
              : isGenerating
                ? 'Conteggio token in corso...'
                : '0 token';

          return (
            <div
              key={phase.phaseNumber}
              className="relative flex items-center justify-center group"
              onMouseEnter={() => setSelectedPhasePopup(phase.phaseNumber)}
              onMouseLeave={() => setSelectedPhasePopup((prev) => (prev === phase.phaseNumber ? null : prev))}
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedPhasePopup((prev) => (prev === phase.phaseNumber ? null : phase.phaseNumber))
                }
                aria-label={`${cleanTitle}: ${llmLine} — ${tokenLine}`}
                className="p-1 flex items-center justify-center cursor-help focus:outline-none"
              >
                <span className={`w-2 h-2 rounded-full ${dotClass} transition-colors duration-300`} />
              </button>

              {/* Micro-tooltip minimale a 3 righe */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 w-max max-w-64 px-2.5 py-1.5 text-left font-mono text-[10px] leading-snug text-[#f7f5f0] bg-[#1a1714]/95 rounded-xs shadow-md pointer-events-none ${
                  isOpen ? 'block' : 'hidden group-hover:block'
                }`}
              >
                <div className="text-[#e8c678] font-medium">{cleanTitle}</div>
                <div className="text-[#ffffff] truncate">{llmLine}</div>
                <div className="text-[#b8b0a2]">{tokenLine}</div>
              </div>
            </div>
          );
        })}
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
