import React from 'react';
import { Phase3FinalStrike, SystemConceptualPair } from '../types';
import { buildPhase3FinalStrike } from '../data/canonicalFinalStrikes';
import { ShieldAlert, Lightbulb, SearchX, Target, Eye, Sparkles, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface Phase3FinalStrikeViewProps {
  systemPair: SystemConceptualPair;
  finalStrike?: Phase3FinalStrike;
}

const FormattedText: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  const renderInline = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-[#1a1714] bg-[#f2ebd9] px-1 py-0.5 rounded-xs">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (paragraphs.length <= 1) {
    return <span>{renderInline(text)}</span>;
  }

  return (
    <div className="space-y-3.5">
      {paragraphs.map((para, idx) => (
        <p key={idx} className="leading-relaxed">
          {renderInline(para)}
        </p>
      ))}
    </div>
  );
};

export const Phase3FinalStrikeView: React.FC<Phase3FinalStrikeViewProps> = ({
  systemPair,
  finalStrike
}) => {
  const baseStrike = finalStrike || buildPhase3FinalStrike(
    systemPair.vectorA,
    systemPair.vectorB
  );

  // Pulisce eventuali espressioni forzate o da proclama rimaste in dossier generati con versioni precedenti del prompt,
  // rendendo subito più naturale e scorrevole anche la lettura delle edizioni già salvate su disco.
  const humanizeNarrativeTone = (raw: string): string => {
    if (!raw) return '';
    return raw
      .replace(/Viene scardinato il dogma/gi, 'Si supera la vecchia idea')
      .replace(/viene scardinato/gi, 'viene superato')
      .replace(/vengono scardinati/gi, 'vengono superati')
      .replace(/viene smantellato il dogma/gi, 'cade la vecchia convinzione')
      .replace(/viene smantellato/gi, 'cade')
      .replace(/vengono finalmente legittimati/gi, 'trovano finalmente una spiegazione coerente')
      .replace(/vengono legittimati/gi, 'trovano conferma')
      .replace(/ne escono legittimati/gi, 'acquistano un senso concreto')
      .replace(/monopolio interpretativo/gi, 'confine tradizionale');
  };

  // Se un dossier salvato in precedenza aveva il testo macro sintetico (< 420 caratteri)
  // e i dettagli distribuiti in directionStrikes, li fonde automaticamente nella Sintesi Macro Generale
  // così anche i dossier già generati risultano ricchi, completi e approfonditi.
  const enrichMacroField = (
    macroText: string | undefined,
    fieldKey: 'cuiProdest' | 'groundbreakingDiscovery' | 'uninvestigatedBias' | 'researchFocusIntersection' | 'dizzyingRevelation'
  ): string => {
    const base = humanizeNarrativeTone((macroText || '').trim());
    const dirs = Array.isArray(baseStrike.directionStrikes) ? baseStrike.directionStrikes : [];
    if (base.length >= 420 || dirs.length === 0) {
      return base;
    }
    const dirContributions = dirs
      .map(d => humanizeNarrativeTone((d[fieldKey] || '').trim()))
      .filter(t => t.length > 0 && !base.includes(t.slice(0, 40)));
    if (dirContributions.length === 0) return base;

    const firstWave = dirContributions.slice(0, 2).join(' ');
    const secondWave = dirContributions.slice(2, 5).join(' ');
    return [base, firstWave, secondWave].filter(Boolean).join('\n\n');
  };

  const activeStrike: Phase3FinalStrike = {
    cuiProdest: enrichMacroField(baseStrike.cuiProdest, 'cuiProdest'),
    groundbreakingDiscovery: enrichMacroField(baseStrike.groundbreakingDiscovery, 'groundbreakingDiscovery'),
    uninvestigatedBias: enrichMacroField(baseStrike.uninvestigatedBias, 'uninvestigatedBias'),
    researchFocusIntersection: enrichMacroField(baseStrike.researchFocusIntersection, 'researchFocusIntersection'),
    dizzyingRevelation: enrichMacroField(baseStrike.dizzyingRevelation, 'dizzyingRevelation'),
  };

  return (
    <motion.div
      id="phase3-final-strike-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      {/* Testata di Presentazione della Fase 5 */}
      <div className="border border-[#ded7ca] bg-[#ffffff] p-6 sm:p-8 rounded-sm space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#9e7627]">
          <Sparkles className="w-4 h-4" />
          <span>FASE 5: L'Affondo Finale • Sintesi Generale dell'Indagine</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1a1714]">
            Il Senso Complessivo dell'Incontro tra i Due Fenomeni
          </h2>
          <p className="text-sm sm:text-base text-[#3d3830] font-serif leading-relaxed italic border-l-2 border-[#b0872e] pl-4 py-1 bg-[#faf8f5]">
            «Tiriamo le fila del percorso compiuto: cosa cambia nel nostro modo di guardare i due argomenti, qual è il filo concreto che li unisce e come possiamo metterlo alla prova.»
          </p>
        </div>

        {/* I due argomenti al vaglio del sigillo */}
        <div className="pt-4 border-t border-[#ede7dc] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6e685c]">
          <div className="bg-[#faf8f5] px-3 py-1.5 border border-[#ede7dc] rounded-sm">
            <span className="text-[#9e7627] font-semibold">Primo Argomento:</span> {systemPair.vectorA}
          </div>
          <div className="text-[#9e7627] flex items-center gap-1.5 font-semibold uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>Sintesi Generale • 5 Tappe Conclusive</span>
          </div>
          <div className="bg-[#faf8f5] px-3 py-1.5 border border-[#ede7dc] rounded-sm">
            <span className="text-[#5c6e8c] font-semibold">Secondo Argomento:</span> {systemPair.vectorB}
          </div>
        </div>
      </div>

      {/* Le 5 Tappe Narrative della Sintesi Generale */}
      <div className="space-y-8">
        {/* 1. Cosa cambia nella nostra comprensione */}
        <div id="final-strike-q1" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 1</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Cosa cambia nella nostra comprensione (A chi giova questa indagine?)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Quale vecchia abitudine mentale viene superata e come le osservazioni storiche della Fase 2 acquistano un senso chiaro se lette insieme.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Il Superamento dei Confini Abituali</span>
            </div>
            <div className="text-sm sm:text-base font-serif text-[#2c2823] leading-relaxed">
              <FormattedText text={activeStrike.cuiProdest} />
            </div>
          </div>
        </div>

        {/* 2. Il filo invisibile che unisce i due fenomeni */}
        <div id="final-strike-q2" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 2</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Il filo invisibile che unisce i due fenomeni (La Scoperta)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Il meccanismo concreto — fisico, biologico o umano — che spiega perché i due argomenti rispondono alla stessa regola di fondo.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold">
              <Lightbulb className="w-4 h-4" />
              <span>Il Legame Profondo tra i Due Argomenti</span>
            </div>
            <div className="p-5 bg-[#faf5ec] border border-[#e4d6be] rounded-sm shadow-2xs">
              <div className="text-sm sm:text-base font-serif text-[#1f1c19] leading-relaxed font-medium">
                <FormattedText text={activeStrike.groundbreakingDiscovery} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Perché finora nessuno aveva unito i puntini */}
        <div id="final-strike-q3" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 3</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Perché finora nessuno aveva unito i puntini (L'Angolo Cieco)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Perché chi studia il primo argomento e chi indaga il secondo non si erano ancora accorti di osservare due facce dello stesso processo.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8a4e32] font-semibold">
              <SearchX className="w-4 h-4" />
              <span>La Distanza tra i Due Mondi di Ricerca</span>
            </div>
            <div className="text-sm sm:text-base font-serif text-[#2c2823] leading-relaxed">
              <FormattedText text={activeStrike.uninvestigatedBias} />
            </div>
          </div>
        </div>

        {/* 4. La prova sul campo */}
        <div id="final-strike-q4" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 4</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                La prova sul campo (Come verificarlo concretamente)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Un esperimento concreto e comprensibile che mette insieme gli strumenti e le osservazioni della Fase 2 per verificare questo legame.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#475b7a] font-semibold">
              <Target className="w-4 h-4" />
              <span>La Verifica Sperimentale Concreta</span>
            </div>
            <div className="p-5 bg-[#faf8f5] border border-[#ede7dc] rounded-sm">
              <div className="text-sm sm:text-base font-serif text-[#2c2823] leading-relaxed">
                <FormattedText text={activeStrike.researchFocusIntersection} />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Lo sguardo d'insieme */}
        <div id="final-strike-q5" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 5</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Lo sguardo d'insieme (Verso il Saggio del Giorno)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Il significato umano e filosofico dell'intero percorso compiuto, che apre la strada alla narrazione d'autore della Fase 6.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold">
              <Eye className="w-4 h-4" />
              <span>L'Orizzonte Conclusivo dell'Indagine</span>
            </div>
            <div className="p-6 bg-[#fbf9f4] border-l-2 border-[#b0872e] rounded-r-sm space-y-2">
              <div className="text-base sm:text-lg font-serif italic text-[#1a1714] leading-relaxed">
                <FormattedText text={activeStrike.dizzyingRevelation} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
