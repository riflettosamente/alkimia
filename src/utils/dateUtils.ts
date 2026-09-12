/**
 * Utilità di gestione temporale e formattazione per ALKIMIA.
 * Garantisce l'assoluta corrispondenza tra la data di emissione della testata
 * e la data del Saggio del Giorno, sincronizzate alla rotazione diurna delle 00:00.
 */

const ITALIAN_MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

/**
 * Restituisce la chiave della data solare odierna (formato YYYY-MM-DD UTC).
 */
export function getSolarDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formatta una data o una chiave data (es. "2026-09-12") in italiano aulico ed elegante:
 * Es: "12 Settembre 2026"
 */
export function formatItalianDate(dateInput?: string | Date): string {
  let d: Date;
  if (!dateInput) {
    d = new Date();
  } else if (typeof dateInput === 'string') {
    // Se è nel formato YYYY-MM-DD, costruisce la data preservando il giorno UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const [year, month, day] = dateInput.split('-').map(Number);
      return `${day} ${ITALIAN_MONTHS[month - 1]} ${year}`;
    }
    d = new Date(dateInput);
  } else {
    d = dateInput;
  }

  const day = d.getUTCDate();
  const month = ITALIAN_MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Calcola i millisecondi mancanti al prossimo cambio di giornata solare (00:00 UTC).
 */
export function getTimeUntilNextSolarMidnight(): number {
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
 * Formatta il conto alla rovescia per la rotazione diurna.
 */
export function formatTimeUntilNextCycle(msRemaining: number): string {
  const totalSeconds = Math.floor(msRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `Al compimento della rotazione diurna (tra ${hours}h ${minutes}m)`;
}
