import { ScanResult } from '../types';
import { EXTENSION_MAP } from './registry';
import { LanguageDetectionResult, LanguageStats, UnknownExtensionStats } from './types';

export function detectLanguages(scanResult: ScanResult): LanguageDetectionResult {
  const langCounts = new Map<string, number>();
  const unknownCounts = new Map<string, number>();
  
  let supportedFiles = 0;
  let unsupportedFiles = 0;

  // Single pass over the file metadata
  for (const file of scanResult.files) {
    const ext = file.extension.toLowerCase();
    
    // Some files don't have an extension (e.g., Makefile, Dockerfile)
    // We treat the filename as the extension for lookup (e.g. '.dockerfile')
    // A more robust future implementation will use aliases or regex on file.name
    const lookupKey = ext || `.${file.name.toLowerCase()}`;

    const langDef = EXTENSION_MAP.get(lookupKey);

    if (langDef) {
      supportedFiles++;
      langCounts.set(langDef.id, (langCounts.get(langDef.id) || 0) + 1);
    } else {
      unsupportedFiles++;
      const unknownKey = ext || file.name;
      unknownCounts.set(unknownKey, (unknownCounts.get(unknownKey) || 0) + 1);
    }
  }

  const totalFiles = scanResult.totalFiles;

  // Convert maps to sorted arrays
  const languages: LanguageStats[] = Array.from(langCounts.entries()).map(([id, count]) => {
    // Find displayName from the original Map values (inefficient but only runs once per unique language detected)
    const langDef = Array.from(EXTENSION_MAP.values()).find(l => l.id === id)!;
    return {
      id,
      displayName: langDef.displayName,
      fileCount: count,
      percentage: totalFiles > 0 ? (count / totalFiles) * 100 : 0
    };
  });

  // Sort: count descending, then displayName ascending
  languages.sort((a, b) => {
    if (b.fileCount !== a.fileCount) {
      return b.fileCount - a.fileCount;
    }
    return a.displayName.localeCompare(b.displayName);
  });

  const unknownExtensions: UnknownExtensionStats[] = Array.from(unknownCounts.entries())
    .map(([extension, count]) => ({ extension, count }))
    .sort((a, b) => b.count - a.count);

  return {
    languages,
    totalFiles,
    supportedFiles,
    unsupportedFiles,
    unknownExtensions,
    dominantLanguage: languages.length > 0 ? languages[0].displayName : null
  };
}
