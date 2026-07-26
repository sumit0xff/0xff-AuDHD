import { ScanResult } from '../types';
import { FileCache } from './readers';
import { Evidence, Matcher, TechnologyDefinition } from './types';

export async function gatherEvidence(
  tech: TechnologyDefinition,
  scanResult: ScanResult,
  cache: FileCache
): Promise<Evidence[]> {
  const evidenceList: Evidence[] = [];
  
  const packageJson = await cache.getPackageJson();

  for (const matcher of tech.matchers) {
    let matched = false;
    let evidenceValue = '';

    switch (matcher.type) {
      case 'Dependency':
      case 'DevDependency':
      case 'PeerDependency': {
        if (!packageJson) break;
        const depBlock = packageJson[getDepKey(matcher.type)];
        if (depBlock && depBlock[matcher.value]) {
          matched = true;
          evidenceValue = depBlock[matcher.value];
        }
        break;
      }
      
      case 'FileExists': {
        // Fast path: use ScanResult's indexed files
        const fileExists = scanResult.files.some(f => f.relativePath === matcher.value || f.name === matcher.value);
        if (fileExists) {
          matched = true;
          evidenceValue = matcher.value;
        }
        break;
      }
      
      case 'JsonKey': {
        const fileToRead = matcher.file || 'package.json';
        const json = await cache.readJson(fileToRead);
        if (json && matcher.jsonPath) {
          const val = json[matcher.jsonPath];
          if (val && typeof val === 'object' && matcher.value in val) {
            matched = true;
            evidenceValue = matcher.value;
          } else if (val && typeof val === 'string' && val.includes(matcher.value)) {
            matched = true;
            evidenceValue = matcher.value;
          }
        }
        break;
      }
      
      case 'JsonValue': {
        const fileToRead = matcher.file || 'package.json';
        const json = await cache.readJson(fileToRead);
        if (json && matcher.jsonPath) {
          if (json[matcher.jsonPath] === matcher.value) {
            matched = true;
            evidenceValue = matcher.value;
          }
        }
        break;
      }
    }

    if (matched) {
      evidenceList.push({
        type: matcher.type,
        source: matcher.file || (['Dependency', 'DevDependency', 'PeerDependency'].includes(matcher.type) ? 'package.json' : matcher.value),
        value: evidenceValue || matcher.value,
        matchedBy: matcher
      });
    }
  }

  return evidenceList;
}

function getDepKey(type: string): string {
  if (type === 'DevDependency') return 'devDependencies';
  if (type === 'PeerDependency') return 'peerDependencies';
  return 'dependencies';
}
