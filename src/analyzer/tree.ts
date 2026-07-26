import { TreeNode, FileMetadata } from './types';

export function createDirectoryNode(name: string, path: string): TreeNode {
  return {
    name,
    isDirectory: true,
    path,
    children: []
  };
}

export function createFileNode(name: string, path: string, metadata: FileMetadata): TreeNode {
  return {
    name,
    isDirectory: false,
    path,
    children: [],
    metadata
  };
}
