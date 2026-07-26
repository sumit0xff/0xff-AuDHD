export interface ImportStatement {
  readonly specifier: string;
  readonly isDynamic: boolean;
  readonly isTypeOnly: boolean;
  readonly raw: string;
}

export interface CircularDependency {
  readonly id: string;
  readonly cycle: string[]; // Array of node IDs representing the cycle
  readonly length: number;
}

export interface ImportDiagnostics {
  resolvedImports: number;
  unresolvedImports: number;
  externalPackages: number;
  localImports: number;
  dynamicImports: number;
  typeOnlyImports: number;
}

export interface ImportAnalysisResult {
  diagnostics: ImportDiagnostics;
  circularDependencies: CircularDependency[];
  entryPoints: string[]; // Array of file node IDs
  orphanFiles: string[]; // Array of file node IDs
  analysisTimeMs: number;
}
