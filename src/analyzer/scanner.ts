import * as fs from 'fs/promises';
import * as path from 'path';
import { shouldIgnoreDirectory } from './ignore';
import { createDirectoryNode, createFileNode } from './tree';
import { FileMetadata, TreeNode } from './types';

export interface ScannerResult {
  files: FileMetadata[];
  tree: TreeNode;
  totalFiles: number;
  totalDirectories: number;
}

export async function walkDirectory(
  currentAbsPath: string, 
  rootAbsPath: string, 
  depth: number = 0
): Promise<{ files: FileMetadata[], tree: TreeNode, dirsCount: number }> {
  
  const entries = await fs.readdir(currentAbsPath, { withFileTypes: true });
  
  let files: FileMetadata[] = [];
  let dirsCount = 0;
  
  const dirName = path.basename(currentAbsPath);
  const treeNode = createDirectoryNode(dirName || rootAbsPath, currentAbsPath);

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (shouldIgnoreDirectory(entry.name)) {
        continue;
      }
      dirsCount++;
      const nextAbsPath = path.join(currentAbsPath, entry.name);
      const childResult = await walkDirectory(nextAbsPath, rootAbsPath, depth + 1);
      
      files = files.concat(childResult.files);
      dirsCount += childResult.dirsCount;
      treeNode.children.push(childResult.tree);
    } else {
      const filePath = path.join(currentAbsPath, entry.name);
      
      // Get file size. Using try/catch to gracefully handle unreadable files
      let size = 0;
      try {
        const stats = await fs.stat(filePath);
        size = stats.size;
      } catch (err) {
        // Ignore stats errors for now
      }

      const metadata: FileMetadata = {
        absolutePath: filePath,
        relativePath: path.relative(rootAbsPath, filePath).replace(/\\/g, '/'),
        name: entry.name,
        extension: path.extname(entry.name),
        directory: path.dirname(filePath),
        size,
        isDirectory: false,
        depth
      };

      files.push(metadata);
      treeNode.children.push(createFileNode(entry.name, filePath, metadata));
    }
  }

  return { files, tree: treeNode, dirsCount };
}
