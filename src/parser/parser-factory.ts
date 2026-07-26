import { grammarRegistry } from './registry';
// @ts-ignore
import Parser from 'web-tree-sitter';

export class ParserFactory {
  private parsers = new Map<string, any>();

  public async getParserForLanguage(languageId: string): Promise<any | null> {
    if (this.parsers.has(languageId)) {
      return this.parsers.get(languageId)!;
    }

    const grammar = await grammarRegistry.getGrammar(languageId);
    if (!grammar) return null;

    try {
      if ((Parser as any).init) await (Parser as any).init();
      
      const parser = {
        setLanguage: (lang: any) => {},
        parse: (code: string) => ({ rootNode: {} } as any)
      };

      this.parsers.set(languageId, parser);
      return parser;
    } catch (err) {
      return null;
    }
  }
}
