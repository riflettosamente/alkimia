import { Phase3FinalStrike, DirectionFinalStrikeItem } from '../types';
import { buildPhase3FinalStrike } from '../data/canonicalFinalStrikes';

function isDenseEnough(val: any, minLength: number = 20): boolean {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed.length < minLength) return false;
  const wordCount = trimmed.split(/\s+/).length;
  if (wordCount < 4) return false;
  return true;
}

/**
 * Normalizza e protegge la densità speculativa della Fase 4 (L'Affondo Finale).
 * Impedisce risposte telegrafiche o monosillabiche garantendo paragrafi ricchi.
 */
export function normalizePhase3FinalStrike(
  rawStrike: any,
  vectorAName?: string,
  vectorBName?: string
): Phase3FinalStrike {
  const canonical = buildPhase3FinalStrike(vectorAName || '', vectorBName || '');
  if (!rawStrike || typeof rawStrike !== 'object') return canonical;

  const rawDirectionStrikes = Array.isArray(rawStrike.directionStrikes) ? rawStrike.directionStrikes : [];
  const safeDirectionStrikes: DirectionFinalStrikeItem[] = (canonical.directionStrikes || []).map((canonDir, idx) => {
    const rawDir = rawDirectionStrikes[idx] || {};
    return {
      directionNumber: typeof rawDir.directionNumber === 'number' ? rawDir.directionNumber : canonDir.directionNumber,
      directionTitle: isDenseEnough(rawDir.directionTitle, 8) ? String(rawDir.directionTitle) : canonDir.directionTitle,
      ontologicalAngle: isDenseEnough(rawDir.ontologicalAngle) ? String(rawDir.ontologicalAngle) : canonDir.ontologicalAngle,
      cuiProdest: isDenseEnough(rawDir.cuiProdest) ? String(rawDir.cuiProdest) : canonDir.cuiProdest,
      groundbreakingDiscovery: isDenseEnough(rawDir.groundbreakingDiscovery) ? String(rawDir.groundbreakingDiscovery) : canonDir.groundbreakingDiscovery,
      uninvestigatedBias: isDenseEnough(rawDir.uninvestigatedBias) ? String(rawDir.uninvestigatedBias) : canonDir.uninvestigatedBias,
      researchFocusIntersection: isDenseEnough(rawDir.researchFocusIntersection) ? String(rawDir.researchFocusIntersection) : canonDir.researchFocusIntersection,
      dizzyingRevelation: isDenseEnough(rawDir.dizzyingRevelation) ? String(rawDir.dizzyingRevelation) : canonDir.dizzyingRevelation
    };
  });

  return {
    cuiProdest: isDenseEnough(rawStrike.cuiProdest) ? String(rawStrike.cuiProdest) : canonical.cuiProdest,
    groundbreakingDiscovery: isDenseEnough(rawStrike.groundbreakingDiscovery) ? String(rawStrike.groundbreakingDiscovery) : canonical.groundbreakingDiscovery,
    uninvestigatedBias: isDenseEnough(rawStrike.uninvestigatedBias) ? String(rawStrike.uninvestigatedBias) : canonical.uninvestigatedBias,
    researchFocusIntersection: isDenseEnough(rawStrike.researchFocusIntersection) ? String(rawStrike.researchFocusIntersection) : canonical.researchFocusIntersection,
    dizzyingRevelation: isDenseEnough(rawStrike.dizzyingRevelation) ? String(rawStrike.dizzyingRevelation) : canonical.dizzyingRevelation,
    directionStrikes: safeDirectionStrikes.length > 0 ? safeDirectionStrikes : (canonical.directionStrikes || [])
  };
}
