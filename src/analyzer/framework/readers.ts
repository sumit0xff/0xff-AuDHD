import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Lazy, cached readers for project metadata files.
 * Guarantees that we never read or parse the same file twice.
 */
export class FileCache {
  private fileContentCache = new Map<string, string | null>();
  private jsonCache = new Map<string, any | null>();

  constructor(private readonly rootDir: string) {}

  public async readFile(relativePath: string): Promise<string | null> {
    const key = relativePath.toLowerCase();
    
    if (this.fileContentCache.has(key)) {
      return this.fileContentCache.get(key)!;
    }

    try {
      const fullPath = path.join(this.rootDir, relativePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      this.fileContentCache.set(key, content);
      return content;
    } catch (err) {
      this.fileContentCache.set(key, null);
      return null;
    }
  }

  public async readJson(relativePath: string): Promise<any | null> {
    const key = relativePath.toLowerCase();

    if (this.jsonCache.has(key)) {
      return this.jsonCache.get(key);
    }

    const content = await this.readFile(relativePath);
    if (!content) {
      this.jsonCache.set(key, null);
      return null;
    }

    try {
      const parsed = JSON.parse(content);
      this.jsonCache.set(key, parsed);
      return parsed;
    } catch (err) {
      this.jsonCache.set(key, null);
      return null;
    }
  }
  
  public async getPackageJson(): Promise<any | null> {
    return this.readJson('package.json');
  }
}
