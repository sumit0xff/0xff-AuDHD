import * as path from 'path';
import { KnowledgeGraph, generateNodeId } from '../graph';

/**
 * Resolves an import specifier to a deterministic KnowledgeGraph Node ID.
 */
export class ImportResolver {
  constructor(private readonly rootDir: string, private readonly graph: KnowledgeGraph) {}

  public resolve(sourceFilePath: string, specifier: string): string | null {
    // 1. Check if it's an external package import (e.g. 'commander', '@types/node')
    if (!specifier.startsWith('.') && !specifier.startsWith('/')) {
      // It's likely a package. Check if the graph has this package.
      // E.g. 'commander' -> Package::commander@1.0.0 (version unknown from specifier)
      // Since package nodes have versions in their IDs, we query by type and find a match.
      const packageNodes = this.graph.rawNodesByType.get('Package');
      if (packageNodes) {
        for (const pkgId of packageNodes) {
          const pkg = this.graph.rawNodes.get(pkgId);
          if (pkg && pkg.properties.packageName === specifier) {
            return pkgId; // Resolved to external package
          }
        }
      }
      
      // We might have path aliases (e.g., '@utils/logger'). 
      // Full TSConfig paths support is complex, but we can do a naive check if it points to a local file.
      // If we don't have TSConfig, we can't reliably resolve aliases here yet, so we return null.
      return null;
    }

    // 2. Local relative import resolution
    // sourceFilePath is relative to root (e.g., 'src/analyzer/imports/resolver.ts')
    const sourceDir = path.dirname(path.join(this.rootDir, sourceFilePath));
    const targetAbsPath = path.resolve(sourceDir, specifier);
    const targetRelPath = path.relative(this.rootDir, targetAbsPath).replace(/\\/g, '/'); // Normalize slashes for IDs

    // We must check if the targetRelPath exists in the graph.
    // It could be:
    // a) An exact match: src/utils/logger.ts
    // b) Extension-less: src/utils/logger (we must try .ts, .tsx, .js, .jsx)
    // c) Directory index: src/utils (we must try src/utils/index.ts)
    
    // We try to generate IDs and check if they exist in the graph.
    const candidates = [
      targetRelPath,
      `${targetRelPath}.ts`,
      `${targetRelPath}.tsx`,
      `${targetRelPath}.js`,
      `${targetRelPath}.jsx`,
      `${targetRelPath}/index.ts`,
      `${targetRelPath}/index.js`,
    ];

    for (const candidate of candidates) {
      const candidateId = generateNodeId('File', candidate);
      if (this.graph.rawNodes.has(candidateId)) {
        return candidateId;
      }
    }

    return null;
  }
}
