import { saveCompleteDossier } from "./dossierTracker";
import { recordVectorExtraction } from "./vectorTracker";

const GITHUB_REPO_OWNER = "riflettosamente";
const GITHUB_REPO_NAME = "alkimia";
const GITHUB_BRANCH = "main";
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}`;

/**
 * Tenta di scaricare il dossier di una determinata data solare dal repository GitHub pubblico.
 * Se trovato e valido:
 * 1. Lo salva localmente nella cartella dei dossier.
 * 2. Registra la coppia di vettori nello storico estrazioni se presente.
 * 3. Restituisce il contenuto del dossier, evitando così qualsiasi chiamata AI a Gemini/Groq.
 */
export async function fetchDossierFromGitHub(
  solarDateKey: string
): Promise<Record<string, any> | null> {
  const fileUrl = `${GITHUB_RAW_BASE}/data/daily-dossiers/dossier-${solarDateKey}.json`;

  try {
    const response = await fetch(fileUrl, {
      signal: AbortSignal.timeout(8000),
      headers: {
        "Accept": "application/json",
        "User-Agent": "Alkimia-App/1.0"
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`[GitHubSync] Dossier ${solarDateKey} non presente su GitHub (${response.status}).`);
      } else {
        console.warn(`[GitHubSync] Risposta imprevista da GitHub (${response.status}) per ${solarDateKey}.`);
      }
      return null;
    }

    const data: any = await response.json();
    const candidateEssay = data?.fullEdition?.essay || data?.essay;

    if (candidateEssay && (candidateEssay.title || candidateEssay.narrativeParagraphs?.length)) {
      console.log(
        `[GitHubSync] Saggio del Giorno per ${solarDateKey} individuato su GitHub: «${candidateEssay.title}». Sincronizzazione locale in corso...`
      );

      // Salva il file sul filesystem locale
      saveCompleteDossier(solarDateKey, data);

      // Sincronizza l'estrazione se presente
      const pair = data?.fullEdition?.systemPair || data?.systemPair || data?.phase1_decomposition?.systemPair;
      if (pair?.vectorA && pair?.vectorB) {
        recordVectorExtraction(solarDateKey, pair.vectorA, pair.vectorB, "daily_edition");
      }

      return data;
    }
  } catch (err: any) {
    const isTimeout = err?.name === "TimeoutError" || err?.name === "AbortError";
    console.warn(
      `[GitHubSync] Impossibile verificare dossier su GitHub per ${solarDateKey}: ${
        isTimeout ? "timeout (8s)" : (err.message || String(err))
      }`
    );
  }

  return null;
}
