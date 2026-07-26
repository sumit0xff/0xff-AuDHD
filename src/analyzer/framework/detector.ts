import { performance } from 'perf_hooks';
import { ScanResult } from '../types';
import { calculateConfidence } from './confidence';
import { gatherEvidence } from './evidence';
import { FileCache } from './readers';
import { TECHNOLOGY_REGISTRY } from './registry';
import { FrameworkDetectionResult, ProjectTechnology, TechnologyCategory } from './types';

export async function detectFrameworks(scanResult: ScanResult): Promise<FrameworkDetectionResult> {
  const startTime = performance.now();
  const cache = new FileCache(scanResult.root);
  const detectedTechnologies: ProjectTechnology[] = [];
  
  // Concurrently evaluate all technologies from the registry
  await Promise.all(TECHNOLOGY_REGISTRY.map(async (tech) => {
    const evidenceList = await gatherEvidence(tech, scanResult, cache);
    
    if (evidenceList.length > 0) {
      const confidence = calculateConfidence(evidenceList);
      
      // Try to extract version from dependencies if applicable
      let version = undefined;
      const depEvidence = evidenceList.find(e => ['Dependency', 'DevDependency', 'PeerDependency'].includes(e.type));
      if (depEvidence && depEvidence.value && depEvidence.value !== depEvidence.matchedBy.value) {
        version = depEvidence.value.replace(/[\^~]/, ''); // Clean basic semver prefixes
      }

      detectedTechnologies.push({
        id: tech.id,
        displayName: tech.displayName,
        category: tech.category,
        version,
        confidence,
        evidence: evidenceList
      });
    }
  }));

  // Sort technologies by confidence descending, then priority descending
  detectedTechnologies.sort((a, b) => {
    if (b.confidence !== a.confidence) return b.confidence - a.confidence;
    const priorityA = TECHNOLOGY_REGISTRY.find(t => t.id === a.id)?.priority || 0;
    const priorityB = TECHNOLOGY_REGISTRY.find(t => t.id === b.id)?.priority || 0;
    return priorityB - priorityA;
  });

  // Extract primary metadata from highest confidence detected technologies
  const getTop = (cat: TechnologyCategory) => detectedTechnologies.find(t => t.category === cat) || null;

  const result: FrameworkDetectionResult = {
    technologies: detectedTechnologies.filter(t => !['Runtime', 'PackageManager', 'Deployment', 'Monorepo'].includes(t.category)),
    runtime: getTop('Runtime'),
    packageManager: getTop('PackageManager'),
    deployment: getTop('Deployment'),
    monorepo: getTop('Monorepo'),
    averageConfidence: 0,
    analysisTimeMs: 0
  };

  const allDetected = [
    ...result.technologies,
    result.runtime,
    result.packageManager,
    result.deployment,
    result.monorepo
  ].filter(Boolean) as ProjectTechnology[];

  if (allDetected.length > 0) {
    const totalConfidence = allDetected.reduce((sum, t) => sum + t.confidence, 0);
    result.averageConfidence = Math.round(totalConfidence / allDetected.length);
  }

  const endTime = performance.now();
  result.analysisTimeMs = Math.round(endTime - startTime);

  return result;
}
