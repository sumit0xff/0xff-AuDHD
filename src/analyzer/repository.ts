import * as path from 'path';
import { performance } from 'perf_hooks';
import { walkDirectory } from './scanner';
import { ScanResult } from './types';

export async function scanRepository(cwd: string): Promise<ScanResult> {
  const absoluteRoot = path.resolve(cwd);
  
  const startTime = performance.now();
  
  const { files, tree, dirsCount } = await walkDirectory(absoluteRoot, absoluteRoot, 0);
  
  // Sort files deterministically by relative path
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  
  const endTime = performance.now();
  const durationMs = Math.round(endTime - startTime);

  return {
    root: absoluteRoot,
    files,
    tree,
    totalFiles: files.length,
    totalDirectories: dirsCount,
    durationMs,
    scannedAt: new Date()
  };
}
