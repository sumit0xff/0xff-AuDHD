import { KnowledgeGraph } from './graph';
import { ValidationResult, ValidationDiagnostic } from './types';

export function validateGraph(graph: KnowledgeGraph): ValidationResult {
  const diagnostics: ValidationDiagnostic[] = [];
  let valid = true;

  // We check for orphan edges (edges pointing to non-existent nodes)
  // Duplicate IDs are inherently prevented by Map, but we can verify edge integrity.

  for (const edge of graph.rawEdges.values()) {
    if (!graph.rawNodes.has(edge.from)) {
      valid = false;
      diagnostics.push({
        type: 'orphan_edge',
        message: `Edge ${edge.id} references missing source node ${edge.from}`,
        entityId: edge.id
      });
    }

    if (!graph.rawNodes.has(edge.to)) {
      valid = false;
      diagnostics.push({
        type: 'orphan_edge',
        message: `Edge ${edge.id} references missing target node ${edge.to}`,
        entityId: edge.id
      });
    }
    
    // Check self-loop for basic containment
    if (edge.from === edge.to && edge.type !== 'REFERENCES') {
      valid = false;
      diagnostics.push({
        type: 'self_loop',
        message: `Edge ${edge.id} creates an invalid self-loop`,
        entityId: edge.id
      });
    }
  }

  return { valid, diagnostics };
}
