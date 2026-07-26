import { GraphEdge, EdgeType } from './types';
import { generateEdgeId } from './ids';

export function createEdge(from: string, to: string, type: EdgeType, metadata?: Record<string, any>): GraphEdge {
  return {
    id: generateEdgeId(from, to, type),
    from,
    to,
    type,
    metadata: metadata ? Object.freeze({ ...metadata }) : undefined
  };
}
