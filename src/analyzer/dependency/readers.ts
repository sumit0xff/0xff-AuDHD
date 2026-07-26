import { FileCache as BaseFileCache } from '../framework/readers';
// Re-export and potentially extend the FileCache from the framework layer
// to ensure we share the exact same caching mechanics.
export { FileCache } from '../framework/readers';
