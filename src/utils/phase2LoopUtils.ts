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

  const safeTracks: Phase2DirectionTrack[] = canonicalFallback.tracks.map((canonicalTrack, index) => {
    const rawTrack = rawTracks[index] || {};
    const dirNumber = typeof rawTrack.directionNumber === 'number' ? rawTrack.directionNumber : index + 1;
    const dirTitle = rawTrack.directionTitle || canonicalTrack.directionTitle;
    const dirAngle = rawTrack.ontologicalAngle || canonicalTrack.ontologicalAngle;
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
          abstractFunctionA: isDenseEnough(s1?.abstractFunctionA) ? String(s1.abstractFunctionA) : (cs1?.abstractFunctionA || 'Funzione astratta primaria del primo vettore.'),
          fundamentalVerbB: isDenseEnough(s1?.fundamentalVerbB, 3) ? String(s1.fundamentalVerbB) : (cs1?.fundamentalVerbB || 'ESTENDERE'),
          abstractFunctionB: isDenseEnough(s1?.abstractFunctionB) ? String(s1.abstractFunctionB) : (cs1?.abstractFunctionB || 'Funzione astratta primaria del secondo vettore.'),
          functionalSynthesis: isDenseEnough(s1?.functionalSynthesis) ? String(s1.functionalSynthesis) : (cs1?.functionalSynthesis || 'Sintesi del punto di contatto tra i due verbi fondamentali.')
        },
        step2BlindAxis: {
          boundaryA: isDenseEnough(s2?.boundaryA) ? String(s2.boundaryA) : (cs2?.boundaryA || 'Limite estremo dell\'operatività del vettore A.'),
          accessDoorToB: isDenseEnough(s2?.accessDoorToB) ? String(s2.accessDoorToB) : (cs2?.accessDoorToB || 'Varco d\'accesso che si dischiude verso il vettore B.'),
          creviceContactPoint: isDenseEnough(s2?.creviceContactPoint) ? String(s2.creviceContactPoint) : (cs2?.creviceContactPoint || 'Punto di fessurazione in cui le due polarità divergono.')
        },
        step3InvertedDirection: {
          methodAAppliedToB: isDenseEnough(s3?.methodAAppliedToB) ? String(s3.methodAAppliedToB) : (cs3?.methodAAppliedToB || 'Applicazione della logica del primo vettore all\'orizzonte del secondo.'),
          provocativeViolationQuestion: isDenseEnough(s3?.provocativeViolationQuestion) ? String(s3.provocativeViolationQuestion) : (cs3?.provocativeViolationQuestion || 'Quale anomalia si spalanca ribaltando la direzione dello sguardo?'),
          counterIntuitiveInsight: isDenseEnough(s3?.counterIntuitiveInsight) ? String(s3.counterIntuitiveInsight) : (cs3?.counterIntuitiveInsight || 'Il cortocircuito logico svela un presupposto implicito del paradigma.')
        },
        step4CommonMetaphor: {
          masterMetaphorTitle: isDenseEnough(s4?.masterMetaphorTitle, 8) ? String(s4.masterMetaphorTitle) : (cs4?.masterMetaphorTitle || 'LA SOGLIA DEL VELATO'),
          cosmologicalAnthropologicalGround: isDenseEnough(s4?.cosmologicalAnthropologicalGround) ? String(s4.cosmologicalAnthropologicalGround) : (cs4?.cosmologicalAnthropologicalGround || 'Fondamento antropologico comune ai due domini d\'indagine.'),
          unifyingVision: isDenseEnough(s4?.unifyingVision) ? String(s4.unifyingVision) : (cs4?.unifyingVision || 'La convergenza organica che riannoda i due fenomeni in un unico continuum.')
        }
      };
    } else {
      safeCollision = canonCol;
    }

    return {
      id: trackId,
      directionNumber: dirNumber,
      directionTitle: dirTitle,
      ontologicalAngle: dirAngle,
      collision: safeCollision
    };
  });

  return {
    theoreticalPreamble: rawLoop?.theoreticalPreamble || canonicalFallback.theoreticalPreamble,
    tracks: safeTracks
  };
}
