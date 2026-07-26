import { GraphNode, GraphEdge } from './types';

/**
 * Immutable graph representation with O(1) lookup and adjacency lists.
 * Suitable for millions of nodes. 
 */
export class KnowledgeGraph {
  // Flat storage
  private readonly _nodes = new Map<string, GraphNode>();
  private readonly _edges = new Map<string, GraphEdge>();
  
  // Type indexing for O(1) bulk retrieval
  private readonly _nodesByType = new Map<string, Set<string>>();

  // Adjacency lists for fast traversal
  // node_id -> set of edge_ids where node_id is the source
  private readonly _outboundEdges = new Map<string, Set<string>>();
  
  // node_id -> set of edge_ids where node_id is the target
  private readonly _inboundEdges = new Map<string, Set<string>>();

  public addNode(node: GraphNode): void {
    if (!this._nodes.has(node.id)) {
      this._nodes.set(node.id, node);
      
      let typeSet = this._nodesByType.get(node.type);
      if (!typeSet) {
        typeSet = new Set();
        this._nodesByType.set(node.type, typeSet);
      }
      typeSet.add(node.id);
    }
  }

  public addEdge(edge: GraphEdge): void {
    if (!this._edges.has(edge.id)) {
      this._edges.set(edge.id, edge);

      // Outbound
      let outSet = this._outboundEdges.get(edge.from);
      if (!outSet) {
        outSet = new Set();
        this._outboundEdges.set(edge.from, outSet);
      }
      outSet.add(edge.id);

      // Inbound
      let inSet = this._inboundEdges.get(edge.to);
      if (!inSet) {
        inSet = new Set();
        this._inboundEdges.set(edge.to, inSet);
      }
      inSet.add(edge.id);
    }
  }

  // Basic accessors (passed down to query layer usually)
  public get rawNodes() { return this._nodes; }
  public get rawEdges() { return this._edges; }
  public get rawNodesByType() { return this._nodesByType; }
  public get rawOutboundEdges() { return this._outboundEdges; }
  public get rawInboundEdges() { return this._inboundEdges; }
}
