import { performance } from 'perf_hooks';
import { ParserCache } from './cache';
import { ParserFactory } from './parser-factory';
import { grammarRegistry } from './registry';
import { SymbolExtractor } from './symbol';
import { ParsedFile } from './types';

export class ParserEngine {
  private cache = new ParserCache();
  private factory = new ParserFactory();
  private symbolExtractor = new SymbolExtractor();
  
  public metrics = {
    filesParsed: 0,
    cacheHits: 0,
    totalParseTimeMs: 0,
    totalSymbols: 0
  };

  public async parse(filePath: string, content: string, extension: string): Promise<ParsedFile | null> {
    const langId = grammarRegistry.getLanguageIdByExtension(extension);
    if (!langId) return null;

    const hash = this.cache.generateHash(content);
    const cached = this.cache.get(filePath, hash);
    if (cached) {
      this.metrics.cacheHits++;
      return cached;
    }

    const startTime = performance.now();
    
    const parser = await this.factory.getParserForLanguage(langId);
    if (!parser) return null;

    // We pass the string to tree-sitter. In real env it parses, here it's mocked.
    const tree = parser.parse(content);
    
    const parseTimeMs = Math.round(performance.now() - startTime);
    
    const symbols = this.symbolExtractor.extract(tree, langId, filePath);

    const parsedFile: ParsedFile = {
      tree,
      rootNode: tree.rootNode,
      language: langId,
      parseTimeMs,
      diagnostics: [], // Placeholder for real error checks
      symbols,
      fileHash: hash
    };

    this.cache.set(filePath, parsedFile);
    
    this.metrics.filesParsed++;
    this.metrics.totalParseTimeMs += parseTimeMs;
    this.metrics.totalSymbols += symbols.length;

    return parsedFile;
  }

  public getCacheSize(): number {
    return this.cache.size;
  }
  
  public getLanguagesLoaded(): number {
    return grammarRegistry.loadedCount;
  }
}

export const parserEngine = new ParserEngine();
