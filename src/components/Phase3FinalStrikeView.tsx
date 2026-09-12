import React, { useState } from 'react';
import { Phase3FinalStrike, SystemConceptualPair } from '../types';
import { buildPhase3FinalStrike } from '../data/canonicalFinalStrikes';
import { ShieldAlert, Lightbulb, SearchX, Target, Eye, Sparkles, Compass, GitCommit, ChevronRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Phase3FinalStrikeViewProps {
  systemPair: SystemConceptualPair;
  finalStrike?: Phase3FinalStrike;
}

export const Phase3FinalStrikeView: React.FC<Phase3FinalStrikeViewProps> = ({
  systemPair,
  finalStrike
}) => {
  const activeStrike = finalStrike || buildPhase3FinalStrike(
    systemPair.vectorA,
    systemPair.vectorB
  );

  const directionStrikes = activeStrike.directionStrikes || [];
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<number>(0);
  const [viewScope, setViewScope] = useState<'general' | 'directions'>('directions');

  const currentDirectionStrike = directionStrikes[selectedDirectionIndex] || directionStrikes[0];

  return (
    <motion.div
      id="phase3-final-strike-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      {/* Testata di Presentazione della Fase 4 */}
      <div className="border border-[#ded7ca] bg-[#ffffff] p-6 sm:p-8 rounded-sm space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#9e7627]">
          <Sparkles className="w-4 h-4" />
          <span>FASE 4: L'Affondo Finale (Il Sigillo della Ricerca)</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1a1714]">
            Manifesto Operativo dell'Indagine Speculativa
          </h2>
          <p className="text-sm sm:text-base text-[#3d3830] font-serif leading-relaxed italic border-l-2 border-[#b0872e] pl-4 py-1 bg-[#faf8f5]">
            «Trasformazione dell'intuizione speculativa in un manifesto operativo attraverso i cinque interrogativi strategici, declinati sull'asse complessivo e nelle 5 Direzioni del Loop di Fase 3.»
          </p>
        </div>

        {/* I due vettori al vaglio del sigillo */}
        <div className="pt-4 border-t border-[#ede7dc] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#6e685c]">
          <div className="bg-[#faf8f5] px-3 py-1.5 border border-[#ede7dc] rounded-sm">
            <span className="text-[#9e7627] font-semibold">Vettore A:</span> {systemPair.vectorA}
          </div>
          <div className="text-[#9e7627] flex items-center gap-1.5 font-semibold uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>5 Interrogativi × 5 Faglie Ontologiche</span>
          </div>
          <div className="bg-[#faf8f5] px-3 py-1.5 border border-[#ede7dc] rounded-sm">
            <span className="text-[#5c6e8c] font-semibold">Vettore B:</span> {systemPair.vectorB}
          </div>
        </div>
      </div>

      {/* Switch di Scopo: Le 5 Direzioni del Loop vs Sintesi Generale */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#f5f1ea] p-2 rounded-sm border border-[#ded7ca]">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#787164]">
            Prospettiva dell'Affondo:
          </span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            id="view-scope-directions"
            onClick={() => setViewScope('directions')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-mono rounded-sm transition-all cursor-pointer ${
              viewScope === 'directions'
                ? 'bg-[#ffffff] text-[#1a1714] font-semibold border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714]'
            }`}
          >
            Le 5 Direzioni del Loop
          </button>
          <button
            id="view-scope-general"
            onClick={() => setViewScope('general')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-mono rounded-sm transition-all cursor-pointer ${
              viewScope === 'general'
                ? 'bg-[#ffffff] text-[#1a1714] font-semibold border border-[#c49b45]/60 shadow-xs'
                : 'text-[#6e685c] hover:text-[#1a1714]'
            }`}
          >
            Sintesi Macro Generale
          </button>
        </div>
      </div>

      {/* Selettore a Tab per le 5 Direzioni quando viewScope === 'directions' */}
      {viewScope === 'directions' && directionStrikes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#787164] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#9e7627]" />
              <span>Seleziona la Direzione del Loop (Fase 3):</span>
            </span>
            <span className="text-xs font-mono text-[#9e7627] font-semibold">
              Direzione {selectedDirectionIndex + 1} di {directionStrikes.length}
            </span>
          </div>

          <div 
            role="tablist"
            aria-label="Le 5 direzioni dell'affondo finale"
            className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-1.5 bg-[#ede9e0] border border-[#d8d0c2] rounded-sm"
          >
            {directionStrikes.map((dir, idx) => {
              const isSelected = selectedDirectionIndex === idx;
              return (
                <button
                  key={dir.directionNumber}
                  id={`final-strike-dir-btn-${dir.directionNumber}`}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedDirectionIndex(idx)}
                  className={`text-left p-3 rounded-sm transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#ffffff] border-[#c49b45]/70 shadow-xs text-[#1a1714]'
                      : 'bg-[#faf8f5]/60 hover:bg-[#ffffff] border-transparent text-[#665f53]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-[#9e7627]' : 'text-[#8a8274]'}`}>
                      DIR #{dir.directionNumber}
                    </span>
                    {isSelected && <GitCommit className="w-3.5 h-3.5 text-[#9e7627]" />}
                  </div>
                  <div className="text-xs font-serif font-semibold mt-1 line-clamp-2 leading-tight">
                    {dir.directionTitle.split(':')[1]?.trim() || dir.directionTitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Intestazione della Direzione Selezionata */}
          {currentDirectionStrike && (
            <div className="p-4 bg-[#faf8f5] border border-[#ded7ca] rounded-sm space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#9e7627] font-semibold uppercase">
                <Compass className="w-4 h-4" />
                <span>{currentDirectionStrike.directionTitle}</span>
              </div>
              <p className="text-xs sm:text-sm font-serif text-[#3d3830] italic pl-6 border-l-2 border-[#9e7627]">
                {currentDirectionStrike.ontologicalAngle}
              </p>
            </div>
          )}
        </div>
      )}

      {/* I 5 Interrogativi Strategici (Dinamici per Direzione o Macro) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewScope === 'directions' ? `dir-${selectedDirectionIndex}` : 'general'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="space-y-8"
        >
          {(() => {
            const strikeData = viewScope === 'directions' && currentDirectionStrike 
              ? currentDirectionStrike 
              : activeStrike;

            return (
              <>
                {/* 1. Cui prodest? (A chi giova?) */}
                <div id="final-strike-q1" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
                  <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono font-bold text-[#9e7627]">§ 1</span>
                      <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                        Cui prodest? (A chi giova?)
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
                      Quale blocco culturale, riduzionista o dogmatico viene smantellato in questa direzione, restituendo centralità ontologica all'essere umano?
                    </p>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Smantellamento del Blocco Dogmatico</span>
                    </div>
                    <p className="text-sm sm:text-base font-serif text-[#2c2823] leading-relaxed">
                      {strikeData.cuiProdest}
                    </p>
                  </div>
                </div>

                {/* 2. Quale scoperta innovativa potremmo portare alla luce? */}
                <div id="final-strike-q2" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
                  <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono font-bold text-[#9e7627]">§ 2</span>
                      <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                        Quale scoperta innovativa potremmo portare alla luce?
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
                      La formulazione della nuova legge, principio o teoria unificante emersa dall'attrito di questa specifica faglia.
                    </p>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold">
                      <Lightbulb className="w-4 h-4" />
                      <span>Formulazione del Nuovo Principio Unificante</span>
                    </div>
                    <div className="p-5 bg-[#faf5ec] border border-[#e4d6be] rounded-sm shadow-2xs">
                      <p className="text-sm sm:text-base font-serif text-[#1f1c19] leading-relaxed font-medium">
                        {strikeData.groundbreakingDiscovery}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Cos'è che non abbiamo ancora investigato? */}
                <div id="final-strike-q3" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
                  <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono font-bold text-[#9e7627]">§ 3</span>
                      <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                        Cos'è che non abbiamo ancora investigato?
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
                      Il pregiudizio metodologico o il recinto disciplinare che finora ha impedito di collegare i due fenomeni.
                    </p>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8a4e32] font-semibold">
                      <SearchX className="w-4 h-4" />
                      <span>Il Recinto Disciplinare e il Pregiudizio Accademico</span>
                    </div>
                    <p className="text-sm sm:text-base font-serif text-[#2c2823] leading-relaxed">
                      {strikeData.uninvestigatedBias}
                    </p>
                  </div>
                </div>

                {/* 4. Dove dovremmo focalizzare la nostra ricerca? */}
                <div id="final-strike-q4" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
                  <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono font-bold text-[#9e7627]">§ 4</span>
                      <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                        Dove dovremmo focalizzare la nostra ricerca?
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
                      L'intersezione esatta tra discipline diverse (es. fisica topologica, biochimica, neurofenomenologia) in cui puntare i riflettori.
                    </p>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#475b7a] font-semibold">
                      <Target className="w-4 h-4" />
                      <span>Intersezione Transdisciplinare dei Riflettori</span>
                    </div>
                    <div className="p-5 bg-[#faf8f5] border border-[#ede7dc] rounded-sm">
                      <p className="text-sm sm:text-base font-serif text-[#2c2823] leading-relaxed">
                        {strikeData.researchFocusIntersection}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Cosa potremmo scoprire? (La Vertigine Finale) */}
                <div id="final-strike-q5" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
                  <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono font-bold text-[#9e7627]">§ 5</span>
                      <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                        Cosa potremmo scoprire? (La Vertigine Finale)
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
                      La vertigine finale: la svelazione di come è strutturata la "stanza" in cui viviamo e quali porte girevoli collegano i nostri mondi apparentemente separati.
                    </p>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold">
                      <Eye className="w-4 h-4" />
                      <span>La Svelazione della Stanza e delle Porte Girevoli</span>
                    </div>
                    <div className="p-6 bg-[#fbf9f4] border-l-2 border-[#b0872e] rounded-r-sm space-y-2">
                      <p className="text-base sm:text-lg font-serif italic text-[#1a1714] leading-relaxed">
                        «{strikeData.dizzyingRevelation}»
                      </p>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          {/* Navigatore Rapido Direzioni (visibile se in modalità direzioni) */}
          {viewScope === 'directions' && directionStrikes.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#ede7dc]">
              <button
                disabled={selectedDirectionIndex === 0}
                onClick={() => setSelectedDirectionIndex(prev => Math.max(0, prev - 1))}
                className="text-xs font-mono uppercase px-3.5 py-2 border border-[#ded7ca] rounded-sm bg-[#ffffff] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed text-[#474035]"
              >
                ← Direzione Precedente
              </button>
              <span className="text-xs font-mono text-[#787164]">
                Direzione {selectedDirectionIndex + 1} di {directionStrikes.length}
              </span>
              <button
                disabled={selectedDirectionIndex === directionStrikes.length - 1}
                onClick={() => setSelectedDirectionIndex(prev => Math.min(directionStrikes.length - 1, prev + 1))}
                className="text-xs font-mono uppercase px-3.5 py-2 border border-[#ded7ca] rounded-sm bg-[#ffffff] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed text-[#474035] flex items-center gap-1"
              >
                <span>Direzione Successiva</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
