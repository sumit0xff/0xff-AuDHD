export type DependencyType = 
  | 'Production'
  | 'Development'
  | 'Peer'
  | 'Optional'
  | 'Workspace'
  | 'Bundled';

export type PackageCategory =
  | 'Framework'
  | 'Runtime'
  | 'Testing'
  | 'Linting'
  | 'Formatting'
  | 'Bundler'
  | 'Database'
  | 'ORM'
  | 'Authentication'
  | 'Styling'
  | 'Build'
  | 'Utilities'
  | 'Developer Tooling'
  | 'Unknown';

export interface DependencyNode {
  readonly id: string;
  readonly packageName: string;
  readonly version: string;
  readonly dependencyType: DependencyType;
  readonly source: string;
  readonly category: PackageCategory;
  readonly workspace: boolean;
}

export interface DependencyEdge {
  readonly from: string;
  readonly to: string;
  readonly relationship: string;
}

export interface DependencyGraph {
  readonly nodes: Map<string, DependencyNode>;
  readonly edges: DependencyEdge[];
}

export interface PackageCategoryCount {
  category: PackageCategory;
  count: number;
}

export interface DependencyAnalysisResult {
  productionDependencies: number;
  developmentDependencies: number;
  peerDependencies: number;
  optionalDependencies: number;
  workspaceDependencies: number;
  bundledDependencies: number;
  totalDependencies: number;
  packageManager: string | null;
  workspace: boolean;
  graph: DependencyGraph;
  categories: PackageCategoryCount[];
  analysisTimeMs: number;
}
