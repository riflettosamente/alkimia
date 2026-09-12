import React from 'react';
import { Phase2CollisionDecomposition, SystemConceptualPair } from '../types';
import { buildPhase2Collision } from '../data/canonicalCollisions';
import { Zap, GitMerge, Unlink, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Phase2CollisionViewProps {
  systemPair: SystemConceptualPair;
  collision?: Phase2CollisionDecomposition;
}

export const Phase2CollisionView: React.FC<Phase2CollisionViewProps> = ({
  systemPair,
  collision
}) => {
  const activeCollision = collision || buildPhase2Collision(
    systemPair.vectorA,
    systemPair.vectorB
  );

  const {
    step1StrippingFunction,
    step2BlindAxis,
    step3InvertedDirection,
    step4CommonMetaphor
  } = activeCollision;

  return (
    <motion.div
      id="phase2-collision-view"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-10"
    >
      {/* Intestazione e Regola d'Oro della Fase 2 */}
      <div className="border border-[#ded7ca] bg-[#ffffff] p-6 sm:p-8 rounded-sm space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#9e7627]">
          <Zap className="w-4 h-4" />
          <span>FASE 2: La Collisione (I 4 Passaggi)</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1a1714]">
            Attrito Profondo e Asimmetrie Radicanti
          </h2>
          <p className="text-sm sm:text-base text-[#3d3830] font-serif leading-relaxed italic border-l-2 border-[#b0872e] pl-4 py-1 bg-[#faf8f5]">
            «La regola d'oro per trovare un punto di contatto radicale e non banale tra due argomenti non sta nel cercare le somiglianze superficiali, ma nel portare alla luce la struttura profonda condivisa (l'infrastruttura) e poi far collidere le loro asimmetrie.»
          </p>
        </div>

        {/* I due vettori in rotta di collisione */}
        <div className="pt-4 border-t border-[#ede7dc] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-1/2 bg-[#faf8f5] p-4 border-l-2 border-[#b0872e] rounded-r-sm">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#787164] block mb-1">
              Vettore A
            </span>
            <h3 className="text-base font-serif text-[#1a1714] font-semibold">
              {systemPair.vectorA}
            </h3>
          </div>

          <div className="text-[#9e7627] font-mono text-xs font-bold px-2 py-1 bg-[#f5efe6] rounded-full border border-[#ded7ca] flex items-center gap-1">
            <GitMerge className="w-3.5 h-3.5" />
            <span>COLLISIONE</span>
          </div>

          <div className="w-full sm:w-1/2 bg-[#faf8f5] p-4 border-l-2 border-[#5c6e8c] rounded-r-sm">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#787164] block mb-1">
              Vettore B
            </span>
            <h3 className="text-base font-serif text-[#1a1714] font-semibold">
              {systemPair.vectorB}
            </h3>
          </div>
        </div>
      </div>

      {/* I 4 Passaggi della Collisione */}
      <div className="space-y-8">

        {/* 1. Denudare i concetti (Il "Trapianto di Funzione") */}
        <div id="collision-step-1" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 1</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Denudare i concetti (Il "Trapianto di Funzione")
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Dimentica a cosa serve ciascun argomento nella realtà empirica e guarda cosa fa sul piano astratto.
            </p>
            <div className="mt-2 pl-5 text-xs font-mono text-[#9e7627] font-medium">
              Regola: Chiediti: "Qual è il verbo fondamentale che compie questo sistema?"
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <span className="text-xs font-mono font-bold text-[#9e7627] block uppercase">
                  Verbo Fondamentale [A] • {systemPair.vectorA}
                </span>
                <p className="text-sm font-serif font-semibold text-[#1a1714]">
                  {step1StrippingFunction.fundamentalVerbA}
                </p>
                <p className="text-xs sm:text-sm text-[#3d3830] font-serif leading-relaxed">
                  {step1StrippingFunction.abstractFunctionA}
                </p>
              </div>

              <div className="p-4 bg-[#fcfbfa] border border-[#ede7dc] rounded-sm space-y-2">
                <span className="text-xs font-mono font-bold text-[#475b7a] block uppercase">
                  Verbo Fondamentale [B] • {systemPair.vectorB}
                </span>
                <p className="text-sm font-serif font-semibold text-[#1a1714]">
                  {step1StrippingFunction.fundamentalVerbB}
                </p>
                <p className="text-xs sm:text-sm text-[#3d3830] font-serif leading-relaxed">
                  {step1StrippingFunction.abstractFunctionB}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#fbf9f4] border-l-2 border-[#b0872e] text-xs sm:text-sm font-serif text-[#2c2823] leading-relaxed">
              <span className="font-mono text-xs uppercase tracking-wider text-[#9e7627] font-semibold block mb-1">
                Sintesi del Trapianto Funzionale:
              </span>
              {step1StrippingFunction.functionalSynthesis}
            </div>
          </div>
        </div>

        {/* 2. Cercare l'Asse Cieco (Dove si toccano gli estremi) */}
        <div id="collision-step-2" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 2</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Cercare l'Asse Cieco (Dove si toccano gli estremi)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Gli argomenti non si incontrano dove sono simili, ma dove l'uno diventa la prosecuzione o la crepa dell'altro.
            </p>
            <div className="mt-2 pl-5 text-xs font-mono text-[#9e7627] font-medium">
              Regola: Prendi il limite o il confine del primo argomento e usalo come strumento d'accesso per il secondo.
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#8a4e32] font-semibold uppercase">
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Limite / Confine del Primo Argomento (A)</span>
                </div>
                <p className="text-sm text-[#2c2823] font-serif leading-relaxed">
                  {step2BlindAxis.boundaryA}
                </p>
              </div>

              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#475b7a] font-semibold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Strumento d'Accesso al Secondo Argomento (B)</span>
                </div>
                <p className="text-sm text-[#2c2823] font-serif leading-relaxed">
                  {step2BlindAxis.accessDoorToB}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#f8f6f0] border-l-2 border-[#b0872e] rounded-r-sm space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold block">
                Punto di Contatto sulla Crepa:
              </span>
              <p className="text-sm font-serif text-[#1f1c19] leading-relaxed italic">
                {step2BlindAxis.creviceContactPoint}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Ribaltare la Direzione (Il cortocircuito logico) */}
        <div id="collision-step-3" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 3</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Ribaltare la Direzione (Il cortocircuito logico)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Di solito associamo un argomento al suo contesto naturale. Per trovare l'inedito, inverti i domini.
            </p>
            <div className="mt-2 pl-5 text-xs font-mono text-[#9e7627] font-medium">
              Regola: Prendi il metodo o lo strumento di un argomento e applicalo al problema dell'altro.
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#9e7627] font-semibold uppercase">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Inversione dei Domini Operativi</span>
              </div>
              <p className="text-sm font-serif text-[#2c2823] leading-relaxed">
                {step3InvertedDirection.methodAAppliedToB}
              </p>
            </div>

            {/* Il Quesito Provocatorio */}
            <div className="p-5 bg-[#faf5ec] border border-[#e4d6be] rounded-sm space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#9e7627] uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>Quesito di Violazione Concettuale:</span>
              </div>
              <p className="text-base sm:text-lg font-serif font-semibold text-[#1a1714] leading-relaxed italic">
                «{step3InvertedDirection.provocativeViolationQuestion}»
              </p>
            </div>

            <div className="p-4 bg-[#fbf9f4] border-l-2 border-[#5c6e8c] text-xs sm:text-sm font-serif text-[#2c2823] leading-relaxed">
              <span className="font-mono text-xs uppercase tracking-wider text-[#475b7a] font-semibold block mb-1">
                Intuizione Contro-Intuitiva (Cortocircuito):
              </span>
              {step3InvertedDirection.counterIntuitiveInsight}
            </div>
          </div>
        </div>

        {/* 4. Isolare la Metafora Comune */}
        <div id="collision-step-4" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 4</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Isolare la Metafora Comune
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Alla fine, la vera connessione innovativa deve poggiare su una grande metafora antropologica o cosmologica che li unisce entrambi.
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="text-center py-4 border-b border-[#ede7dc] space-y-2">
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#9e7627] uppercase">
                Grande Metafora Architetturale
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1a1714]">
                {step4CommonMetaphor.masterMetaphorTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#787164] font-semibold block">
                  Radice Antropologica / Cosmologica
                </span>
                <p className="text-sm text-[#3d3830] font-serif leading-relaxed">
                  {step4CommonMetaphor.cosmologicalAnthropologicalGround}
                </p>
              </div>

              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold block">
                  Visione Unificante Finale
                </span>
                <p className="text-sm text-[#1a1714] font-serif font-medium leading-relaxed">
                  {step4CommonMetaphor.unifyingVision}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
