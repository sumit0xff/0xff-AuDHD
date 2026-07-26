import { LanguageDefinition } from './types';
// @ts-ignore
import Parser from 'web-tree-sitter';

class GrammarRegistry {
  private readonly languages = new Map<string, LanguageDefinition>();
  private readonly extensionMap = new Map<string, string>();
  private readonly loadedGrammars = new Map<string, any>();

  public register(def: LanguageDefinition) {
    this.languages.set(def.id, def);
    for (const ext of def.extensions) {
      this.extensionMap.set(ext.toLowerCase(), def.id);
    }
  }

  public getLanguageIdByExtension(extension: string): string | null {
    return this.extensionMap.get(extension.toLowerCase()) || null;
  }

  public async getGrammar(languageId: string): Promise<any | null> {
    if (this.loadedGrammars.has(languageId)) {
      return this.loadedGrammars.get(languageId)!;
    }
    
    const def = this.languages.get(languageId);
    if (!def) return null;

    try {
      if ((Parser as any).init) await (Parser as any).init();
      const mockLang = {};
      this.loadedGrammars.set(languageId, mockLang);
      return mockLang;
    } catch (err) {
      return null;
    }
  }

  public get loadedCount(): number {
    return this.loadedGrammars.size;
  }
}

export const grammarRegistry = new GrammarRegistry();
