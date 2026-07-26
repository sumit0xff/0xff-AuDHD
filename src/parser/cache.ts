import { ParsedFile } from './types';
import * as crypto from 'crypto';

export class ParserCache {
  private readonly _cache = new Map<string, ParsedFile>();

  public get(filePath: string, currentFileHash: string): ParsedFile | null {
    const cached = this._cache.get(filePath);
    if (cached && cached.fileHash === currentFileHash) {
      return cached;
    }
    return null;
  }

  public getRawTree(filePath: string): any | null {
    return this._cache.get(filePath)?.tree || null;
  }

  public set(filePath: string, parsedFile: ParsedFile): void {
    this._cache.set(filePath, parsedFile);
  }

  public get size(): number {
    return this._cache.size;
  }

  public generateHash(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }
}
