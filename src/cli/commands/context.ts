import { Command } from 'commander';
import * as logger from '../utils/logger';

export function registerContextCommand(program: Command) {
  program
    .command('context')
    .description('Bundles the relevant project structure for AI context')
    .option('--copy', 'Automatically copy output to OS clipboard (default behavior)', true)
    .option('--no-copy', 'Disable clipboard copying')
    .option('--out <file>', 'Save context payload to a file instead of clipboard')
    .action((options) => {
      logger.info('Generating context payload...');

      if (options.out) {
        logger.info(`Context will be written to: ${options.out}`);
      } else if (options.copy) {
        logger.info('Context will be copied to clipboard.');
      }

      // Placeholder
      logger.warning('Feature under development: Knowledge graph generation is mocked.');
      logger.success('Context payload successfully generated.');
    });
}
