import { Phase2CollisionDecomposition } from '../types';
import { buildPhase2Collision } from '../data/canonicalCollisions';

/**
 * Normalizza e protegge la struttura Phase2CollisionDecomposition garantendo che
 * tutti i campi e sotto-campi (step 1, step 2, step 3, step 4) siano sempre definiti.
 */
function isDenseEnough(val: any, minLength: number = 18): boolean {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed.length < minLength) return false;
  if (minLength > 5) {
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount < 3) return false;
  }
  return true;
}

export function normalizePhase2Collision(
  rawCol: any,
  vectorAName?: string,
  vectorBName?: string
): Phase2CollisionDecomposition {
  const canonical = buildPhase2Collision(vectorAName || '', vectorBName || '');

  if (!rawCol || typeof rawCol !== 'object') {
    return canonical;
  }

  const s1 = rawCol.step1StrippingFunction;
  const cs1 = canonical?.step1StrippingFunction;

  const s2 = rawCol.step2BlindAxis;
  const cs2 = canonical?.step2BlindAxis;

  const s3 = rawCol.step3InvertedDirection;
  const cs3 = canonical?.step3InvertedDirection;

  const s4 = rawCol.step4CommonMetaphor;
  const cs4 = canonical?.step4CommonMetaphor;

  return {
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
}
