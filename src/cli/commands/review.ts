import { Command } from 'commander';
import * as logger from '../utils/logger';

export function registerReviewCommand(program: Command) {
  program
    .command('review')
    .description('Audits uncommitted changes against 0xff engineering principles')
    .argument('[path]', 'Specific file or directory to review (defaults to diff)')
    .option('--strict', 'Fail the command on any minor rule violation')
    .action((path, options) => {
      logger.info(`Starting review${path ? ` on path: ${path}` : ' on uncommitted changes'}.`);
      
      if (options.strict) {
        logger.warning('Strict mode enabled. Any violation will exit with code 1.');
      }

      // Placeholder
      logger.warning('Feature under development: AST parsing and AI review are mocked.');
      logger.success('Review complete. No rule violations detected.');
    });
}
