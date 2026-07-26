export const DEFAULT_IGNORES = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.cache',
  'turbo',
  '.vercel'
]);

export function shouldIgnoreDirectory(name: string): boolean {
  if (DEFAULT_IGNORES.has(name)) {
    return true;
  }
  
  // Ignore hidden system files/directories except .github, .vscode, etc. (for now, simply relying on DEFAULT_IGNORES)
  // In the future, this can be expanded to check .gitignore or .0xffignore
  
  return false;
}
