import { KnowledgeGraph } from './graph';

export function serializeToJson(graph: KnowledgeGraph): string {
  // Maps cannot be directly serialized to JSON natively
  const nodes = Array.from(graph.rawNodes.values());
  const edges = Array.from(graph.rawEdges.values());
  
  return JSON.stringify({ nodes, edges }, null, 2);
}
