import { Command } from 'commander';
import { registerInitCommand } from './commands/init';
import { registerThinkCommand } from './commands/think';
import { registerDoctorCommand } from './commands/doctor';
import { registerReviewCommand } from './commands/review';
import { registerContextCommand } from './commands/context';
import { setJsonMode } from './utils/logger';
import { CliError } from './utils/errors';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');

export function run(argv: string[]) {
  const program = new Command();

  program
    .name('0xff')
    .description('The definitive AI Engineering Toolkit')
    .version(pkg.version, '-v, --version', 'Output the current version')
    .option('--json', 'Format output as machine-readable JSON', false)
    .option('--verbose', 'Enable verbose logging', false)
    .option('-y, --yes', 'Bypass all interactive confirmation prompts', false)
    .hook('preAction', (thisCommand) => {
      if (thisCommand.opts().json) {
        setJsonMode(true);
      }
    });

  // Register commands
  registerInitCommand(program);
  registerThinkCommand(program);
  registerDoctorCommand(program);
  registerReviewCommand(program);
  registerContextCommand(program);

  // Error handling override
  program.exitOverride();

  try {
    program.parse(argv);
  } catch (err: unknown) {
    if (err instanceof CliError) {
      process.exit(err.exitCode);
    }
    
    // Allow Commander errors (like missing arguments) to just exit normally,
    // Commander already printed the error.
    if ((err as { code?: string }).code?.startsWith('commander.')) {
      process.exit(1);
    }
    
    console.error(err);
    process.exit(1);
  }
}
