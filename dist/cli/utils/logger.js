"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonMode = void 0;
exports.setJsonMode = setJsonMode;
exports.info = info;
exports.success = success;
exports.warning = warning;
exports.error = error;
const chalk_1 = __importDefault(require("chalk"));
// Placeholder for future JSON configuration
exports.isJsonMode = false;
function setJsonMode(enabled) {
    exports.isJsonMode = enabled;
}
function info(message) {
    if (exports.isJsonMode)
        return outputJson('info', message);
    console.log(chalk_1.default.blue('ℹ') + ' ' + message);
}
function success(message) {
    if (exports.isJsonMode)
        return outputJson('success', message);
    console.log(chalk_1.default.green('✔') + ' ' + chalk_1.default.green(message));
}
function warning(message) {
    if (exports.isJsonMode)
        return outputJson('warning', message);
    console.log(chalk_1.default.yellow('⚠') + ' ' + chalk_1.default.yellow(message));
}
function error(message) {
    if (exports.isJsonMode)
        return outputJson('error', message);
    console.error(chalk_1.default.red('✖') + ' ' + chalk_1.default.red(message));
}
function outputJson(level, message) {
    console.log(JSON.stringify({ level, message }));
}
