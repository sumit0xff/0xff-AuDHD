import { grammarRegistry } from '../registry';

grammarRegistry.register({
  id: 'json',
  extensions: ['.json'],
  wasmPath: 'tree-sitter-json.wasm'
});
