import { NodeType, EdgeType } from './types';

/**
 * Deterministic ID generation based on node type and unique key.
 * Never uses random UUIDs. The same repository analyzed twice produces identical IDs.
 */
export function generateNodeId(type: NodeType, uniqueKey: string): string {
  // Replace slashes or special chars if necessary, but string concatenation is fast and unique
  return `${type}::${uniqueKey}`;
}

export function generateEdgeId(from: string, to: string, type: EdgeType): string {
  return `${from}-[:${type}]->${to}`;
}
