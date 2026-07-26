import { KnowledgeGraph } from './graph';
import { GraphNode, GraphEdge, NodeType } from './types';

export class GraphQuery {
  constructor(private readonly graph: KnowledgeGraph) {}

  public getNode(id: string): GraphNode | undefined {
    return this.graph.rawNodes.get(id);
  }

  public getNodesByType(type: NodeType): GraphNode[] {
    const ids = this.graph.rawNodesByType.get(type);
    if (!ids) return [];
    
    const nodes: GraphNode[] = [];
    for (const id of ids) {
      const node = this.getNode(id);
      if (node) nodes.push(node);
    }
    return nodes;
  }

  public getOutboundEdges(nodeId: string): GraphEdge[] {
    const edgeIds = this.graph.rawOutboundEdges.get(nodeId);
    if (!edgeIds) return [];
    
    const edges: GraphEdge[] = [];
    for (const id of edgeIds) {
      const edge = this.graph.rawEdges.get(id);
      if (edge) edges.push(edge);
    }
    return edges;
  }

  public getInboundEdges(nodeId: string): GraphEdge[] {
    const edgeIds = this.graph.rawInboundEdges.get(nodeId);
    if (!edgeIds) return [];
    
    const edges: GraphEdge[] = [];
    for (const id of edgeIds) {
      const edge = this.graph.rawEdges.get(id);
      if (edge) edges.push(edge);
    }
    return edges;
  }
}
