/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EditorialFeed } from './components/EditorialFeed';
import { useDailyScheduler } from './hooks/useDailyScheduler';

export default function App() {
  const { editions, cycle } = useDailyScheduler();

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#e4dfd5] font-serif">
      {/* Feed editoriale verticale continuo con testata incorporata direttamente nella pagina principale */}
      <EditorialFeed 
        editions={editions} 
        cycle={cycle} 
      />
    </div>
  );
}

