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
  } catch (err) {
    console.warn(`[DossierTracker] Impossibile salvare passo ${stepName}:`, err);
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
