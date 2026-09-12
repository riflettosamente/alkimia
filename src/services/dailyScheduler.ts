/**
 * Modulo di Gestione della Schedulazione e Trigger Giornaliero di ALKIMIA.
 * 
 * Verifica autonomamente il cambio di data solare e coordina il caricamento
 * e la redazione del saggio quotidiano (alle 00:00).
 * Assicura in modo assoluto che la data di emissione della testata e la data
 * del Saggio del Giorno siano identiche.
 */

import { EditorialEdition, EditorialCycle } from '../types';
import { EDITORIAL_FEED, CURRENT_EDITORIAL_CYCLE } from '../data/mockEdition';
import { selectDailyVectorPair } from '../ai/ontologicalSystemPrompt';
import { 
  getSolarDateKey, 
  formatItalianDate, 
  getTimeUntilNextSolarMidnight, 
  formatTimeUntilNextCycle 
} from '../utils/dateUtils';

export { getSolarDateKey, formatItalianDate, formatTimeUntilNextCycle };
export const getTimeUntilNextSolarCycle = getTimeUntilNextSolarMidnight;

const CACHE_KEY_CURRENT = 'alkimia_daily_edition_cache_v12';
const CACHE_KEY_ARCHIVE = 'alkimia_chronological_archive_v12';

export interface DailyCachedPayload {
  solarDateKey: string;
  cycle: EditorialCycle;
  editions: EditorialEdition[];
  cachedAt: number;
}

/**
 * Legge lo stato persistito localmente dal browser per la data corrente.
 */
export function getLocalDailyCache(): DailyCachedPayload | null {
  try {
    // Pulisce cache obsolete e versioni pregresse
    [
      'ontological_daily_edition_cache',
      'ontological_daily_edition_cache_v2',
      'ontological_daily_edition_cache_v3',
      'ontological_daily_edition_cache_v4',
      'ontological_daily_edition_cache_v9',
      'ontological_daily_edition_cache_v10',
      'ontological_daily_edition_cache_v11'
    ].forEach(k => {
      if (localStorage.getItem(k)) localStorage.removeItem(k);
    });

    const raw = localStorage.getItem(CACHE_KEY_CURRENT);
    if (!raw) return null;
    const parsed: DailyCachedPayload = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Salva il saggio e il ciclo giornaliero nel localStorage locale.
 */
export function setLocalDailyCache(payload: DailyCachedPayload): void {
  try {
    localStorage.setItem(CACHE_KEY_CURRENT, JSON.stringify(payload));
    
    // Alimenta anche l'archivio cronologico locale
    const archiveRaw = localStorage.getItem(CACHE_KEY_ARCHIVE);
    let archive: EditorialEdition[] = [];
    if (archiveRaw) {
      try {
        archive = JSON.parse(archiveRaw);
      } catch {
        archive = [];
      }
    }

    const currentLead = payload.editions[0];
    if (currentLead && !archive.some(item => item.id === currentLead.id)) {
      const updatedArchive = [currentLead, ...archive];
      localStorage.setItem(CACHE_KEY_ARCHIVE, JSON.stringify(updatedArchive));
    }
  } catch {
    // Ignora errori di quota o incognito mode
  }
}

/**
 * Recupera l'archivio cronologico persistito.
 */
export function getLocalChronologicalArchive(): EditorialEdition[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY_ARCHIVE);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Verifica se la data solare memorizzata differisce dalla data corrente,
 * segnalando la necessità di elaborare e caricare il nuovo saggio delle 00:00.
 */
export function hasSolarDayChanged(storedDateKey: string): boolean {
  const currentKey = getSolarDateKey();
  return storedDateKey !== currentKey;
}

/**
 * Caricatore autonomo del Saggio del Giorno.
 * Sincronizza con l'endpoint server /api/daily-edition garantendo la perfetta uguaglianza
 * tra la data di emissione della testata e la data del Saggio del Giorno.
 */
export async function loadDailyEditionPayload(): Promise<{
  cycle: EditorialCycle;
  editions: EditorialEdition[];
}> {
  const todayKey = getSolarDateKey();
  const formattedToday = formatItalianDate(todayKey);
  const msUntilNext = getTimeUntilNextSolarMidnight();
  const cached = getLocalDailyCache();

  // 1. Se è già presente in cache locale per la data solare odierna, restituisce con conto alla rovescia aggiornato
  if (cached && cached.solarDateKey === todayKey && cached.editions && cached.editions.length > 0) {
    const cycleWithUpdatedCountdown: EditorialCycle = {
      ...cached.cycle,
      cyclicalDate: formattedToday,
      nextScheduledPublication: formatTimeUntilNextCycle(msUntilNext)
    };
    const editionsWithConsistentDate = cached.editions.map(ed => ({
      ...ed,
      cycle: {
        ...ed.cycle,
        cyclicalDate: formattedToday
      },
      systemPair: {
        ...ed.systemPair,
        derivationTimestamp: formattedToday
      }
    }));
    return {
      cycle: cycleWithUpdatedCountdown,
      editions: editionsWithConsistentDate
    };
  }

  // 2. Interrogazione del server backend per ottenere il saggio del giorno elaborato
  try {
    const res = await fetch(`/api/daily-edition?solarDate=${encodeURIComponent(todayKey)}`);
    if (res.ok) {
      const serverData = await res.json();
      if (serverData.success && serverData.edition && serverData.cycle) {
        const cycle: EditorialCycle = {
          ...serverData.cycle,
          cyclicalDate: formattedToday,
          nextScheduledPublication: formatTimeUntilNextCycle(msUntilNext)
        };

        const edition: EditorialEdition = {
          ...serverData.edition,
          cycle: {
            ...cycle,
            cyclicalDate: formattedToday
          },
          systemPair: {
            ...serverData.edition.systemPair,
            derivationTimestamp: formattedToday
          }
        };

        const payload: DailyCachedPayload = {
          solarDateKey: todayKey,
          cycle,
          editions: [edition],
          cachedAt: Date.now()
        };

        setLocalDailyCache(payload);

        return {
          cycle,
          editions: [edition]
        };
      }
    }
  } catch (err) {
    console.warn("Connessione /api/daily-edition non disponibile, applico fallback locale con date sincronizzate:", err);
  }

  // 3. Fallback locale deterministico rigorosamente allineato alla data solare odierna
  const dailyVectors = selectDailyVectorPair(todayKey);

  const fallbackCycle: EditorialCycle = {
    ...CURRENT_EDITORIAL_CYCLE,
    cyclicalDate: formattedToday,
    nextScheduledPublication: formatTimeUntilNextCycle(msUntilNext)
  };

  const fallbackEditions: EditorialEdition[] = EDITORIAL_FEED.map((ed, idx) => {
    if (idx === 0) {
      return {
        ...ed,
        cycle: {
          ...fallbackCycle,
          cyclicalDate: formattedToday
        },
        systemPair: {
          vectorA: dailyVectors.vectorA.name,
          vectorB: dailyVectors.vectorB.name,
          syntheticVector: `Collisione tra ${dailyVectors.vectorA.name} e ${dailyVectors.vectorB.name}`,
          ontologicalMatrix: "Soglia di fase tra entropia organica e conservazione dell'informazione non-locale",
          derivationTimestamp: formattedToday
        }
      };
    }
    return {
      ...ed,
      cycle: {
        ...ed.cycle,
        cyclicalDate: formattedToday
      }
    };
  });

  const payload: DailyCachedPayload = {
    solarDateKey: todayKey,
    cycle: fallbackCycle,
    editions: fallbackEditions,
    cachedAt: Date.now()
  };

  setLocalDailyCache(payload);

  return {
    cycle: fallbackCycle,
    editions: fallbackEditions
  };
}
