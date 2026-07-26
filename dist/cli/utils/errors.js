"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyError = exports.ConfigError = exports.CliError = void 0;
class CliError extends Error {
    exitCode;
    constructor(message, exitCode = 1) {
        super(message);
        this.name = 'CliError';
        this.exitCode = exitCode;
    }
}
exports.CliError = CliError;
class ConfigError extends CliError {
    constructor(message) {
        super(`Configuration Error: ${message}`, 2);
        this.name = 'ConfigError';
    }
}
exports.ConfigError = ConfigError;
class DependencyError extends CliError {
    constructor(message) {
        super(`Dependency Error: ${message}`, 3);
        this.name = 'DependencyError';
    }
}
exports.DependencyError = DependencyError;
