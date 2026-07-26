import { ScanResult } from '../types';
import { LanguageDetectionResult } from '../language';
import { FrameworkDetectionResult } from '../framework';
import { DependencyAnalysisResult } from '../dependency';

import { KnowledgeGraph } from './graph';
import { createNode } from './nodes';
import { createEdge } from './edges';

export function buildKnowledgeGraph(
  scanResult: ScanResult,
  languageResult: LanguageDetectionResult,
  frameworkResult: FrameworkDetectionResult,
  dependencyResult: DependencyAnalysisResult
): KnowledgeGraph {
  
  const graph = new KnowledgeGraph();

  // 1. Root Repository Node
  const repoNode = createNode('Repository', scanResult.root, { path: scanResult.root });
  graph.addNode(repoNode);

  // 2. Directory & File Nodes (Tree)
  // For simplicity we create all files and link them to repo.
  // In a full traversal, we'd recreate the exact folder hierarchy edges.
  for (const file of scanResult.files) {
    const fileNode = createNode('File', file.relativePath, {
      name: file.name,
      extension: file.extension,
      size: file.size
    });
    graph.addNode(fileNode);
    graph.addEdge(createEdge(repoNode.id, fileNode.id, 'CONTAINS'));
  }

  // 3. Languages
  for (const lang of languageResult.languages) {
    const langNode = createNode('Language', lang.id, {
      displayName: lang.displayName,
      fileCount: lang.fileCount
    });
    graph.addNode(langNode);
    graph.addEdge(createEdge(repoNode.id, langNode.id, 'USES'));
  }

  // 4. Technologies
  for (const tech of frameworkResult.technologies) {
    const techNode = createNode('Technology', tech.id, {
      displayName: tech.displayName,
      category: tech.category,
      version: tech.version
    });
    graph.addNode(techNode);
    graph.addEdge(createEdge(repoNode.id, techNode.id, 'USES'));
  }

  if (frameworkResult.packageManager) {
    const pmNode = createNode('PackageManager', frameworkResult.packageManager.id, {
      displayName: frameworkResult.packageManager.displayName
    });
    graph.addNode(pmNode);
    graph.addEdge(createEdge(repoNode.id, pmNode.id, 'USES'));
  }

  if (frameworkResult.runtime) {
    const rtNode = createNode('Runtime', frameworkResult.runtime.id, {
      displayName: frameworkResult.runtime.displayName
    });
    graph.addNode(rtNode);
    graph.addEdge(createEdge(repoNode.id, rtNode.id, 'USES'));
  }

  // 5. Dependencies
  for (const dep of dependencyResult.graph.nodes.values()) {
    const depNode = createNode('Package', dep.id, {
      packageName: dep.packageName,
      version: dep.version,
      category: dep.category,
      workspace: dep.workspace
    });
    graph.addNode(depNode);
    graph.addEdge(createEdge(repoNode.id, depNode.id, 'DEPENDS_ON', { dependencyType: dep.dependencyType }));
  }

  return graph;
}
