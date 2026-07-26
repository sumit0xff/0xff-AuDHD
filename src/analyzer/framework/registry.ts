import { TechnologyDefinition } from './types';

export const TECHNOLOGY_REGISTRY: readonly TechnologyDefinition[] = [
  // Frameworks
  { id: 'nextjs', displayName: 'Next.js', category: 'Framework', priority: 100, matchers: [{ type: 'Dependency', value: 'next' }, { type: 'FileExists', value: 'next.config.js' }, { type: 'FileExists', value: 'next.config.mjs' }, { type: 'FileExists', value: 'next.config.ts' }] },
  { id: 'react', displayName: 'React', category: 'Framework', priority: 50, matchers: [{ type: 'Dependency', value: 'react' }] },
  { id: 'vue', displayName: 'Vue', category: 'Framework', priority: 90, matchers: [{ type: 'Dependency', value: 'vue' }, { type: 'FileExists', value: 'vue.config.js' }] },
  { id: 'angular', displayName: 'Angular', category: 'Framework', priority: 90, matchers: [{ type: 'Dependency', value: '@angular/core' }, { type: 'FileExists', value: 'angular.json' }] },
  { id: 'svelte', displayName: 'Svelte', category: 'Framework', priority: 90, matchers: [{ type: 'Dependency', value: 'svelte' }, { type: 'FileExists', value: 'svelte.config.js' }] },
  { id: 'astro', displayName: 'Astro', category: 'Framework', priority: 90, matchers: [{ type: 'Dependency', value: 'astro' }, { type: 'FileExists', value: 'astro.config.mjs' }] },
  { id: 'nuxt', displayName: 'Nuxt', category: 'Framework', priority: 100, matchers: [{ type: 'Dependency', value: 'nuxt' }, { type: 'FileExists', value: 'nuxt.config.ts' }] },
  { id: 'remix', displayName: 'Remix', category: 'Framework', priority: 90, matchers: [{ type: 'Dependency', value: '@remix-run/react' }, { type: 'FileExists', value: 'remix.config.js' }] },
  { id: 'express', displayName: 'Express', category: 'Framework', priority: 80, matchers: [{ type: 'Dependency', value: 'express' }] },
  { id: 'fastify', displayName: 'Fastify', category: 'Framework', priority: 80, matchers: [{ type: 'Dependency', value: 'fastify' }] },
  { id: 'nestjs', displayName: 'NestJS', category: 'Framework', priority: 90, matchers: [{ type: 'Dependency', value: '@nestjs/core' }, { type: 'FileExists', value: 'nest-cli.json' }] },
  { id: 'hono', displayName: 'Hono', category: 'Framework', priority: 80, matchers: [{ type: 'Dependency', value: 'hono' }] },

  // Build Tools
  { id: 'vite', displayName: 'Vite', category: 'BuildTool', priority: 90, matchers: [{ type: 'DevDependency', value: 'vite' }, { type: 'FileExists', value: 'vite.config.ts' }, { type: 'FileExists', value: 'vite.config.js' }] },
  { id: 'turbopack', displayName: 'Turbopack', category: 'BuildTool', priority: 80, matchers: [{ type: 'JsonKey', file: 'package.json', jsonPath: 'scripts', value: '--turbo' }] }, // Basic heuristic
  { id: 'webpack', displayName: 'Webpack', category: 'BuildTool', priority: 80, matchers: [{ type: 'DevDependency', value: 'webpack' }, { type: 'FileExists', value: 'webpack.config.js' }] },
  { id: 'rollup', displayName: 'Rollup', category: 'BuildTool', priority: 80, matchers: [{ type: 'DevDependency', value: 'rollup' }, { type: 'FileExists', value: 'rollup.config.js' }] },
  { id: 'rspack', displayName: 'Rspack', category: 'BuildTool', priority: 80, matchers: [{ type: 'DevDependency', value: '@rspack/core' }, { type: 'FileExists', value: 'rspack.config.js' }] },
  { id: 'parcel', displayName: 'Parcel', category: 'BuildTool', priority: 80, matchers: [{ type: 'DevDependency', value: 'parcel' }] },
  
  // Styling
  { id: 'tailwindcss', displayName: 'Tailwind CSS', category: 'Styling', priority: 90, matchers: [{ type: 'DevDependency', value: 'tailwindcss' }, { type: 'Dependency', value: 'tailwindcss' }, { type: 'FileExists', value: 'tailwind.config.js' }, { type: 'FileExists', value: 'tailwind.config.ts' }] },
  { id: 'sass', displayName: 'Sass', category: 'Styling', priority: 80, matchers: [{ type: 'DevDependency', value: 'sass' }, { type: 'Dependency', value: 'sass' }] },
  { id: 'less', displayName: 'Less', category: 'Styling', priority: 80, matchers: [{ type: 'DevDependency', value: 'less' }] },
  { id: 'styledcomponents', displayName: 'Styled Components', category: 'Styling', priority: 80, matchers: [{ type: 'Dependency', value: 'styled-components' }] },

  // Databases / ORM
  { id: 'prisma', displayName: 'Prisma', category: 'Database', priority: 90, matchers: [{ type: 'Dependency', value: '@prisma/client' }, { type: 'DevDependency', value: 'prisma' }, { type: 'FileExists', value: 'prisma/schema.prisma' }] },
  { id: 'drizzle', displayName: 'Drizzle', category: 'Database', priority: 90, matchers: [{ type: 'Dependency', value: 'drizzle-orm' }, { type: 'FileExists', value: 'drizzle.config.ts' }] },
  { id: 'mongoose', displayName: 'Mongoose', category: 'Database', priority: 80, matchers: [{ type: 'Dependency', value: 'mongoose' }] },
  { id: 'typeorm', displayName: 'TypeORM', category: 'Database', priority: 80, matchers: [{ type: 'Dependency', value: 'typeorm' }] },
  { id: 'sequelize', displayName: 'Sequelize', category: 'Database', priority: 80, matchers: [{ type: 'Dependency', value: 'sequelize' }] },

  // Testing
  { id: 'vitest', displayName: 'Vitest', category: 'Testing', priority: 90, matchers: [{ type: 'DevDependency', value: 'vitest' }, { type: 'FileExists', value: 'vitest.config.ts' }] },
  { id: 'jest', displayName: 'Jest', category: 'Testing', priority: 90, matchers: [{ type: 'DevDependency', value: 'jest' }, { type: 'FileExists', value: 'jest.config.js' }] },
  { id: 'playwright', displayName: 'Playwright', category: 'Testing', priority: 90, matchers: [{ type: 'DevDependency', value: '@playwright/test' }, { type: 'FileExists', value: 'playwright.config.ts' }] },
  { id: 'cypress', displayName: 'Cypress', category: 'Testing', priority: 90, matchers: [{ type: 'DevDependency', value: 'cypress' }, { type: 'FileExists', value: 'cypress.config.ts' }] },

  // Tooling
  { id: 'eslint', displayName: 'ESLint', category: 'Tooling', priority: 90, matchers: [{ type: 'DevDependency', value: 'eslint' }, { type: 'FileExists', value: '.eslintrc.json' }, { type: 'FileExists', value: 'eslint.config.js' }] },
  { id: 'prettier', displayName: 'Prettier', category: 'Tooling', priority: 90, matchers: [{ type: 'DevDependency', value: 'prettier' }, { type: 'FileExists', value: '.prettierrc' }, { type: 'FileExists', value: 'prettier.config.js' }] },
  { id: 'husky', displayName: 'Husky', category: 'Tooling', priority: 80, matchers: [{ type: 'DevDependency', value: 'husky' }] },
  { id: 'typescript', displayName: 'TypeScript', category: 'Tooling', priority: 100, matchers: [{ type: 'DevDependency', value: 'typescript' }, { type: 'FileExists', value: 'tsconfig.json' }] },

  // Package Managers
  { id: 'npm', displayName: 'npm', category: 'PackageManager', priority: 50, matchers: [{ type: 'FileExists', value: 'package-lock.json' }] },
  { id: 'pnpm', displayName: 'pnpm', category: 'PackageManager', priority: 90, matchers: [{ type: 'FileExists', value: 'pnpm-lock.yaml' }] },
  { id: 'yarn', displayName: 'Yarn', category: 'PackageManager', priority: 80, matchers: [{ type: 'FileExists', value: 'yarn.lock' }] },
  { id: 'bun', displayName: 'Bun', category: 'PackageManager', priority: 90, matchers: [{ type: 'FileExists', value: 'bun.lockb' }] },

  // Deployment
  { id: 'vercel', displayName: 'Vercel', category: 'Deployment', priority: 90, matchers: [{ type: 'FileExists', value: 'vercel.json' }] },
  { id: 'netlify', displayName: 'Netlify', category: 'Deployment', priority: 90, matchers: [{ type: 'FileExists', value: 'netlify.toml' }] },
  { id: 'cloudflareworkers', displayName: 'Cloudflare Workers', category: 'Deployment', priority: 90, matchers: [{ type: 'FileExists', value: 'wrangler.toml' }] },
  { id: 'docker', displayName: 'Docker', category: 'Deployment', priority: 80, matchers: [{ type: 'FileExists', value: 'Dockerfile' }, { type: 'FileExists', value: 'docker-compose.yml' }] },

  // Monorepo
  { id: 'turborepo', displayName: 'TurboRepo', category: 'Monorepo', priority: 100, matchers: [{ type: 'DevDependency', value: 'turbo' }, { type: 'FileExists', value: 'turbo.json' }] },
  { id: 'nx', displayName: 'Nx', category: 'Monorepo', priority: 100, matchers: [{ type: 'DevDependency', value: 'nx' }, { type: 'FileExists', value: 'nx.json' }] },
  
  // Runtime
  { id: 'nodejs', displayName: 'Node.js', category: 'Runtime', priority: 50, matchers: [{ type: 'FileExists', value: 'package.json' }] },
  { id: 'bun_runtime', displayName: 'Bun', category: 'Runtime', priority: 60, matchers: [{ type: 'FileExists', value: 'bun.lockb' }] }
];
