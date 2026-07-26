import { FileCache as BaseFileCache } from '../framework/readers';

export class ParserCache extends BaseFileCache {
  // Can be extended in the future for AST caching if a Babel/SWC parser is introduced.
  // For Regex parsing, the string fileContentCache in BaseFileCache is perfectly sufficient.
}
