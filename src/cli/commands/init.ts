import { Command } from 'commander';
import * as logger from '../utils/logger';

export function registerInitCommand(program: Command) {
  program
    .command('init')
    .description('Initialize 0xff in the current repository')
    .argument('[path]', 'The directory to initialize', '.')
    .option('-f, --force', 'Overwrite existing configuration files')
    .option('--stack <name>', 'Specify project stack to skip auto-detection')
    .action((path, options) => {
      logger.info(`Initializing 0xff at path: ${path}`);
      
      if (options.force) {
        logger.warning('Force option is active. Will overwrite files.');
      }
      
      if (options.stack) {
        logger.info(`Stack specified: ${options.stack}`);
      }

      // Placeholder
      logger.success('Initialization successful (Placeholder: No files written yet).');
    });
}
