import React from 'react';
import { EditorialEdition, EditorialCycle } from '../types';
import { EditorialHeader } from './EditorialHeader';
import { EditorialEditionEntry } from './EditorialEditionEntry';

interface EditorialFeedProps {
  editions: EditorialEdition[];
  cycle: EditorialCycle;
}

export const EditorialFeed: React.FC<EditorialFeedProps> = ({ editions, cycle }) => {
  const currentEdition = editions[0];

  if (!currentEdition) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#24211e] pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        
        {/* Testata dell'Applicazione */}
        <EditorialHeader cycle={cycle} />

        {/* Unico Articolo Generato */}
        <div>
          <EditorialEditionEntry 
            edition={currentEdition} 
            index={0} 
          />
        </div>

      </div>
    </main>
  );
};
