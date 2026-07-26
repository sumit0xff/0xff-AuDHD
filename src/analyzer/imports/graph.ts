import { KnowledgeGraph, GraphQuery, generateNodeId } from '../graph';
import { CircularDependency } from './types';

export class ImportGraphAlgorithms {
  private query: GraphQuery;

  constructor(private readonly graph: KnowledgeGraph) {
    this.query = new GraphQuery(graph);
  }

  /**
   * Tarjan's Strongly Connected Components Algorithm to detect circular dependencies.
   */
  public detectCycles(): CircularDependency[] {
    const files = this.query.getNodesByType('File');
    
    let index = 0;
    const indices = new Map<string, number>();
    const lowlink = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const cycles: CircularDependency[] = [];

    const strongconnect = (nodeId: string) => {
      indices.set(nodeId, index);
      lowlink.set(nodeId, index);
      index++;
      stack.push(nodeId);
      onStack.add(nodeId);

      // Find outbound IMPORTS edges
      const outbound = this.query.getOutboundEdges(nodeId).filter(e => e.type === 'IMPORTS');
      
      for (const edge of outbound) {
        const w = edge.to;
        if (!indices.has(w)) {
          strongconnect(w);
          lowlink.set(nodeId, Math.min(lowlink.get(nodeId)!, lowlink.get(w)!));
        } else if (onStack.has(w)) {
          lowlink.set(nodeId, Math.min(lowlink.get(nodeId)!, indices.get(w)!));
        }
      }

      if (lowlink.get(nodeId) === indices.get(nodeId)) {
        const component: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack.delete(w);
          component.push(w);
        } while (w !== nodeId);

        // A cycle must have more than 1 node
        if (component.length > 1) {
          cycles.push({
            id: `cycle-${cycles.length}`,
            cycle: component.reverse(),
            length: component.length
          });
        }
      }
    };

    for (const file of files) {
      if (!indices.has(file.id)) {
        strongconnect(file.id);
      }
    }

    return cycles;
  }

  public detectEntryPointsAndOrphans(): { entryPoints: string[], orphans: string[] } {
    const files = this.query.getNodesByType('File');
    const entryPoints: string[] = [];
    const orphans: string[] = [];

    const ENTRY_PATTERNS = [
      /index\.[tj]sx?$/,
      /main\.[tj]sx?$/,
      /app\.[tj]sx?$/,
      /server\.[tj]sx?$/,
      /cli\.[tj]sx?$/,
      /bin\.[tj]sx?$/
    ];

    for (const file of files) {
      const inbound = this.query.getInboundEdges(file.id).filter(e => e.type === 'IMPORTS').length;
      const outbound = this.query.getOutboundEdges(file.id).filter(e => e.type === 'IMPORTS').length;

      const isLikelyEntryPoint = ENTRY_PATTERNS.some(p => p.test(file.properties.name || ''));

      // 0 inbound, >0 outbound = pure entry point. 
      // If it matches a known pattern it's an entry point even if it has 0 outbound.
      if (inbound === 0 && (outbound > 0 || isLikelyEntryPoint)) {
        entryPoints.push(file.id);
      } 
      // 0 inbound, 0 outbound, not an entry pattern = orphan (isolated module)
      else if (inbound === 0 && outbound === 0 && !isLikelyEntryPoint) {
        // Do not flag test files as orphans by default
        if (!file.properties.name.includes('.test.') && !file.properties.name.includes('.spec.')) {
          orphans.push(file.id);
        }
      }
    }

    return { entryPoints, orphans };
  }
}
