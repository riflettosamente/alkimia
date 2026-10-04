import React from 'react';
import { Phase1EmpiricalArchive, EmpiricalTopicArchive, SystemConceptualPair } from '../types';
import { buildPhase1EmpiricalArchive } from '../data/canonicalEmpiricalArchive';
import { BookOpen, Users, Activity, Lightbulb, Layers, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface EmpiricalArchiveSectionProps {
  systemPair?: SystemConceptualPair;
  archive?: Phase1EmpiricalArchive;
}

/**
 * Helper per formattare il testo con evidenziazione dinamica dei grassetti (**nome**).
 */
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-[#1a1714] bg-[#f2ebd9] px-1 py-0.5 rounded-xs">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </span>
  );
};

const ArchiveTopicCard: React.FC<{
  archiveData: EmpiricalTopicArchive;
  borderColorClass: string;
}> = ({ archiveData, borderColorClass }) => {
  // Pulisce il nome dell'argomento rimuovendo eventuali prefissi vettoriali (es. "1. Gli UFO" o "Vettore A")
  const cleanTopicName = archiveData.topicName.replace(/^(Vettore\s+[A-Z]|Argomento\s+[I|V]+|\d+\.)\s*/i, '');

  return (
    <div className={`bg-[#ffffff] border border-[#ded7ca] rounded-sm p-6 space-y-6 shadow-xs ${borderColorClass}`}>
      {/* Intestazione diretta dell'argomento (Senza Vettore A / Vettore B) */}
      <div className="pb-3 border-b border-[#ede7dc]">
        <h3 className="text-xl font-serif text-[#1a1714] font-bold tracking-tight">
          {cleanTopicName}
        </h3>
      </div>

      {/* I 4 Pilastri Concreti */}
      <div className="space-y-4">
        {/* 1. Testi e Supporti Fondativi */}
        <div className="bg-[#faf8f5] rounded-sm p-4 border border-[#eee8dd]">
          <div className="flex items-center gap-2 text-[#9e7627] font-mono text-xs font-semibold mb-1.5">
            <BookOpen className="w-4 h-4 text-[#9e7627] shrink-0" />
            <span className="uppercase tracking-wider">Testi, Dossier e Opere Fondative</span>
          </div>
          <p className="text-sm text-[#3d3830] font-serif leading-relaxed">
            <FormattedText text={archiveData.foundationalTexts} />
          </p>
        </div>

        {/* 2. Figure e Testimoni */}
        <div className="bg-[#faf8f5] rounded-sm p-4 border border-[#eee8dd]">
          <div className="flex items-center gap-2 text-[#2c5282] font-mono text-xs font-semibold mb-1.5">
            <Users className="w-4 h-4 text-[#2c5282] shrink-0" />
            <span className="uppercase tracking-wider">Scienziati, Pionieri e Testimoni Chiave</span>
          </div>
          <p className="text-sm text-[#3d3830] font-serif leading-relaxed">
            <FormattedText text={archiveData.keyFiguresAndWitnesses} />
          </p>
        </div>

        {/* 3. Reperti, Strumenti e Misurazioni */}
        <div className="bg-[#faf8f5] rounded-sm p-4 border border-[#eee8dd]">
          <div className="flex items-center gap-2 text-[#276749] font-mono text-xs font-semibold mb-1.5">
            <Activity className="w-4 h-4 text-[#276749] shrink-0" />
            <span className="uppercase tracking-wider">Reperti, Strumenti e Misurazioni</span>
          </div>
          <p className="text-sm text-[#3d3830] font-serif leading-relaxed">
            <FormattedText text={archiveData.materialEvidenceAndTools} />
          </p>
        </div>

        {/* 4. Paradigmi e Teorie di Svolta */}
        <div className="bg-[#faf8f5] rounded-sm p-4 border border-[#eee8dd]">
          <div className="flex items-center gap-2 text-[#6b46c1] font-mono text-xs font-semibold mb-1.5">
            <Lightbulb className="w-4 h-4 text-[#6b46c1] shrink-0" />
            <span className="uppercase tracking-wider">Paradigmi e Teorie di Svolta</span>
          </div>
          <p className="text-sm text-[#3d3830] font-serif leading-relaxed">
            <FormattedText text={archiveData.breakthroughTheories} />
          </p>
        </div>
      </div>
    </div>
  );
};

export const EmpiricalArchiveSection: React.FC<EmpiricalArchiveSectionProps> = ({
  systemPair,
  archive
}) => {
  const topicA = systemPair?.vectorA || "Primo Argomento";
  const topicB = systemPair?.vectorB || "Secondo Argomento";

  const activeArchive = archive || buildPhase1EmpiricalArchive(topicA, topicB);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 my-8"
    >
      {/* Testata della Sezione */}
      <div className="border border-[#ded7ca] bg-[#ffffff] p-6 sm:p-8 rounded-sm space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#9e7627]">
          <Database className="w-4 h-4" />
          <span>FASE 2: Archivio dei Fatti e dei Reperti Concreti (Ancoraggio Empirico)</span>
        </div>
        
        <p className="text-sm sm:text-base text-[#3d3830] font-serif leading-relaxed">
          Censimento sistematico della massa critica di supporto accumulata dalla civiltà umana: opere fondative, testimonianze dirette, strumentazioni di laboratorio, tracciati e modelli interpretativi.
        </p>
      </div>

      {/* Griglia a Due Colonne affiancate per gli Argomenti */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ArchiveTopicCard
          archiveData={activeArchive.vectorA}
          borderColorClass="border-l-4 border-l-[#b0872e]"
        />
        <ArchiveTopicCard
          archiveData={activeArchive.vectorB}
          borderColorClass="border-l-4 border-l-[#5c6e8c]"
        />
      </div>

      {/* Sintesi e Incrocio dell'Archivio Materiale */}
      {activeArchive.crossArchiveSynthesis && (
        <div className="bg-[#faf8f5] border border-[#d8c088] rounded-sm p-6 shadow-xs">
          <div className="flex items-center gap-2 text-[#9e7627] font-mono text-xs font-semibold mb-2 uppercase tracking-widest">
            <Layers className="w-4 h-4 text-[#9e7627] shrink-0" />
            Incrocio e Convergenza dei Reperti Materiali
          </div>
          <p className="text-base font-serif text-[#2a241e] leading-relaxed italic">
            "<FormattedText text={activeArchive.crossArchiveSynthesis} />"
          </p>
        </div>
      )}
    </motion.section>
  );
};
