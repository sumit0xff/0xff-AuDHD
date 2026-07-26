import { Evidence } from './types';

/**
 * Calculates the confidence score based on accumulated evidence.
 * 
 * Rules:
 * - Single dependency: 80
 * - Config file only: 90
 * - Lockfile only: 70
 * - Dependency + Config: 100
 * - Multiple pieces of evidence inherently increase confidence up to 100
 */
export function calculateConfidence(evidenceList: Evidence[]): number {
  if (evidenceList.length === 0) return 0;
  
  let hasDependency = false;
  let hasConfig = false;
  let hasLockfile = false;

  for (const evidence of evidenceList) {
    if (evidence.type === 'Dependency' || evidence.type === 'DevDependency' || evidence.type === 'PeerDependency') {
      hasDependency = true;
    }
    if (evidence.type === 'FileExists') {
      if (evidence.value.includes('lock')) {
        hasLockfile = true;
      } else {
        hasConfig = true;
      }
    }
  }

  if (hasDependency && hasConfig) return 100;
  if (hasConfig && !hasDependency) return 90;
  if (hasDependency && !hasConfig) return 80;
  if (hasLockfile && !hasDependency && !hasConfig) return 70;

  // Fallback for edge cases (e.g., json values)
  return Math.min(100, evidenceList.length * 50);
}
