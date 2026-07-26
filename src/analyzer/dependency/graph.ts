import { DependencyEdge, DependencyGraph, DependencyNode, DependencyType } from './types';
import { classifyPackage } from './registry';

export class GraphBuilder {
  private nodes = new Map<string, DependencyNode>();
  private edges: DependencyEdge[] = [];

  public addDependency(
    pkgName: string, 
    version: string, 
    type: DependencyType, 
    source: string, 
    isWorkspace: boolean
  ) {
    const id = `${pkgName}@${version}`;
    
    // Avoid overriding a stronger dependency type if already present (e.g. Prod overrides Dev)
    if (!this.nodes.has(id) || type === 'Production') {
      this.nodes.set(id, {
        id,
        packageName: pkgName,
        version,
        dependencyType: type,
        source,
        category: classifyPackage(pkgName),
        workspace: isWorkspace
      });
    }

    // In a full implementation, we'd map edges from 'root' or package-to-package.
    // For now, we connect everything to 'root'
    this.edges.push({
      from: 'root',
      to: id,
      relationship: type
    });
  }

  public build(): DependencyGraph {
    return {
      nodes: this.nodes,
      edges: this.edges
    };
  }
}
