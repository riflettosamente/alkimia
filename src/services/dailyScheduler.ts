/**
 * Modulo di Gestione della Schedulazione e Trigger Giornaliero.
 * 
 * Verifica autonomamente il cambio di data solare e coordina il caricamento
 * del saggio quotidiano, azzerando qualsiasi controllo manuale o selettore utente.
 */

import { EditorialEdition, EditorialCycle } from '../types';
import { EDITORIAL_FEED, CURRENT_EDITORIAL_CYCLE } from '../data/mockEdition';

const CACHE_KEY_CURRENT = 'ontological_daily_edition_cache_v2';
const CACHE_KEY_ARCHIVE = 'ontological_chronological_archive_v2';

export interface DailyCachedPayload {
  solarDateKey: string;
  cycle: EditorialCycle;
  editions: EditorialEdition[];
  cachedAt: number;
}

/**
 * Restituisce la chiave della data solare odierna (formato YYYY-MM-DD UTC).
 */
export function getSolarDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Legge lo stato persistito localmente dal browser.
 */
export function getLocalDailyCache(): DailyCachedPayload | null {
  try {
    // Pulisce vecchie cache v1 obsolete se presenti
    if (localStorage.getItem('ontological_daily_edition_cache')) {
      localStorage.removeItem('ontological_daily_edition_cache');
    }
    const raw = localStorage.getItem(CACHE_KEY_CURRENT);
    if (!raw) return null;
    const parsed: DailyCachedPayload = JSON.parse(raw);
    // Se la cache non ha i nuovi paragrafi narrativi, invalida per aggiornare
    if (!parsed.editions?.[0]?.essay?.narrativeParagraphs) {
      localStorage.removeItem(CACHE_KEY_CURRENT);
      return null;
    }
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
    
    // Alimenta anche l'archivio cronologico locale pulito
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
    // Ignora errori di quota o privacy mode
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
 * Calcola i millisecondi mancanti al prossimo cambio di giornata solare (00:00 UTC).
 */
export function getTimeUntilNextSolarCycle(): number {
  const now = new Date();
  const nextMidnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ));
  return Math.max(1000, nextMidnight.getTime() - now.getTime());
}

/**
 * Formatta il tempo rimanente al prossimo ciclo in una stringa leggibile per la telemetria.
 */
export function formatTimeUntilNextCycle(msRemaining: number): string {
  const totalSeconds = Math.floor(msRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `Al compimento della rotazione diurna (tra ${hours}h ${minutes}m)`;
}

/**
 * Verifica se la data solare memorizzata differisce dalla data corrente,
 * segnalando la necessità di caricare un nuovo fascicolo.
 */
export function hasSolarDayChanged(storedDateKey: string): boolean {
  const currentKey = getSolarDateKey();
  return storedDateKey !== currentKey;
}

/**
 * Caricatore autonomo del saggio e dell'edizione giornaliera con Caching Locale.
 * Se esiste una copia valida per la data solare corrente in localStorage,
 * blocca la visualizzazione sul saggio del giorno corrente impedendo ricaricamenti superflui.
 */
export async function loadDailyEditionPayload(): Promise<{
  cycle: EditorialCycle;
  editions: EditorialEdition[];
}> {
  const todayKey = getSolarDateKey();
  const cached = getLocalDailyCache();

  // Se è già presente la copia per la data solare odierna, la restituisce immediatamente
  if (cached && cached.solarDateKey === todayKey && cached.editions && cached.editions.length > 0) {
    const msUntilNext = getTimeUntilNextSolarCycle();
    const cycleWithUpdatedCountdown: EditorialCycle = {
      ...cached.cycle,
      nextScheduledPublication: formatTimeUntilNextCycle(msUntilNext)
    };
    return {
      cycle: cycleWithUpdatedCountdown,
      editions: cached.editions
    };
  }

  // Altrimenti carica/inizializza il fascicolo giornaliero e lo fissa in cache
  const msUntilNext = getTimeUntilNextSolarCycle();
  const updatedCycle: EditorialCycle = {
    ...CURRENT_EDITORIAL_CYCLE,
    nextScheduledPublication: formatTimeUntilNextCycle(msUntilNext),
    cyclicalDate: `Data Solare: ${todayKey} • Meditazione Diurna Attiva`
  };

  const payload: DailyCachedPayload = {
    solarDateKey: todayKey,
    cycle: updatedCycle,
    editions: EDITORIAL_FEED,
    cachedAt: Date.now()
  };

  setLocalDailyCache(payload);

  return {
    cycle: updatedCycle,
    editions: EDITORIAL_FEED
  };
}
