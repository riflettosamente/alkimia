import { Phase1StructuralDecomposition, VectorPhase1Decomposition } from '../types';
import { buildPhase1Decomposition } from '../data/canonicalDecompositions';

function isDenseEnough(val: any, minLength: number = 20): boolean {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed.length < minLength) return false;
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount < 4) return false;
  return true;
}

function normalizeVectorDecomp(rawVec: any, canonicalVec: VectorPhase1Decomposition): VectorPhase1Decomposition {
  if (!rawVec || typeof rawVec !== 'object') return canonicalVec;
  return {
    topicName: String(rawVec.topicName || canonicalVec.topicName),
    whenWhere: isDenseEnough(rawVec.whenWhere) ? String(rawVec.whenWhere) : canonicalVec.whenWhere,
    what: isDenseEnough(rawVec.what) ? String(rawVec.what) : canonicalVec.what,
    how: isDenseEnough(rawVec.how) ? String(rawVec.how) : canonicalVec.how,
    who: isDenseEnough(rawVec.who) ? String(rawVec.who) : canonicalVec.who,
    whichBoundary: isDenseEnough(rawVec.whichBoundary) ? String(rawVec.whichBoundary) : canonicalVec.whichBoundary,
    whyVeiled: isDenseEnough(rawVec.whyVeiled) ? String(rawVec.whyVeiled) : canonicalVec.whyVeiled
  };
}

/**
 * Normalizza e preserva l'alta densità della Fase 1 (Scomposizione Strutturale).
 * Se l'AI restituisce etichette sintetiche o stringhe vuote, subentra la formulazione
 * analitica canonica densa e articolata.
 */
export function normalizePhase1Decomposition(
  rawDecomp: any,
  vectorAName?: string,
  vectorBName?: string
): Phase1StructuralDecomposition {
  const canonical = buildPhase1Decomposition(vectorAName || '', vectorBName || '');
  if (!rawDecomp || typeof rawDecomp !== 'object') return canonical;

  return {
    vectorA: normalizeVectorDecomp(rawDecomp.vectorA, canonical.vectorA),
    vectorB: normalizeVectorDecomp(rawDecomp.vectorB, canonical.vectorB)
  };
}
