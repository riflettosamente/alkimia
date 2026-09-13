import { useState, useEffect, useCallback } from 'react';
import { EditorialEdition, EditorialCycle } from '../types';
import { EDITORIAL_FEED, CURRENT_EDITORIAL_CYCLE } from '../data/mockEdition';
import {
  getSolarDateKey,
  hasSolarDayChanged,
  getTimeUntilNextSolarCycle,
  loadDailyEditionPayload,
  PROVISIONAL_POLL_INTERVAL_MS
} from '../services/dailyScheduler';

interface UseDailySchedulerResult {
  editions: EditorialEdition[];
  cycle: EditorialCycle;
  dateKey: string;
  isAutoRefreshing: boolean;
  /** `true` finché il saggio mostrato non è quello definitivo prodotto dall'AI. */
  isProvisional: boolean;
}

/**
 * Hook client-side per la schedulazione e il trigger giornaliero autonomo.
 *
 * Verifica automaticamente il cambio di data solare e sincronizza il nuovo saggio
 * senza pulsanti di avvio, selettori o interventi dell'utente.
 *
 * La redazione del saggio avviene sul server e richiede tempo: finché il contenuto è
 * provvisorio l'hook continua a interrogare il backend, così il lettore vede comparire
 * il saggio reale senza dover ricaricare la pagina.
 */
export function useDailyScheduler(): UseDailySchedulerResult {
  const [dateKey, setDateKey] = useState<string>(() => getSolarDateKey());
  const [editions, setEditions] = useState<EditorialEdition[]>(EDITORIAL_FEED);
  const [cycle, setCycle] = useState<EditorialCycle>(CURRENT_EDITORIAL_CYCLE);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState<boolean>(false);
  const [isProvisional, setIsProvisional] = useState<boolean>(true);

  // Procedura di caricamento silenzioso del saggio giornaliero
  const performSilentSync = useCallback(async () => {
    setIsAutoRefreshing(true);
    try {
      const payload = await loadDailyEditionPayload();
      setCycle(payload.cycle);
      setEditions(payload.editions);
      setIsProvisional(payload.isProvisional);
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

  // Polling dedicato: attivo solo mentre il saggio è provvisorio, si interrompe da solo
  // non appena la redazione sul server va a buon fine.
  useEffect(() => {
    if (!isProvisional) return;

    const pollTimer = setInterval(() => {
      performSilentSync();
    }, PROVISIONAL_POLL_INTERVAL_MS);

    // Una scheda in background non deve consumare i rate-limit del livello gratuito.
    const handleVisible = () => {
      if (document.visibilityState === 'visible') performSilentSync();
    };
    document.addEventListener('visibilitychange', handleVisible);

    return () => {
      clearInterval(pollTimer);
      document.removeEventListener('visibilitychange', handleVisible);
    };
  }, [isProvisional, performSilentSync]);

  return {
    editions,
    cycle,
    dateKey,
    isAutoRefreshing,
    isProvisional
  };
}
