import React from 'react';
import { EditorialPipelineStep, EditorialTelemetry } from '../types';
import { Compass, Sparkles, Clock, ShieldCheck } from 'lucide-react';

interface AutonomousPipelineTrackerProps {
  pipeline: EditorialPipelineStep[];
  telemetry: EditorialTelemetry;
}

export const AutonomousPipelineTracker: React.FC<AutonomousPipelineTrackerProps> = ({
  telemetry
}) => {
  return (
    <div className="bg-[#111318] border border-[#222632] rounded-xs p-4 sm:p-5 text-[#ded9ce] font-serif shadow-xs">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#202430] gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#c49b45]" />
          <span className="font-mono text-xs font-semibold tracking-wider uppercase text-[#ccc5b8]">
            Stato del Ciclo Diurno • Telemetria di Lettura
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#8e8779] bg-[#171a22] border border-[#252a36] px-2.5 py-0.5 rounded-xs">
          Cadenza: {telemetry.cycleInterval}
        </span>
      </div>

      {/* Parametri di Monitoraggio Silenzioso */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 bg-[#141720] border border-[#232835] rounded-xs">
          <div className="text-[10px] font-mono text-[#8a8275] uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#c49b45]" />
            Indice di Coerenza
          </div>
          <div className="font-mono text-base font-bold text-[#e6ded2]">
            {(telemetry.coherenceIndex * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-[#736d62] font-mono mt-0.5">Assiomatizzazione verificata</div>
        </div>

        <div className="p-3 bg-[#141720] border border-[#232835] rounded-xs">
          <div className="text-[10px] font-mono text-[#8a8275] uppercase tracking-wider mb-1">
            Tensione Dialettica
          </div>
          <div className="font-mono text-base font-bold text-[#e0b968]">
            {(telemetry.dialecticalTension * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-[#736d62] font-mono mt-0.5">Polarità in equilibrio</div>
        </div>

        <div className="p-3 bg-[#141720] border border-[#232835] rounded-xs">
          <div className="text-[10px] font-mono text-[#8a8275] uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#c49b45]" />
            Rotazione
          </div>
          <div className="font-mono text-sm font-semibold text-[#f2ede4] truncate">
            24h Autonome
          </div>
          <div className="text-[10px] text-[#736d62] font-mono mt-0.5">Persistenza attiva</div>
        </div>

        <div className="p-3 bg-[#141720] border border-[#232835] rounded-xs">
          <div className="text-[10px] font-mono text-[#8a8275] uppercase tracking-wider mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Stato
          </div>
          <div className="font-mono text-sm font-semibold text-emerald-400">
            Cristallizzato
          </div>
          <div className="text-[10px] text-[#736d62] font-mono mt-0.5">Lettura contemplativa</div>
        </div>
      </div>

      {/* Banner di stabilità silenziosa */}
      <div className="pt-2 border-t border-[#1d212b] flex items-center justify-between text-xs font-mono text-[#8a8275]">
        <span>Nessun intervento richiesto • Emissione gestita automaticamente dal ciclo solare</span>
        <span className="text-[#c49b45] font-serif italic text-xs hidden sm:inline">«Tutto ciò che è, è integralmente esposto»</span>
      </div>

    </div>
  );
};
