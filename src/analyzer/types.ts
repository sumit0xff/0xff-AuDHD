export interface FileMetadata {
  absolutePath: string;
  relativePath: string;
  name: string;
  extension: string;
  directory: string;
  size: number;
  isDirectory: boolean;
  depth: number;
}

export interface TreeNode {
  name: string;
  isDirectory: boolean;
  path: string;
  children: TreeNode[];
  metadata?: FileMetadata;
}

export interface ScanResult {
  root: string;
  files: FileMetadata[];
  tree: TreeNode;
  totalFiles: number;
  totalDirectories: number;
  durationMs: number;
  scannedAt: Date;
}
