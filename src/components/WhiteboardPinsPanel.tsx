import React from 'react';
import { WhiteboardPin, DialecticalTension } from '../types';
import { Pin, Scale, FileText } from 'lucide-react';

interface WhiteboardPinsPanelProps {
  pins: WhiteboardPin[];
  tensions: DialecticalTension[];
}

export const WhiteboardPinsPanel: React.FC<WhiteboardPinsPanelProps> = ({ pins, tensions }) => {
  return (
    <aside className="space-y-6">
      
      {/* Pinned Evidence Notes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#242937] pb-2.5">
          <Pin className="w-4 h-4 text-[#c49b45]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[#d4cfc5]">
            Reperti & Postulati Fissati
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {pins.map((pin) => {
            return (
              <div 
                key={pin.id} 
                className="relative bg-[#151821] p-4 sm:p-5 border border-[#272d3b] shadow-xs rounded-xs font-serif transition-transform"
                style={{ transform: `rotate(${pin.rotationDeg || 0}deg)` }}
              >
                {/* Visual Pin Head */}
                <div className="absolute -top-2 right-4 w-3.5 h-3.5 rounded-full bg-[#9e4638] border border-[#521c13] shadow-xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#fcedeb]" />
                </div>

                <div className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#c49b45] mb-2 flex items-center gap-1">
                  <span>{pin.marker}</span>
                </div>

                <p className="text-sm sm:text-[15px] text-[#ebe6dd] leading-relaxed italic mb-3">
                  "{pin.text}"
                </p>

                <div className="text-[10px] font-mono text-[#827b6f] pt-2 border-t border-[#222734]">
                  {pin.context}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialectical Tensions Board */}
      <div className="bg-[#12141a] border border-[#232734] p-4.5 rounded-xs font-serif space-y-3.5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#222735] pb-2.5">
          <Scale className="w-4 h-4 text-[#c49b45]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[#d4cfc5]">
            Tensioni Dialettiche Attive
          </h3>
        </div>

        <div className="space-y-3">
          {tensions.map((item) => (
            <div key={item.id} className="bg-[#171a23] border border-[#292f3f] p-3.5 rounded-xs space-y-2 text-xs">
              <div className="text-[10px] font-mono uppercase text-[#857e72]">
                Ambito: {item.field}
              </div>
              
              <div className="flex items-center justify-between text-xs sm:text-[13px] font-serif font-semibold text-[#f0ebe2] gap-2">
                <span className="text-[#c76352]">{item.poleA}</span>
                <span className="font-mono text-[11px] text-[#7e776a]">⇄</span>
                <span className="text-[#5a93bf]">{item.poleB}</span>
              </div>

              <div className="text-[11px] font-mono text-[#b3ac9e] bg-[#12141c] px-2.5 py-1 rounded-xs border border-[#222633]">
                Stato: <span className="font-medium text-[#eae5db]">{item.state}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ontological Codex Notice */}
      <div className="bg-[#0e1014] text-[#d9d3c7] p-4.5 rounded-xs font-serif text-xs space-y-2.5 border border-[#1f232d]">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#c49b45] flex items-center gap-1.5 font-semibold">
          <FileText className="w-3.5 h-3.5" />
          Nota dell'Automa
        </div>
        <p className="leading-relaxed text-[#aba294] font-serif text-xs">
          Questo dispositivo opera ad invarianza ermeneutica: la lettura contemplativa non ammette confutazioni istantanee, ma richiede la metabolizzazione della tesi ontologica nel corso dell'intera rotazione diurna.
        </p>
        <div className="font-mono text-[10px] text-[#706a5f] pt-1">
          Flusso speculativo autonomo v1.0
        </div>
      </div>

    </aside>
  );
};
