import { GraphNode, NodeType } from './types';
import { generateNodeId } from './ids';

export function createNode(type: NodeType, uniqueKey: string, properties: Record<string, any> = {}): GraphNode {
  return {
    id: generateNodeId(type, uniqueKey),
    type,
    properties: Object.freeze({ ...properties })
  };
}
