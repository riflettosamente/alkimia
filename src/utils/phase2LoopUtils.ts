import { Phase2LoopFiveDirections, Phase2DirectionTrack, Phase2CollisionDecomposition } from '../types';
import { buildPhase2LoopFiveDirections } from '../data/canonicalLoopFiveDirections';
import { buildPhase2Collision } from '../data/canonicalCollisions';

/**
 * Normalizza e convalida la struttura di Phase2LoopFiveDirections per garantire che:
 * 1. `tracks` contenga esattamente le 5 direzioni con collisione integra.
 * 2. Ogni direzione abbia un `id` univoco e non vuoto (evita warning React keys).
 * 3. Se il modello AI produce una collisione parziale o omette step1StrippingFunction,
 *    viene integrata con i valori canonici e sicuri invece di generare undefined TypeError.
 */
function isDenseEnough(val: any, minLength: number = 18): boolean {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed.length < minLength) return false;
  if (minLength > 5) {
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount < 2) return false;
  }
  return true;
}

const DEFAULT_DRAWER_LABELS: Record<number, string> = {
  1: 'Cassetto 1 di Fase 2 • Reperti, Strumenti e Misurazioni (materialEvidenceAndTools)',
  2: 'Cassetto 2 di Fase 2 • Persone, Scienziati e Testimoni (keyFiguresAndWitnesses)',
  3: 'Cassetto 3 di Fase 2 • Supporti, Libri e Dossier Fondativi (foundationalTexts)',
  4: 'Cassetto 4 di Fase 2 • Biologia, Corpo e Soglie Somatiche (materialEvidenceAndTools + keyFiguresAndWitnesses)',
  5: 'Cassetto 5 di Fase 2 • Paradigmi, Teoremi ed Equazioni (breakthroughTheories + crossArchiveSynthesis)'
};

export function normalizePhase2Loop(
  rawLoop: any,
  vectorAName?: string,
  vectorBName?: string
): Phase2LoopFiveDirections {
  const canonicalFallback = buildPhase2LoopFiveDirections(vectorAName || '', vectorBName || '');

  const defaultCollision = buildPhase2Collision(vectorAName || '', vectorBName || '');

  const rawTracks = (rawLoop && typeof rawLoop === 'object' && Array.isArray(rawLoop.tracks))
    ? rawLoop.tracks
    : [];

  const enrichIfTooShort = (rawVal: any, canonVal: string, minChars: number = 220): string => {
    if (!isDenseEnough(rawVal, 15)) return canonVal;
    const rawStr = String(rawVal).trim();
    if (rawStr.length >= minChars || !canonVal) return rawStr;
    // Se un dossier salvato in precedenza aveva una sola frase telegrafica (< 220 caratteri),
    // la integra con l'approfondimento narrativo canonico della direzione corrispondente
    // così tutte le 4 sezioni risultano subito ricche, articolate e complete.
    if (rawStr.includes(canonVal.slice(0, 35))) return rawStr;
    return `${rawStr}\n\n${canonVal}`;
  };

  const safeTracks: Phase2DirectionTrack[] = canonicalFallback.tracks.map((canonicalTrack, index) => {
    const targetDirNum = index + 1;
    const rawTrack =
      rawTracks.find((t: any) => Number(t?.directionNumber) === targetDirNum) ||
      rawTracks[index] ||
      {};
    const dirNumber = typeof rawTrack.directionNumber === 'number' ? rawTrack.directionNumber : targetDirNum;
    const dirTitle = rawTrack.directionTitle || canonicalTrack.directionTitle;
    const dirAngle = enrichIfTooShort(rawTrack.ontologicalAngle, canonicalTrack.ontologicalAngle, 180);
    const empiricalDrawerLabel = rawTrack.empiricalDrawerLabel || DEFAULT_DRAWER_LABELS[dirNumber] || DEFAULT_DRAWER_LABELS[index + 1];
    const empiricalEvidenceExamined = isDenseEnough(rawTrack.empiricalEvidenceExamined, 10)
      ? String(rawTrack.empiricalEvidenceExamined)
      : undefined;
    const trackId = `track-${dirNumber}-${index}-${rawTrack.id || canonicalTrack.id || 'dir'}`;

    // Validazione profonda di collision
    const rawCol = rawTrack.collision;
    const canonCol = canonicalTrack.collision || defaultCollision;

    let safeCollision: Phase2CollisionDecomposition;

    if (rawCol && typeof rawCol === 'object') {
      const s1 = rawCol.step1StrippingFunction;
      const cs1 = canonCol.step1StrippingFunction;

      const s2 = rawCol.step2BlindAxis;
      const cs2 = canonCol.step2BlindAxis;

      const s3 = rawCol.step3InvertedDirection;
      const cs3 = canonCol.step3InvertedDirection;

      const s4 = rawCol.step4CommonMetaphor;
      const cs4 = canonCol.step4CommonMetaphor;

      safeCollision = {
        step1StrippingFunction: {
          fundamentalVerbA: isDenseEnough(s1?.fundamentalVerbA, 3) ? String(s1.fundamentalVerbA) : (cs1?.fundamentalVerbA || 'VIOLARE'),
          abstractFunctionA: enrichIfTooShort(s1?.abstractFunctionA, cs1?.abstractFunctionA || 'Funzione astratta primaria del primo argomento.', 220),
          fundamentalVerbB: isDenseEnough(s1?.fundamentalVerbB, 3) ? String(s1.fundamentalVerbB) : (cs1?.fundamentalVerbB || 'ESTENDERE'),
          abstractFunctionB: enrichIfTooShort(s1?.abstractFunctionB, cs1?.abstractFunctionB || 'Funzione astratta primaria del secondo argomento.', 220),
          functionalSynthesis: enrichIfTooShort(s1?.functionalSynthesis, cs1?.functionalSynthesis || 'Sintesi del punto di contatto tra i due verbi fondamentali.', 340)
        },
        step2BlindAxis: {
          boundaryA: enrichIfTooShort(s2?.boundaryA, cs2?.boundaryA || 'Limite estremo dell\'operatività del primo argomento.', 220),
          accessDoorToB: enrichIfTooShort(s2?.accessDoorToB, cs2?.accessDoorToB || 'Varco d\'accesso che si dischiude verso il secondo argomento.', 220),
          creviceContactPoint: enrichIfTooShort(s2?.creviceContactPoint, cs2?.creviceContactPoint || 'Punto di fessurazione in cui le due polarità si incontrano.', 340)
        },
        step3InvertedDirection: {
          methodAAppliedToB: enrichIfTooShort(s3?.methodAAppliedToB, cs3?.methodAAppliedToB || 'Applicazione della logica del primo argomento all\'orizzonte del secondo.', 220),
          provocativeViolationQuestion: isDenseEnough(s3?.provocativeViolationQuestion) ? String(s3.provocativeViolationQuestion) : (cs3?.provocativeViolationQuestion || 'Quale anomalia si spalanca ribaltando la direzione dello sguardo?'),
          counterIntuitiveInsight: enrichIfTooShort(s3?.counterIntuitiveInsight, cs3?.counterIntuitiveInsight || 'Il cortocircuito logico svela un presupposto implicito del paradigma.', 340)
        },
        step4CommonMetaphor: {
          masterMetaphorTitle: isDenseEnough(s4?.masterMetaphorTitle, 8) ? String(s4.masterMetaphorTitle) : (cs4?.masterMetaphorTitle || 'LA SOGLIA DEL VELATO'),
          cosmologicalAnthropologicalGround: enrichIfTooShort(s4?.cosmologicalAnthropologicalGround, cs4?.cosmologicalAnthropologicalGround || 'Fondamento antropologico comune ai due domini d\'indagine.', 220),
          unifyingVision: enrichIfTooShort(s4?.unifyingVision, cs4?.unifyingVision || 'La convergenza organica che riannoda i due fenomeni in un unico continuum.', 220)
        }
      };
    } else {
      safeCollision = canonCol;
    }

    return {
      id: trackId,
      directionNumber: dirNumber,
      directionTitle: dirTitle,
      empiricalDrawerLabel,
      empiricalEvidenceExamined,
      ontologicalAngle: dirAngle,
      collision: safeCollision
    };
  });

  return {
    theoreticalPreamble: rawLoop?.theoreticalPreamble || canonicalFallback.theoreticalPreamble,
    tracks: safeTracks
  };
}
