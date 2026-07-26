import { grammarRegistry } from '../registry';

grammarRegistry.register({
  id: 'javascript',
  extensions: ['.js', '.jsx', '.mjs', '.cjs'],
  wasmPath: 'tree-sitter-javascript.wasm'
});
