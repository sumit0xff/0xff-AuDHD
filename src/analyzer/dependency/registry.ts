import { PackageCategory } from './types';

// A lightweight registry mapping known package scopes or exact names to categories.
// This allows the dependency graph to enrich nodes without complex AST parsing.
export const PACKAGE_CLASSIFICATION: Record<string, PackageCategory> = {
  // Frameworks
  'react': 'Framework',
  'react-dom': 'Framework',
  'next': 'Framework',
  'vue': 'Framework',
  'svelte': 'Framework',
  '@angular/core': 'Framework',
  
  // Build/Bundler
  'vite': 'Bundler',
  'webpack': 'Bundler',
  'rollup': 'Bundler',
  'esbuild': 'Bundler',
  'tsc': 'Build',
  'typescript': 'Build',

  // Testing
  'jest': 'Testing',
  'vitest': 'Testing',
  'cypress': 'Testing',
  '@playwright/test': 'Testing',
  'mocha': 'Testing',
  
  // Linting/Formatting
  'eslint': 'Linting',
  'prettier': 'Formatting',
  
  // Styling
  'tailwindcss': 'Styling',
  'sass': 'Styling',
  'styled-components': 'Styling',
  
  // Database / ORM
  'prisma': 'ORM',
  '@prisma/client': 'ORM',
  'mongoose': 'ORM',
  'typeorm': 'ORM',
  'drizzle-orm': 'ORM',
  
  // Auth
  'next-auth': 'Authentication',
  'passport': 'Authentication',
  
  // Utilities
  'lodash': 'Utilities',
  'date-fns': 'Utilities',
  'axios': 'Utilities',
  
  // Dev Tooling
  'nodemon': 'Developer Tooling',
  'ts-node': 'Developer Tooling',
  'tsx': 'Developer Tooling',
  'husky': 'Developer Tooling',
};

export function classifyPackage(packageName: string): PackageCategory {
  // Exact match
  if (PACKAGE_CLASSIFICATION[packageName]) {
    return PACKAGE_CLASSIFICATION[packageName];
  }
  
  // Scope match (e.g. @babel/core -> Build)
  if (packageName.startsWith('@babel/')) return 'Build';
  if (packageName.startsWith('@types/')) return 'Developer Tooling';
  if (packageName.startsWith('@eslint/')) return 'Linting';
  if (packageName.startsWith('@typescript-eslint/')) return 'Linting';

  return 'Unknown';
}
