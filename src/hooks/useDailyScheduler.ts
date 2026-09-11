import { useState, useEffect, useCallback } from 'react';
import { EditorialEdition, EditorialCycle } from '../types';
import { EDITORIAL_FEED, CURRENT_EDITORIAL_CYCLE } from '../data/mockEdition';
import {
  getSolarDateKey,
  hasSolarDayChanged,
  getTimeUntilNextSolarCycle,
  loadDailyEditionPayload
} from '../services/dailyScheduler';

interface UseDailySchedulerResult {
  editions: EditorialEdition[];
  cycle: EditorialCycle;
  dateKey: string;
  isAutoRefreshing: boolean;
}

/**
 * Hook client-side per la schedulazione e il trigger giornaliero autonomo.
 * 
 * Verifica automaticamente il cambio di data solare e sincronizza il nuovo saggio
 * senza pulsanti di avvio, selettori o interventi dell'utente.
 */
export function useDailyScheduler(): UseDailySchedulerResult {
  const [dateKey, setDateKey] = useState<string>(() => getSolarDateKey());
  const [editions, setEditions] = useState<EditorialEdition[]>(EDITORIAL_FEED);
  const [cycle, setCycle] = useState<EditorialCycle>(CURRENT_EDITORIAL_CYCLE);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState<boolean>(false);

  // Procedura di caricamento silenzioso del saggio giornaliero
  const performSilentSync = useCallback(async () => {
    setIsAutoRefreshing(true);
    try {
      const payload = await loadDailyEditionPayload();
      setCycle(payload.cycle);
      setEditions(payload.editions);
      setDateKey(getSolarDateKey());
    } finally {
      setIsAutoRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Esecuzione immediata all'apertura dell'applicazione
    performSilentSync();

    // Timer programmato esattamente al cambio di giornata solare (mezzanotte UTC)
    let solarMidnightTimeout: ReturnType<typeof setTimeout>;

    const scheduleNextSolarTrigger = () => {
      const msUntilNext = getTimeUntilNextSolarCycle();
      solarMidnightTimeout = setTimeout(() => {
        performSilentSync();
        scheduleNextSolarTrigger();
      }, msUntilNext);
    };

    scheduleNextSolarTrigger();

    // Heartbeat periodico di controllo (ogni 60 secondi) e listener per il risveglio della finestra
    const intervalHeartbeat = setInterval(() => {
      if (hasSolarDayChanged(dateKey)) {
        performSilentSync();
      }
    }, 60000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasSolarDayChanged(dateKey)) {
        performSilentSync();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(solarMidnightTimeout);
      clearInterval(intervalHeartbeat);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dateKey, performSilentSync]);

  return {
    editions,
    cycle,
    dateKey,
    isAutoRefreshing
  };
}
