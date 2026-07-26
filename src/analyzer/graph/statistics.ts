import { KnowledgeGraph } from './graph';
import { GraphQuery } from './query';
import { GraphStatistics } from './types';

export function calculateStatistics(graph: KnowledgeGraph): GraphStatistics {
  const query = new GraphQuery(graph);
  
  const nodeCount = graph.rawNodes.size;
  const edgeCount = graph.rawEdges.size;
  
  const languages = query.getNodesByType('Language').length;
  const technologies = query.getNodesByType('Technology').length;
  const packages = query.getNodesByType('Package').length;

  // Density = Edges / (Nodes * (Nodes - 1))
  // We format it as a tiny float percentage
  let density = '0.000';
  if (nodeCount > 1) {
    const maxEdges = nodeCount * (nodeCount - 1);
    density = ((edgeCount / maxEdges) * 100).toFixed(3);
  }

  return {
    nodeCount,
    edgeCount,
    languages,
    technologies,
    packages,
    density
  };
}
