import { ScanResult } from '../types';
import { FileCache } from './readers';

/**
 * Detects if the repository is a workspace monorepo by checking for 
 * known workspace configuration files or package.json configurations.
 */
export async function detectWorkspace(scanResult: ScanResult, cache: FileCache): Promise<boolean> {
  // Check common workspace lockfiles/configs directly via the scanResult files metadata
  const hasWorkspaceConfig = scanResult.files.some(f => 
    f.relativePath === 'pnpm-workspace.yaml' || 
    f.relativePath === 'lerna.json' || 
    f.relativePath === 'rush.json' ||
    f.relativePath === 'nx.json' ||
    f.relativePath === 'turbo.json'
  );

  if (hasWorkspaceConfig) return true;

  // Check package.json for npm/yarn workspaces
  const packageJson = await cache.getPackageJson();
  if (packageJson && packageJson.workspaces) {
    return true;
  }

  return false;
}
