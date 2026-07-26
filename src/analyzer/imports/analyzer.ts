import { performance } from 'perf_hooks';
import { KnowledgeGraph, createEdge } from '../graph';
import { ParserCache } from './cache';
import { TreeSitterImportParser } from './ts-parser';
import { ImportResolver } from './resolver';
import { ImportGraphAlgorithms } from './graph';
import { DiagnosticsCollector } from './diagnostics';
import { ImportAnalysisResult } from './types';

export async function analyzeImports(
  rootDir: string,
  graph: KnowledgeGraph
): Promise<ImportAnalysisResult> {
  const startTime = performance.now();
  
  const cache = new ParserCache(rootDir);
  const parser = new TreeSitterImportParser();
  const resolver = new ImportResolver(rootDir, graph);
  const diagnostics = new DiagnosticsCollector();

  // 1. Identify all JS/TS files in the graph
  const files = Array.from(graph.rawNodes.values()).filter(node => 
    node.type === 'File' && 
    ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(node.properties.extension || '')
  );

  // 2. Parse and Resolve in parallel
  await Promise.all(files.map(async (fileNode) => {
    const relPath = fileNode.properties.path || fileNode.properties.name || ''; // Fallback for safety
    // The relativePath is stored in the ID or properties. We used it in properties in Phase 5 but let's extract it from ID cleanly if needed.
    // In Phase 5 we created file nodes with ID `File::src/foo.ts` and properties didn't explicitly store relativePath, just name.
    // Wait, in Phase 5 builder: createNode('File', file.relativePath, { name, extension, size })
    // So the ID is `File::${relativePath}`. We can derive it:
    const filePath = fileNode.id.replace('File::', '');
    
    const content = await cache.readFile(filePath);
    if (!content) return;

    const statements = await parser.parseAsync(filePath, content, fileNode.properties.extension);
    
    for (const stmt of statements) {
      const resolvedId = resolver.resolve(filePath, stmt.specifier);
      
      if (resolvedId) {
        // Determine if target is external package
        const isExternal = resolvedId.startsWith('Package::');
        diagnostics.recordResolved(isExternal, stmt.isDynamic, stmt.isTypeOnly);

        // Inject IMPORTS edge into the KnowledgeGraph
        // The reverse IMPORTED_BY edge can be resolved dynamically via query.getInboundEdges()
        const edge = createEdge(fileNode.id, resolvedId, 'IMPORTS', {
          specifier: stmt.specifier,
          isDynamic: stmt.isDynamic,
          isTypeOnly: stmt.isTypeOnly
        });
        
        graph.addEdge(edge);
      } else {
        diagnostics.recordUnresolved();
      }
    }
  }));

  // 3. Post-Analysis Graph Algorithms
  const algorithms = new ImportGraphAlgorithms(graph);
  const circularDependencies = algorithms.detectCycles();
  const { entryPoints, orphans } = algorithms.detectEntryPointsAndOrphans();

  const endTime = performance.now();

  return {
    diagnostics: diagnostics.get(),
    circularDependencies,
    entryPoints,
    orphanFiles: orphans,
    analysisTimeMs: Math.round(endTime - startTime)
  };
}
