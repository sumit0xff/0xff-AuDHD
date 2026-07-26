import { Command } from 'commander';
import * as logger from '../utils/logger';
import { scanRepository, language, framework, dependency } from '../../analyzer';

export function registerThinkCommand(program: Command) {
  program
    .command('think')
    .description('Forces the AI to generate an execution plan')
    .argument('[prompt]', 'The natural language instruction')
    .option('--file <path>', 'Focus the thought process on a specific file')
    .action(async (prompt, options) => {
      // In the future, prompt will be required. For this milestone, we just scan.
      logger.info('Scanning repository...');
      
      try {
        const result = await scanRepository(process.cwd());
        
        logger.success('Repository scanned\n');
        
        console.log(`Project:\n${result.root}\n`);
        console.log(`Files:\n${result.totalFiles}\n`);
        console.log(`Directories:\n${result.totalDirectories}\n`);
        console.log(`Scan Time:\n${result.durationMs} ms\n`);
        
        const langResult = language.detectLanguages(result);
        
        if (langResult.languages.length > 0) {
          console.log('Detected Languages');
          for (const lang of langResult.languages) {
            console.log(`${lang.displayName} (${lang.fileCount})`);
          }
          console.log();
        }
        
        if (langResult.unknownExtensions.length > 0) {
          console.log('Unknown');
          for (const unk of langResult.unknownExtensions) {
            console.log(`${unk.extension} (${unk.count})`);
          }
          console.log();
        }
        
        if (langResult.dominantLanguage) {
          console.log('Dominant Language');
          console.log(`${langResult.dominantLanguage}\n`);
        }
        
        const fwResult = await framework.detectFrameworks(result);
        
        if (fwResult.technologies.length > 0) {
          console.log('Detected Technologies');
          for (const tech of fwResult.technologies) {
            console.log(`${tech.displayName}${tech.version ? ` ${tech.version}` : ''}`);
          }
          console.log();
        }
        
        if (fwResult.packageManager) {
          console.log('Package Manager');
          console.log(`${fwResult.packageManager.displayName}\n`);
        }
        
        if (fwResult.runtime) {
          console.log('Runtime');
          console.log(`${fwResult.runtime.displayName}\n`);
        }
        
        if (fwResult.deployment) {
          console.log('Deployment');
          console.log(`${fwResult.deployment.displayName}\n`);
        }
        
        if (fwResult.monorepo) {
          console.log('Monorepo');
          console.log(`${fwResult.monorepo.displayName}\n`);
        }
        
        if (fwResult.averageConfidence > 0) {
          console.log('Average Confidence');
          console.log(`${fwResult.averageConfidence}%\n`);
        }
        
        console.log('Analysis Time');
        console.log(`${fwResult.analysisTimeMs} ms\n`);

        const depResult = await dependency.analyzeDependencies(result, fwResult);
        
        console.log('Dependencies');
        console.log(`Production: ${depResult.productionDependencies}`);
        console.log(`Development: ${depResult.developmentDependencies}`);
        console.log(`Peer: ${depResult.peerDependencies}`);
        if (depResult.workspaceDependencies > 0) console.log(`Workspace: ${depResult.workspaceDependencies}`);
        console.log();
        
        console.log('Package Manager');
        console.log(`${depResult.packageManager}\n`);
        
        if (depResult.categories.length > 0) {
          console.log('Dependency Categories');
          for (const cat of depResult.categories) {
            console.log(`${cat.category}: ${cat.count}`);
          }
          console.log();
        }
        
        console.log('Total Packages');
        console.log(`${depResult.totalDependencies}\n`);
        
      } catch (error: any) {
        logger.error(`Scan failed: ${error.message}`);
        process.exit(1);
      }
    });
}
