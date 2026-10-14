import fs from "fs";
import path from "path";

export interface ExtractionRecord {
  id: string;
  solarDateKey: string;
  timestamp: string;
  type: "daily_edition" | "manual_generation";
  vectorA: string;
  vectorB: string;
}

export interface VectorStatsSummary {
  asVectorA: number;
  asVectorB: number;
  total: number;
  lastExtracted: string;
}

export interface ExtractionHistoryData {
  lastUpdated: string;
  totalExtractions: number;
  statistics: Record<string, VectorStatsSummary>;
  chronicle: ExtractionRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const HISTORY_FILE = path.join(DATA_DIR, "vector-extractions.json");

/**
 * Legge il file di cronologia e statistiche delle estrazioni.
 */
export function readExtractionHistory(): ExtractionHistoryData {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[VectorTracker] Impossibile leggere il file di cronologia:", err);
  }
  return {
    lastUpdated: new Date().toISOString(),
    totalExtractions: 0,
    statistics: {},
    chronicle: []
  };
}

export function normalizeVectorName(name: string): string {
  if (!name) return "";
  return name.replace(/^\d+\.\s*/, "").replace(/\s*\(Afterlife\)/i, "").trim();
}

/**
 * Registra una nuova estrazione di Vettore A e Vettore B.
 * Se per 'daily_edition' esiste già un record con la stessa data solare e la stessa coppia,
 * non viene duplicato nello storico.
 */
export function recordVectorExtraction(
  solarDateKey: string,
  vectorA: string,
  vectorB: string,
  type: "daily_edition" | "manual_generation" = "daily_edition"
): ExtractionHistoryData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const cleanA = normalizeVectorName(vectorA);
    const cleanB = normalizeVectorName(vectorB);

    const current = readExtractionHistory();

    // Se per la stessa data solare e lo stesso tipo la coppia è identica, evitiamo registrazioni duplicate
    const alreadyLogged = current.chronicle.some(
      (entry) =>
        entry.solarDateKey === solarDateKey &&
        entry.type === type &&
        normalizeVectorName(entry.vectorA) === cleanA &&
        normalizeVectorName(entry.vectorB) === cleanB
    );

    if (alreadyLogged) {
      return current;
    }

    const newRecord: ExtractionRecord = {
      id: `ext-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      solarDateKey,
      timestamp: new Date().toISOString(),
      type,
      vectorA: cleanA,
      vectorB: cleanB
    };

    // Aggiungi alla cronologia (in cima il più recente)
    current.chronicle.unshift(newRecord);
    current.totalExtractions = current.chronicle.length;
    current.lastUpdated = new Date().toISOString();

    // Ricalcola le statistiche aggregate per ogni vettore (normalizzando anche i record storici)
    const stats: Record<string, VectorStatsSummary> = {};

    for (const record of current.chronicle) {
      const vA = normalizeVectorName(record.vectorA);
      const vB = normalizeVectorName(record.vectorB);

      // Vettore A
      if (!stats[vA]) {
        stats[vA] = {
          asVectorA: 0,
          asVectorB: 0,
          total: 0,
          lastExtracted: record.solarDateKey
        };
      }
      stats[vA].asVectorA += 1;
      stats[vA].total += 1;

      // Vettore B
      if (!stats[vB]) {
        stats[vB] = {
          asVectorA: 0,
          asVectorB: 0,
          total: 0,
          lastExtracted: record.solarDateKey
        };
      }
      stats[vB].asVectorB += 1;
      stats[vB].total += 1;
    }

    current.statistics = stats;

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(current, null, 2), "utf-8");
    console.log(`[VectorTracker] Cronologia aggiornata: «${cleanA}» (A) × «${cleanB}» (B) per ${solarDateKey}`);
    return current;
  } catch (err) {
    console.error("[VectorTracker] Errore durante il salvataggio dell'estrazione:", err);
    return readExtractionHistory();
  }
}
