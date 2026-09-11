import React from 'react';
import { SystemConceptualPair } from '../types';
import { Lock, Cpu } from 'lucide-react';

interface SystemConceptualPairHeaderProps {
  systemPair: SystemConceptualPair;
  editionNumber: string;
  isLatest: boolean;
}

export const SystemConceptualPairHeader: React.FC<SystemConceptualPairHeaderProps> = ({
  systemPair,
  editionNumber,
  isLatest,
}) => {
  return (
    <div className={`border rounded-xs p-4 sm:p-5 font-serif transition-colors ${
      isLatest 
        ? 'bg-[#121419] border-[#252a35] shadow-xs' 
        : 'bg-[#0f1115] border-[#1d212a] opacity-90'
    }`}>
      {/* System Derivation Banner: No dropdowns, no buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#232733] gap-2 font-mono text-[11px]">
        <div className="flex items-center gap-2 text-[#a8a193]">
          <Cpu className="w-3.5 h-3.5 text-[#c49b45]" />
          <span className="font-semibold uppercase tracking-wider text-[#dcd7cb]">
            Accoppiamento Concettuale Determinato dal Sistema
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-2xs bg-[#1a1e27] text-[#91897c] border border-[#292f3d]">
            <Lock className="w-2.5 h-2.5" />
            Invariante Sistemica a 24h
          </span>
        </div>
        <div className="text-[10px] text-[#787266] tracking-tight">
          {systemPair.derivationTimestamp}
        </div>
      </div>

      {/* The Two Vector Poles and Synthetic Vector Horizon */}
      <div className="pt-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Vector A */}
        <div className="md:col-span-4 p-3.5 bg-[#171a22] border border-[#272d3a] rounded-xs space-y-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#c76352] font-semibold block">
            Vettore Ontologico Primario [α]
          </span>
          <div className="text-sm sm:text-[15px] font-serif font-bold text-[#f0ebe0] leading-snug">
            {systemPair.vectorA}
          </div>
        </div>

        {/* Dialectical Axis indicator */}
        <div className="md:col-span-1 flex justify-center py-1 md:py-0">
          <div className="w-7 h-7 rounded-full bg-[#1b1f29] border border-[#2d3444] flex items-center justify-center font-mono text-xs text-[#a39c8f] shadow-xs select-none">
            ⇄
          </div>
        </div>

        {/* Vector B */}
        <div className="md:col-span-4 p-3.5 bg-[#171a22] border border-[#272d3a] rounded-xs space-y-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#5a93bf] font-semibold block">
            Vettore Ontologico Antitetico [β]
          </span>
          <div className="text-sm sm:text-[15px] font-serif font-bold text-[#f0ebe0] leading-snug">
            {systemPair.vectorB}
          </div>
        </div>

        {/* Synthetic Vector Horizon */}
        <div className="md:col-span-3 p-3.5 bg-[#151720] border border-[#252b38] rounded-xs space-y-1">
          <span className="text-[9px] font-mono tracking-widest uppercase text-[#a8905b] font-semibold block">
            Orizzonte Sintetico
          </span>
          <div className="text-xs font-serif font-medium text-[#ded8cb] leading-tight line-clamp-2">
            {systemPair.syntheticVector}
          </div>
          <div className="text-[9px] font-mono text-[#6e685c] pt-1 border-t border-[#232834]">
            {systemPair.ontologicalMatrix}
          </div>
        </div>

      </div>

      <div className="mt-2.5 pt-2 border-t border-[#1f232d] text-[10px] font-mono text-[#736d61] flex items-center justify-between">
        <span>Selezione e orientamento dei vettori generati autonomamente dal nucleo analitico.</span>
        <span className="text-[#8e8779]">{editionNumber}</span>
      </div>
    </div>
  );
};
