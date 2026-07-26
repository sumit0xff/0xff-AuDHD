"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.loadConfig = loadConfig;
exports.defaultConfig = {
    provider: {
        default: 'anthropic',
        model: 'claude-3-5-sonnet',
    },
    context: {
        maxTokens: 32000,
    },
};
function loadConfig() {
    // In the future, this will load from .0xff/config.json
    // For now, return default config
    return exports.defaultConfig;
}
