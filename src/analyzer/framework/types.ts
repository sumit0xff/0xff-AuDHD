export type TechnologyCategory = 
  | 'Framework'
  | 'BuildTool'
  | 'Styling'
  | 'Database'
  | 'Testing'
  | 'Tooling'
  | 'PackageManager'
  | 'Deployment'
  | 'Monorepo'
  | 'Runtime';

export type MatcherType = 
  | 'Dependency'
  | 'DevDependency'
  | 'PeerDependency'
  | 'FileExists'
  | 'JsonKey'
  | 'JsonValue';

export interface Matcher {
  type: MatcherType;
  value: string;
  // For JSON matches, specifies the file (default: package.json)
  file?: string;
  // For JSON matches, the path/key to look for
  jsonPath?: string;
}

export interface TechnologyDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly category: TechnologyCategory;
  readonly priority: number;
  readonly matchers: readonly Matcher[];
}

export interface Evidence {
  type: MatcherType;
  source: string;
  value: string;
  matchedBy: Matcher;
}

export interface ProjectTechnology {
  id: string;
  displayName: string;
  category: TechnologyCategory;
  version?: string;
  confidence: number;
  evidence: Evidence[];
}

export interface FrameworkDetectionResult {
  technologies: ProjectTechnology[];
  runtime: ProjectTechnology | null;
  packageManager: ProjectTechnology | null;
  deployment: ProjectTechnology | null;
  monorepo: ProjectTechnology | null;
  averageConfidence: number;
  analysisTimeMs: number;
}
