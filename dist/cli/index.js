"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const commander_1 = require("commander");
const init_1 = require("./commands/init");
const think_1 = require("./commands/think");
const doctor_1 = require("./commands/doctor");
const review_1 = require("./commands/review");
const context_1 = require("./commands/context");
const logger_1 = require("./utils/logger");
const errors_1 = require("./utils/errors");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');
function run(argv) {
    const program = new commander_1.Command();
    program
        .name('0xff')
        .description('The definitive AI Engineering Toolkit')
        .version(pkg.version, '-v, --version', 'Output the current version')
        .option('--json', 'Format output as machine-readable JSON', false)
        .option('--verbose', 'Enable verbose logging', false)
        .option('-y, --yes', 'Bypass all interactive confirmation prompts', false)
        .hook('preAction', (thisCommand) => {
        if (thisCommand.opts().json) {
            (0, logger_1.setJsonMode)(true);
        }
    });
    // Register commands
    (0, init_1.registerInitCommand)(program);
    (0, think_1.registerThinkCommand)(program);
    (0, doctor_1.registerDoctorCommand)(program);
    (0, review_1.registerReviewCommand)(program);
    (0, context_1.registerContextCommand)(program);
    // Error handling override
    program.exitOverride();
    try {
        program.parse(argv);
    }
    catch (err) {
        if (err instanceof errors_1.CliError) {
            process.exit(err.exitCode);
        }
        // Allow Commander errors (like missing arguments) to just exit normally,
        // Commander already printed the error.
        if (err.code?.startsWith('commander.')) {
            process.exit(1);
        }
        console.error(err);
        process.exit(1);
    }
}
