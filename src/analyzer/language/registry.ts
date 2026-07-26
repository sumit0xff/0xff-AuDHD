import { LanguageDefinition } from './types';

export const LANGUAGES: readonly LanguageDefinition[] = [
  { id: 'typescript', displayName: 'TypeScript', extensions: ['.ts', '.tsx', '.mts', '.cts'] },
  { id: 'javascript', displayName: 'JavaScript', extensions: ['.js', '.jsx', '.mjs', '.cjs'] },
  { id: 'json', displayName: 'JSON', extensions: ['.json', '.jsonc'] },
  { id: 'markdown', displayName: 'Markdown', extensions: ['.md', '.mdx'] },
  { id: 'html', displayName: 'HTML', extensions: ['.html', '.htm'] },
  { id: 'css', displayName: 'CSS', extensions: ['.css'] },
  { id: 'scss', displayName: 'SCSS', extensions: ['.scss'] },
  { id: 'sass', displayName: 'SASS', extensions: ['.sass'] },
  { id: 'yaml', displayName: 'YAML', extensions: ['.yml', '.yaml'] },
  { id: 'toml', displayName: 'TOML', extensions: ['.toml'] },
  { id: 'xml', displayName: 'XML', extensions: ['.xml'] },
  { id: 'svg', displayName: 'SVG', extensions: ['.svg'] },
  { id: 'sql', displayName: 'SQL', extensions: ['.sql'] },
  { id: 'shell', displayName: 'Shell', extensions: ['.sh', '.bash', '.zsh'] },
  { id: 'dockerfile', displayName: 'Dockerfile', extensions: ['.dockerfile'] }, // Note: Extension matching isn't perfect for 'Dockerfile' without extension, handled separately or via aliases in future
  { id: 'python', displayName: 'Python', extensions: ['.py', '.pyw'] },
  { id: 'java', displayName: 'Java', extensions: ['.java'] },
  { id: 'kotlin', displayName: 'Kotlin', extensions: ['.kt', '.kts'] },
  { id: 'go', displayName: 'Go', extensions: ['.go'] },
  { id: 'rust', displayName: 'Rust', extensions: ['.rs'] },
  { id: 'c', displayName: 'C', extensions: ['.c', '.h'] },
  { id: 'cpp', displayName: 'C++', extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh', '.hxx'] },
  { id: 'csharp', displayName: 'C#', extensions: ['.cs'] },
  { id: 'php', displayName: 'PHP', extensions: ['.php', '.phtml', '.php4', '.php5', '.php7', '.phps'] },
  { id: 'ruby', displayName: 'Ruby', extensions: ['.rb'] },
  { id: 'swift', displayName: 'Swift', extensions: ['.swift'] },
  { id: 'dart', displayName: 'Dart', extensions: ['.dart'] },
  { id: 'lua', displayName: 'Lua', extensions: ['.lua'] },
  { id: 'zig', displayName: 'Zig', extensions: ['.zig'] }
] as const;

// Auto-generate the extension lookup map at startup (O(1) lookup)
function buildExtensionMap(languages: readonly LanguageDefinition[]): Map<string, LanguageDefinition> {
  const map = new Map<string, LanguageDefinition>();
  for (const lang of languages) {
    for (const ext of lang.extensions) {
      map.set(ext.toLowerCase(), lang);
    }
  }
  return map;
}

export const EXTENSION_MAP: ReadonlyMap<string, LanguageDefinition> = buildExtensionMap(LANGUAGES);
