import React, { useState } from 'react';
import { Phase2LoopFiveDirections, SystemConceptualPair } from '../types';
import { normalizePhase2Loop } from '../utils/phase2LoopUtils';
import { Compass, Repeat, GitCommit, Unlink, Sparkles, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Phase2LoopFiveDirectionsViewProps {
  systemPair: SystemConceptualPair;
  loop?: Phase2LoopFiveDirections;
}

export const Phase2LoopFiveDirectionsView: React.FC<Phase2LoopFiveDirectionsViewProps> = ({
  systemPair,
  loop
}) => {
  const activeLoop = normalizePhase2Loop(
    loop,
    systemPair?.vectorA || '',
    systemPair?.vectorB || ''
  );

  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);
  const currentTrack = activeLoop?.tracks?.[selectedTrackIndex] || activeLoop?.tracks?.[0];
  const collision = currentTrack?.collision;

  return (
    <motion.div
      id="phase2-loop-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      {/* Testata di Presentazione della Fase 4 */}
      <div className="border border-[#ded7ca] bg-[#ffffff] p-6 sm:p-8 rounded-sm space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#9e7627]">
          <Repeat className="w-4 h-4" />
          <span>FASE 4: Loop a 5 Direzioni</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1a1714]">
            Il Protocollo a Vuoto: Cinque Faglie Ontologiche
          </h2>
          <p className="text-sm sm:text-base text-[#3d3830] font-serif leading-relaxed italic border-l-2 border-[#b0872e] pl-4 py-1 bg-[#faf8f5]">
            «Applica la collisione attraverso lo stesso binario d'indagine con cinque angolazioni differenti, costringendo i protocolli tecnici, gli strumenti di rilevazione e i reperti storici censiti nella Fase 2 (Archivio Empirico) a girare a vuoto in cerca di attriti sempre nuovi, svelando cinque diverse faglie ontologiche.»
          </p>
        </div>

        <div className="pt-2 text-xs sm:text-sm text-[#575043] font-serif leading-relaxed">
          {activeLoop?.theoreticalPreamble}
        </div>

        {/* I due argomenti del binario concettuale */}
        <div className="pt-4 border-t border-[#ede7dc] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="bg-[#faf8f5] px-3 py-1.5 border border-[#ede7dc] rounded-sm text-[#787164]">
            <span className="text-[#9e7627] font-semibold">Primo Argomento:</span> {systemPair?.vectorA || 'Primo Argomento'}
          </div>
          <div className="text-[#9e7627] flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase font-semibold">5 Inclinazioni di Faglia</span>
          </div>
          <div className="bg-[#faf8f5] px-3 py-1.5 border border-[#ede7dc] rounded-sm text-[#787164]">
            <span className="text-[#5c6e8c] font-semibold">Secondo Argomento:</span> {systemPair?.vectorB || 'Secondo Argomento'}
          </div>
        </div>
      </div>

      {/* Selettore delle 5 Direzioni Ontologiche */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono uppercase tracking-widest text-[#787164]">
            Seleziona la Direzione di Collisione (1 – 5):
          </span>
          <span className="text-xs font-mono text-[#9e7627] font-semibold">
            {selectedTrackIndex + 1} di {activeLoop?.tracks?.length || 5}
          </span>
        </div>

        <div 
          role="tablist" 
          aria-label="Le 5 direzioni del loop ontologico"
          className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-1.5 bg-[#ede9e0] border border-[#d8d0c2] rounded-sm"
        >
          {activeLoop?.tracks?.map((track, idx) => {
            const isSelected = selectedTrackIndex === idx;
            const uniqueKey = `track-dir-tab-${track.directionNumber ?? (idx + 1)}-${idx}-${track.id || 'dir'}`;
            return (
              <button
                key={uniqueKey}
                id={`track-btn-${track.directionNumber || idx + 1}`}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedTrackIndex(idx)}
                className={`text-left p-3 rounded-sm transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#ffffff] border-[#c49b45]/70 shadow-xs text-[#1a1714]'
                    : 'bg-[#faf8f5]/60 hover:bg-[#ffffff] border-transparent text-[#665f53]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-[#9e7627]' : 'text-[#8a8274]'}`}>
                    DIR #{track.directionNumber || idx + 1}
                  </span>
                  {isSelected && <GitCommit className="w-3.5 h-3.5 text-[#9e7627]" />}
                </div>
                <div className="text-xs font-serif font-semibold mt-1 line-clamp-2 leading-tight">
                  {track.directionTitle?.split(':')[1]?.trim() || track.directionTitle || `Direzione ${idx + 1}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dettaglio della Direzione Selezionata con i 4 Passaggi Integrali */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`active-track-motion-${currentTrack?.directionNumber || selectedTrackIndex}-${selectedTrackIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {/* Card di sintesi della direzione */}
          <div className="p-5 bg-[#faf8f5] border border-[#ded7ca] rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#9e7627] font-semibold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Direzione {currentTrack?.directionNumber || selectedTrackIndex + 1} • {currentTrack?.directionTitle || 'Direzione Ontologica'}</span>
            </div>
            <p className="text-sm font-serif text-[#2c2823] leading-relaxed italic pl-6 border-l-2 border-[#9e7627]">
              {currentTrack?.ontologicalAngle || 'Angolazione ontologica di indagine.'}
            </p>
          </div>

          {/* I 4 passaggi della direzione attiva */}
          <div className="space-y-6">

            {/* Passo 1 */}
            <div className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
              <div className="bg-[#f5f1ea] px-5 py-3 border-b border-[#ded7ca] flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono font-bold text-[#9e7627]">§ 1</span>
                  <h4 className="text-sm sm:text-base font-serif text-[#1a1714] font-semibold">
                    Denudare i concetti (Trapianto di Funzione)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-[#787164]">Verbi Fondamentali</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-1.5">
                    <span className="text-xs font-mono font-bold text-[#9e7627] block uppercase">
                      Verbo del Primo Argomento: {collision?.step1StrippingFunction?.fundamentalVerbA || 'Trasporre'}
                    </span>
                    <p className="text-xs sm:text-sm text-[#3d3830] font-serif leading-relaxed">
                      {collision?.step1StrippingFunction?.abstractFunctionA || 'Funzione astratta primaria del primo argomento.'}
                    </p>
                  </div>
                  <div className="p-4 bg-[#fcfbfa] border border-[#ede7dc] rounded-sm space-y-1.5">
                    <span className="text-xs font-mono font-bold text-[#475b7a] block uppercase">
                      Verbo del Secondo Argomento: {collision?.step1StrippingFunction?.fundamentalVerbB || 'Persistere'}
                    </span>
                    <p className="text-xs sm:text-sm text-[#3d3830] font-serif leading-relaxed">
                      {collision?.step1StrippingFunction?.abstractFunctionB || 'Funzione astratta primaria del secondo argomento.'}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 bg-[#fbf9f4] border-l-2 border-[#b0872e] text-xs sm:text-sm font-serif text-[#2c2823] leading-relaxed">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#9e7627] font-semibold block mb-0.5">
                    Sintesi Funzionale:
                  </span>
                  {collision?.step1StrippingFunction?.functionalSynthesis || 'Sintesi del punto di contatto tra i due verbi fondamentali.'}
                </div>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
              <div className="bg-[#f5f1ea] px-5 py-3 border-b border-[#ded7ca] flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono font-bold text-[#9e7627]">§ 2</span>
                  <h4 className="text-sm sm:text-base font-serif text-[#1a1714] font-semibold">
                    Cercare l'Asse Cieco (Dove si toccano gli estremi)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-[#787164]">Punto di Contatto</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-1">
                    <div className="flex items-center gap-1 text-xs font-mono text-[#8a4e32] font-semibold uppercase">
                      <Unlink className="w-3.5 h-3.5" />
                      <span>Limite Strumentale del Primo Argomento</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#2c2823] font-serif leading-relaxed">
                      {collision?.step2BlindAxis?.boundaryA || 'Limite estremo dell\'apparato strumentale del primo argomento.'}
                    </p>
                  </div>
                  <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-1">
                    <div className="flex items-center gap-1 text-xs font-mono text-[#475b7a] font-semibold uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Varco d'Accesso al Secondo Argomento</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#2c2823] font-serif leading-relaxed">
                      {collision?.step2BlindAxis?.accessDoorToB || 'Varco d\'accesso che si dischiude verso il secondo argomento.'}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 bg-[#f8f6f0] border-l-2 border-[#b0872e] text-xs sm:text-sm font-serif text-[#1f1c19] leading-relaxed italic">
                  <span className="font-mono not-italic text-xs uppercase tracking-wider text-[#9e7627] font-semibold block mb-0.5">
                    Crepa Asimmetrica:
                  </span>
                  {collision?.step2BlindAxis?.creviceContactPoint || 'Punto di fessurazione in cui le due polarità divergono.'}
                </div>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
              <div className="bg-[#f5f1ea] px-5 py-3 border-b border-[#ded7ca] flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono font-bold text-[#9e7627]">§ 3</span>
                  <h4 className="text-sm sm:text-base font-serif text-[#1a1714] font-semibold">
                    Ribaltare la Direzione (Il Cortocircuito Logico)
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-[#787164]">Inversione Operativa</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="p-3.5 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#9e7627] font-semibold uppercase">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Metodo Invertito</span>
                  </div>
                  <p className="text-xs sm:text-sm font-serif text-[#2c2823] leading-relaxed">
                    {collision?.step3InvertedDirection?.methodAAppliedToB || 'Applicazione della logica del primo vettore all\'orizzonte del secondo.'}
                  </p>
                </div>

                <div className="p-4 bg-[#faf5ec] border border-[#e4d6be] rounded-sm space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#9e7627] uppercase">
                    <HelpCircle className="w-4 h-4" />
                    <span>Quesito Provocatorio di Violazione:</span>
                  </div>
                  <p className="text-sm sm:text-base font-serif font-semibold text-[#1a1714] leading-relaxed italic">
                    «{collision?.step3InvertedDirection?.provocativeViolationQuestion || 'Quale anomalia si spalanca ribaltando la direzione dello sguardo?'}»
                  </p>
                </div>

                <div className="p-3.5 bg-[#fbf9f4] border-l-2 border-[#5c6e8c] text-xs sm:text-sm font-serif text-[#2c2823] leading-relaxed">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#475b7a] font-semibold block mb-0.5">
                    Intuizione Contro-Intuitiva:
                  </span>
                  {collision?.step3InvertedDirection?.counterIntuitiveInsight || 'Il cortocircuito logico svela un presupposto implicito del paradigma.'}
                </div>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
              <div className="bg-[#f5f1ea] px-5 py-3 border-b border-[#ded7ca] flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono font-bold text-[#9e7627]">§ 4</span>
                  <h4 className="text-sm sm:text-base font-serif text-[#1a1714] font-semibold">
                    Isolare la Metafora Comune
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-[#787164]">Simbolo Archetipale</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="text-center py-3 border-b border-[#ede7dc] space-y-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#9e7627] uppercase">
                    Metafora Architetturale
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#1a1714]">
                    {collision?.step4CommonMetaphor?.masterMetaphorTitle || 'LA SOGLIA DEL VELATO'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#787164] font-semibold block">
                      Radice Cosmologica / Antropologica
                    </span>
                    <p className="text-xs sm:text-sm text-[#3d3830] font-serif leading-relaxed">
                      {collision?.step4CommonMetaphor?.cosmologicalAnthropologicalGround || 'Fondamento antropologico comune ai due domini d\'indagine.'}
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold block">
                      Visione d'Insieme
                    </span>
                    <p className="text-xs sm:text-sm text-[#1a1714] font-serif font-medium leading-relaxed">
                      {collision?.step4CommonMetaphor?.unifyingVision || 'La convergenza organica che riannoda i due fenomeni in un unico continuum.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Navigatore rapido tra le direzioni */}
          <div className="flex items-center justify-between pt-2 border-t border-[#ede7dc]">
            <button
              disabled={selectedTrackIndex === 0}
              onClick={() => setSelectedTrackIndex(prev => Math.max(0, prev - 1))}
              className="text-xs font-mono uppercase px-3 py-1.5 border border-[#ded7ca] rounded-sm bg-[#ffffff] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed text-[#474035]"
            >
              ← Direzione Precedente
            </button>
            <span className="text-xs font-mono text-[#787164]">
              {selectedTrackIndex + 1} di {activeLoop.tracks.length}
            </span>
            <button
              disabled={selectedTrackIndex === activeLoop.tracks.length - 1}
              onClick={() => setSelectedTrackIndex(prev => Math.min(activeLoop.tracks.length - 1, prev + 1))}
              className="text-xs font-mono uppercase px-3 py-1.5 border border-[#ded7ca] rounded-sm bg-[#ffffff] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed text-[#474035] flex items-center gap-1"
            >
              <span>Direzione Successiva</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

