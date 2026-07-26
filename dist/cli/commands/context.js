"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerContextCommand = registerContextCommand;
const logger = __importStar(require("../utils/logger"));
function registerContextCommand(program) {
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
        }
        else if (options.copy) {
            logger.info('Context will be copied to clipboard.');
        }
        // Placeholder
        logger.warning('Feature under development: Knowledge graph generation is mocked.');
        logger.success('Context payload successfully generated.');
    });
}
