import { ImportStatement } from './types';

/**
 * The unified parser interface for extracting import statements.
 * Designed to allow hot-swapping between fast Regex and accurate AST parsers 
 * (e.g., TS Compiler API, Babel, SWC) without modifying the analyzer logic.
 */
export interface ImportParser {
  parse(fileContent: string): ImportStatement[];
}
