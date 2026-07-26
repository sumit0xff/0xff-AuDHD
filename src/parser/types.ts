export interface ParserDiagnostic {
  type: 'error' | 'warning';
  message: string;
  startPosition: { row: number, column: number };
  endPosition: { row: number, column: number };
}

export interface SymbolTableEntry {
  id: string;
  name: string;
  kind: 'Class' | 'Method' | 'Function' | 'Interface' | 'Type' | 'Enum' | 'Variable' | 'Constant' | 'Component' | 'Hook' | 'Export';
  filePath: string;
  startPosition: { row: number, column: number };
  endPosition: { row: number, column: number };
  parentSymbolId?: string;
  visibility?: 'public' | 'private' | 'protected';
}

export interface ParsedFile {
  tree: any; // Parser.Tree
  rootNode: any; // Parser.SyntaxNode
  language: string;
  parseTimeMs: number;
  diagnostics: ParserDiagnostic[];
  symbols: SymbolTableEntry[];
  fileHash: string;
}

export interface LanguageDefinition {
  id: string;
  extensions: string[];
  wasmPath: string; // Path to the tree-sitter .wasm grammar file
}
