import { ImportParser } from './parser';
import { ImportStatement } from './types';

/**
 * A highly optimized, regex-based import parser.
 * It does not construct an AST, allowing it to process tens of thousands of files almost instantly.
 * Note: Regex has known limitations with extremely complex multiline comments, 
 * but it serves as a blisteringly fast foundation.
 */
export class RegexImportParser implements ImportParser {
  // Matches:
  // import ... from "specifier"
  // import "specifier"
  // export ... from "specifier"
  // import("specifier")
  // require("specifier")
  // Optionally handles 'type' keyword for TypeScript type-only imports
  
  private readonly IMPORT_REGEX = /(?:import|export)(?:\s+type)?\s+(?:[^"']+from\s+)?['"]([^"']+)['"]|import\s*\(\s*['"]([^"']+)['"]\s*\)|require\s*\(\s*['"]([^"']+)['"]\s*\)/g;
  private readonly TYPE_REGEX = /(?:import|export)\s+type\s+/;

  public parse(fileContent: string): ImportStatement[] {
    const statements: ImportStatement[] = [];
    
    // Quick heuristic to ignore massive block comments by removing them before regex matching.
    // This is safe because we only extract imports, not rewrite the source.
    const cleanContent = fileContent.replace(/\/\*[\s\S]*?\*\//g, '');
    
    let match;
    while ((match = this.IMPORT_REGEX.exec(cleanContent)) !== null) {
      // match[1] = static import/export
      // match[2] = dynamic import()
      // match[3] = require()
      const specifier = match[1] || match[2] || match[3];
      if (!specifier) continue;

      const raw = match[0];
      const isDynamic = !!match[2];
      const isTypeOnly = this.TYPE_REGEX.test(raw);

      statements.push({
        specifier,
        isDynamic,
        isTypeOnly,
        raw
      });
    }

    return statements;
  }
}
