import fs from "fs";
import path from "path";

const DOSSIER_DIR = path.join(process.cwd(), "data", "daily-dossiers");

export function saveDossierStep(
  solarDateKey: string,
  stepName: string,
  stepData: any
): void {
  try {
    if (!fs.existsSync(DOSSIER_DIR)) {
      fs.mkdirSync(DOSSIER_DIR, { recursive: true });
    }
    const filePath = path.join(DOSSIER_DIR, `dossier-${solarDateKey}.json`);
    let currentData: Record<string, any> = {};

    if (fs.existsSync(filePath)) {
      try {
        currentData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch {}
    }

    currentData.solarDateKey = solarDateKey;
    currentData.lastUpdated = new Date().toISOString();
    currentData[stepName] = stepData;

    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), "utf-8");
    console.log(`[DossierTracker] Passo «${stepName}» salvato su file per ${solarDateKey}.`);

    // Quando viene salvato il saggio finale, applica la finestra scorrevole a 30 giorni
    if (stepName === "essay" || stepName === "fullEdition") {
      pruneOldDossiers(30);
    }
  } catch (err) {
    console.warn(`[DossierTracker] Impossibile salvare passo ${stepName}:`, err);
  }
}

/**
 * Mantiene una finestra scorrevole a 30 giorni, rimuovendo automaticamente i dossier più vecchi.
 */
export function pruneOldDossiers(maxKeep: number = 30): string[] {
  try {
    if (!fs.existsSync(DOSSIER_DIR)) return [];
    const files = fs
      .readdirSync(DOSSIER_DIR)
      .filter((f) => /^dossier-\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort(); // Ordinamento lessicografico YYYY-MM-DD = ordine cronologico

    const removed: string[] = [];
    while (files.length > maxKeep) {
      const oldest = files.shift();
      if (oldest) {
        fs.unlinkSync(path.join(DOSSIER_DIR, oldest));
        removed.push(oldest);
        console.log(`[DossierTracker] Finestra scorrevole (max ${maxKeep}): rimosso dossier obsoleto «${oldest}».`);
      }
    }
    return removed;
  } catch (err) {
    console.warn(`[DossierTracker] Errore durante la pulizia della finestra scorrevole:`, err);
    return [];
  }
}

export function readDossier(solarDateKey: string): Record<string, any> | null {
  try {
    const filePath = path.join(DOSSIER_DIR, `dossier-${solarDateKey}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch {}
  return null;
}

export function deleteDossier(solarDateKey: string): void {
  try {
    const filePath = path.join(DOSSIER_DIR, `dossier-${solarDateKey}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[DossierTracker] Dossier rimosso con successo per ${solarDateKey}.`);
    }
  } catch (err) {
    console.warn(`[DossierTracker] Impossibile rimuovere dossier per ${solarDateKey}:`, err);
  }
}
