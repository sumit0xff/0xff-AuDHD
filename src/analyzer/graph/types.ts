export type NodeType =
  | 'Repository'
  | 'Directory'
  | 'File'
  | 'Language'
  | 'Technology'
  | 'Framework'
  | 'Package'
  | 'Workspace'
  | 'Configuration'
  | 'Runtime'
  | 'PackageManager'
  | 'Deployment'
  | string; // Future compatibility (e.g. 'Import', 'Module', 'Symbol', etc.)

export type EdgeType =
  | 'CONTAINS'
  | 'USES'
  | 'DEPENDS_ON'
  | 'CONFIGURES'
  | 'BELONGS_TO'
  | 'GENERATED_BY'
  | 'WORKSPACE_OF'
  | 'PART_OF'
  | string; // Future compatibility (e.g. 'IMPORTS', 'CALLS', 'IMPLEMENTS', etc.)

export interface GraphNode {
  readonly id: string;
  readonly type: NodeType;
  readonly properties: Readonly<Record<string, any>>;
}

export interface GraphEdge {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly type: EdgeType;
  readonly metadata?: Readonly<Record<string, any>>;
}

export interface ValidationDiagnostic {
  type: 'orphan_edge' | 'dangling_node' | 'self_loop' | 'duplicate_id';
  message: string;
  entityId: string;
}

export interface ValidationResult {
  valid: boolean;
  diagnostics: ValidationDiagnostic[];
}

export interface GraphStatistics {
  nodeCount: number;
  edgeCount: number;
  languages: number;
  technologies: number;
  packages: number;
  density: string;
}
