import React from 'react';
import { EditorialEdition, EditorialCycle } from '../types';
import { EditorialHeader } from './EditorialHeader';
import { EditorialEditionEntry } from './EditorialEditionEntry';
import { Scroll, Layers, Clock } from 'lucide-react';

interface EditorialFeedProps {
  editions: EditorialEdition[];
  cycle: EditorialCycle;
}

export const EditorialFeed: React.FC<EditorialFeedProps> = ({ editions, cycle }) => {
  return (
    <main className="min-h-screen bg-investigative-grid bg-[#0b0c0e] text-[#ded9ce] pb-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 space-y-10 sm:space-y-12">
        
        {/* Testata editoriale incorporata organicamente nella pagina principale */}
        <EditorialHeader cycle={cycle} />

        {/* Continuous Feed Philosophy Ribbon with generous margins */}
        <div className="bg-[#12141a] border border-[#232835] p-4 sm:p-5 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-serif text-[#b8b1a3] shadow-lg">
          <div className="flex items-center gap-3">
            <Scroll className="w-4 h-4 text-[#c49b45] shrink-0" />
            <div>
              <span className="font-semibold text-[#ede8de] block sm:inline sm:mr-2">
                Flusso Cronologico di Lettura Contemplativa:
              </span>
              <span className="italic text-[#999183]">
                Il saggio del giorno presiede in primo piano con margini estesi e interlinea aperta, seguito dai cicli ontologici archiviati.
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#9e9688] self-start md:self-auto shrink-0 bg-[#171a23] border border-[#262c3b] px-3 py-1.5 rounded-xs">
            <Layers className="w-3.5 h-3.5 text-[#c49b45]" />
            <span>{editions.length} Fascicoli Ordinati Cronologicamente</span>
          </div>
        </div>

        {/* Continuous Vertical Feed */}
        <div className="space-y-16 sm:space-y-24">
          {editions.map((edition, idx) => (
            <React.Fragment key={edition.id}>
              {/* If transitioning into archived entries, render an archival delimiter with generous vertical pause */}
              {idx > 0 && (
                <div className="relative py-10 sm:py-14 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-dashed border-[#262b38]" />
                  </div>
                  <div className="relative bg-[#0b0c0e] border border-[#222733] px-5 py-1.5 text-center font-mono text-[11px] text-[#8e8779] flex items-center gap-2.5 rounded-xs shadow-md">
                    <Clock className="w-3.5 h-3.5 text-[#c49b45]" />
                    <span className="uppercase tracking-[0.18em] font-semibold text-[#b8b0a2]">
                      Transizione Cronologica • Ciclo -{idx * 24} Ore • Archivio
                    </span>
                  </div>
                </div>
              )}

              <EditorialEditionEntry 
                edition={edition} 
                index={idx} 
              />
            </React.Fragment>
          ))}
        </div>

        {/* Continuous Scroll Terminal Seal */}
        <footer className="pt-20 border-t border-[#202532] text-center font-serif text-xs text-[#8a8376] space-y-3">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#c49b45] font-semibold">
            Fine del Registro Visualizzato • Sincronizzazione Temporale Continua
          </div>
          <p className="max-w-xl mx-auto leading-relaxed text-[#9e9689]">
            I trattati speculativi permangono nel flusso cronologico senza scadenza né alterazione. La successione dei vettori è calcolata a livello sistemico per garantire la progressione dell'indagine ontologica.
          </p>
          <div className="text-[10px] font-mono text-[#6e685c]">
            Generazione autonoma • Nessun controllo manuale • Lettura contemplativa aperta
          </div>
        </footer>

      </div>
    </main>
  );
};
