import { grammarRegistry } from '../registry';

grammarRegistry.register({
  id: 'typescript',
  extensions: ['.ts', '.tsx'],
  wasmPath: 'tree-sitter-typescript.wasm'
});
