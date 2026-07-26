import { performance } from 'perf_hooks';
import { ScanResult } from '../types';
import { FrameworkDetectionResult } from '../framework';
import { FileCache } from './readers';
import { detectWorkspace } from './workspace';
import { GraphBuilder } from './graph';
import { DependencyAnalysisResult, DependencyType, PackageCategoryCount, PackageCategory } from './types';

export async function analyzeDependencies(
  scanResult: ScanResult, 
  frameworkResult: FrameworkDetectionResult
): Promise<DependencyAnalysisResult> {
  const startTime = performance.now();
  const cache = new FileCache(scanResult.root);
  const isWorkspace = await detectWorkspace(scanResult, cache);
  
  const graphBuilder = new GraphBuilder();

  // Parse root package.json
  const packageJson = await cache.getPackageJson();
  
  let prodCount = 0;
  let devCount = 0;
  let peerCount = 0;
  let optionalCount = 0;
  let bundledCount = 0;
  let workspaceCount = 0;

  if (packageJson) {
    const processDeps = (block: any, type: DependencyType) => {
      if (!block) return;
      for (const [pkg, version] of Object.entries(block)) {
        const v = version as string;
        
        // Detect workspace dependencies (e.g., 'workspace:*')
        const isWs = v.startsWith('workspace:');
        
        graphBuilder.addDependency(pkg, v, type, 'package.json', isWs);
        
        if (isWs) workspaceCount++;
        else if (type === 'Production') prodCount++;
        else if (type === 'Development') devCount++;
        else if (type === 'Peer') peerCount++;
        else if (type === 'Optional') optionalCount++;
        else if (type === 'Bundled') bundledCount++;
      }
    };

    processDeps(packageJson.dependencies, 'Production');
    processDeps(packageJson.devDependencies, 'Development');
    processDeps(packageJson.peerDependencies, 'Peer');
    processDeps(packageJson.optionalDependencies, 'Optional');
    processDeps(packageJson.bundledDependencies, 'Bundled');
  }

  const graph = graphBuilder.build();

  // Aggregate categories
  const categoryMap = new Map<PackageCategory, number>();
  for (const node of graph.nodes.values()) {
    categoryMap.set(node.category, (categoryMap.get(node.category) || 0) + 1);
  }

  const categories: PackageCategoryCount[] = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .filter(c => c.category !== 'Unknown') // Hide Unknown from summary to keep it clean
    .sort((a, b) => b.count - a.count);

  const endTime = performance.now();

  return {
    productionDependencies: prodCount,
    developmentDependencies: devCount,
    peerDependencies: peerCount,
    optionalDependencies: optionalCount,
    workspaceDependencies: workspaceCount,
    bundledDependencies: bundledCount,
    totalDependencies: graph.nodes.size,
    packageManager: frameworkResult.packageManager?.displayName || 'Unknown',
    workspace: isWorkspace,
    graph,
    categories,
    analysisTimeMs: Math.round(endTime - startTime)
  };
}
