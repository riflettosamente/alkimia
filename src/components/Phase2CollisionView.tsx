import React from 'react';
import { Phase2CollisionDecomposition, SystemConceptualPair } from '../types';
import { normalizePhase2Collision } from '../utils/phase2CollisionUtils';
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
  const activeCollision = normalizePhase2Collision(
    collision,
    systemPair?.vectorA || '',
    systemPair?.vectorB || ''
  );

  const step1StrippingFunction = activeCollision?.step1StrippingFunction;
  const step2BlindAxis = activeCollision?.step2BlindAxis;
  const step3InvertedDirection = activeCollision?.step3InvertedDirection;
  const step4CommonMetaphor = activeCollision?.step4CommonMetaphor;

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

        {/* I due argomenti in rotta di collisione */}
        <div className="pt-4 border-t border-[#ede7dc] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-1/2 bg-[#faf8f5] p-4 border-l-2 border-[#b0872e] rounded-r-sm">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#9e7627] block mb-1">
              Primo Argomento
            </span>
            <h3 className="text-base font-serif text-[#1a1714] font-semibold">
              {systemPair?.vectorA || 'Primo Argomento'}
            </h3>
          </div>

          <div className="text-[#9e7627] font-mono text-xs font-bold px-2 py-1 bg-[#f5efe6] rounded-full border border-[#ded7ca] flex items-center gap-1">
            <GitMerge className="w-3.5 h-3.5" />
            <span>COLLISIONE</span>
          </div>

          <div className="w-full sm:w-1/2 bg-[#faf8f5] p-4 border-l-2 border-[#5c6e8c] rounded-r-sm">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#475b7a] block mb-1">
              Secondo Argomento
            </span>
            <h3 className="text-base font-serif text-[#1a1714] font-semibold">
              {systemPair?.vectorB || 'Secondo Argomento'}
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
              Dai gesti tecnici e dagli apparati dell'Archivio Empirico al verbo ontologico primario.
            </p>
            <div className="mt-2 pl-5 text-xs font-mono text-[#9e7627] font-medium">
              Regola: Chiediti: "Qual è il gesto operativo fondamentale che l'uomo compie con questo strumento o protocollo?"
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <span className="text-xs font-mono font-bold text-[#9e7627] block uppercase">
                  Verbo Fondamentale • {systemPair?.vectorA || 'Primo Argomento'}
                </span>
                <p className="text-sm font-serif font-semibold text-[#1a1714]">
                  {step1StrippingFunction?.fundamentalVerbA || 'VIOLARE'}
                </p>
                <p className="text-xs sm:text-sm text-[#3d3830] font-serif leading-relaxed">
                  {step1StrippingFunction?.abstractFunctionA || 'Funzione astratta primaria radicata negli apparati empirici.'}
                </p>
              </div>

              <div className="p-4 bg-[#fcfbfa] border border-[#ede7dc] rounded-sm space-y-2">
                <span className="text-xs font-mono font-bold text-[#475b7a] block uppercase">
                  Verbo Fondamentale • {systemPair?.vectorB || 'Secondo Argomento'}
                </span>
                <p className="text-sm font-serif font-semibold text-[#1a1714]">
                  {step1StrippingFunction?.fundamentalVerbB || 'ESTENDERE'}
                </p>
                <p className="text-xs sm:text-sm text-[#3d3830] font-serif leading-relaxed">
                  {step1StrippingFunction?.abstractFunctionB || 'Funzione astratta primaria radicata negli apparati empirici.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#fbf9f4] border-l-2 border-[#b0872e] text-xs sm:text-sm font-serif text-[#2c2823] leading-relaxed">
              <span className="font-mono text-xs uppercase tracking-wider text-[#9e7627] font-semibold block mb-1">
                Sintesi del Trapianto Funzionale:
              </span>
              {step1StrippingFunction?.functionalSynthesis || 'Sintesi del punto di contatto tra i due gesti operativi.'}
            </div>
          </div>
        </div>

        {/* 2. Cercare l'Asse Cieco (L'Impotenza dello Strumento di Misura) */}
        <div id="collision-step-2" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 2</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Cercare l'Asse Cieco (L'Impotenza dello Strumento di Misura)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Gli argomenti non si incontrano dove sono simili, ma dove lo strumento materiale tocca il suo vicolo cieco insuperabile.
            </p>
            <div className="mt-2 pl-5 text-xs font-mono text-[#9e7627] font-medium">
              Regola: Prendi il limite fisico o di risoluzione dello strumento del primo argomento e usalo come varco d'accesso al secondo.
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#8a4e32] font-semibold uppercase">
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Limite / Vicolo Cieco dello Strumento</span>
                </div>
                <p className="text-sm text-[#2c2823] font-serif leading-relaxed">
                  {step2BlindAxis?.boundaryA || 'Limite estremo dell\'operatività dello strumento materiale.'}
                </p>
              </div>

              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#475b7a] font-semibold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Varco d'Accesso Verso il Secondo Argomento</span>
                </div>
                <p className="text-sm text-[#2c2823] font-serif leading-relaxed">
                  {step2BlindAxis?.accessDoorToB || 'Varco d\'accesso che si dischiude dove lo strumento cessa di misurare.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#f8f6f0] border-l-2 border-[#b0872e] rounded-r-sm space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold block">
                Punto di Contatto sulla Crepa:
              </span>
              <p className="text-sm font-serif text-[#1f1c19] leading-relaxed italic">
                {step2BlindAxis?.creviceContactPoint || 'Punto di fessurazione in cui le due polarità divergono.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Ribaltare la Direzione (L'Esperimento Mentale di Laboratorio Incrociato) */}
        <div id="collision-step-3" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 3</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Ribaltare la Direzione (L'Esperimento di Laboratorio Incrociato)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Applicare gli apparati di rilevazione, i radar o i campioni di un dominio direttamente al fenomeno dell'altro.
            </p>
            <div className="mt-2 pl-5 text-xs font-mono text-[#9e7627] font-medium">
              Regola: Prendi lo strumento tecnologico reale del primo argomento e puntalo brutalmente sul materiale del secondo.
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#9e7627] font-semibold uppercase">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Inversione dei Domini e Sperimentazione Incrociata</span>
              </div>
              <p className="text-sm font-serif text-[#2c2823] leading-relaxed">
                {step3InvertedDirection?.methodAAppliedToB || 'Applicazione della logica sperimentale del primo apparato all\'orizzonte del secondo.'}
              </p>
            </div>

            {/* Il Quesito Provocatorio */}
            <div className="p-5 bg-[#faf5ec] border border-[#e4d6be] rounded-sm space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#9e7627] uppercase">
                <HelpCircle className="w-4 h-4" />
                <span>Quesito di Violazione Sperimentale:</span>
              </div>
              <p className="text-base sm:text-lg font-serif font-semibold text-[#1a1714] leading-relaxed italic">
                «{step3InvertedDirection?.provocativeViolationQuestion || 'Quale anomalia si spalanca puntando questo strumento sul dominio opposto?'}»
              </p>
            </div>

            <div className="p-4 bg-[#fbf9f4] border-l-2 border-[#5c6e8c] text-xs sm:text-sm font-serif text-[#2c2823] leading-relaxed">
              <span className="font-mono text-xs uppercase tracking-wider text-[#475b7a] font-semibold block mb-1">
                Intuizione Contro-Intuitiva (Cortocircuito):
              </span>
              {step3InvertedDirection?.counterIntuitiveInsight || 'Il cortocircuito logico svela un presupposto implicito del paradigma.'}
            </div>
          </div>
        </div>

        {/* 4. Isolare la Metafora Comune (Il Reperto Unificante) */}
        <div id="collision-step-4" className="border border-[#ded7ca] bg-[#ffffff] rounded-sm overflow-hidden shadow-xs">
          <div className="bg-[#f5f1ea] px-5 py-4 border-b border-[#ded7ca]">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono font-bold text-[#9e7627]">§ 4</span>
              <h4 className="text-base font-serif text-[#1a1714] font-semibold">
                Isolare la Metafora Comune (Il Reperto e il Sostrato Unificante)
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#665f53] font-serif italic mt-1 pl-5">
              Il sostrato materiale comune in cui i due ordini di tracce e supporti umani si fondono a livello sistemico.
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="text-center py-4 border-b border-[#ede7dc] space-y-2">
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#9e7627] uppercase">
                Grande Metafora Architetturale
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1a1714]">
                {step4CommonMetaphor?.masterMetaphorTitle || 'LA SOGLIA DEL VELATO'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#787164] font-semibold block">
                  Radice Antropologica / Cosmologica
                </span>
                <p className="text-sm text-[#3d3830] font-serif leading-relaxed">
                  {step4CommonMetaphor?.cosmologicalAnthropologicalGround || 'Fondamento antropologico comune ai due domini d\'indagine.'}
                </p>
              </div>

              <div className="p-4 bg-[#faf8f5] border border-[#ede7dc] rounded-sm space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#9e7627] font-semibold block">
                  Visione Unificante Finale
                </span>
                <p className="text-sm text-[#1a1714] font-serif font-medium leading-relaxed">
                  {step4CommonMetaphor?.unifyingVision || 'La convergenza organica che riannoda i due fenomeni in un unico continuum.'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
