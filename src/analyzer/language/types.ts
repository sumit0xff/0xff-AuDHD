export interface LanguageDefinition {
  readonly id: string;
  readonly displayName: string;
  readonly extensions: readonly string[];
  readonly aliases?: readonly string[];
  readonly shebangs?: readonly string[];
}

export interface LanguageStats {
  id: string;
  displayName: string;
  fileCount: number;
  percentage: number;
}

export interface UnknownExtensionStats {
  extension: string;
  count: number;
}

export interface LanguageDetectionResult {
  languages: LanguageStats[];
  totalFiles: number;
  supportedFiles: number;
  unsupportedFiles: number;
  unknownExtensions: UnknownExtensionStats[];
  dominantLanguage: string | null;
}
