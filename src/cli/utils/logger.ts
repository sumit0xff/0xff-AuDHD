import chalk from 'chalk';

// Placeholder for future JSON configuration
export let isJsonMode = false;

export function setJsonMode(enabled: boolean) {
  isJsonMode = enabled;
}

export function info(message: string) {
  if (isJsonMode) return outputJson('info', message);
  console.log(chalk.blue('ℹ') + ' ' + message);
}

export function success(message: string) {
  if (isJsonMode) return outputJson('success', message);
  console.log(chalk.green('✔') + ' ' + chalk.green(message));
}

export function warning(message: string) {
  if (isJsonMode) return outputJson('warning', message);
  console.log(chalk.yellow('⚠') + ' ' + chalk.yellow(message));
}

export function error(message: string) {
  if (isJsonMode) return outputJson('error', message);
  console.error(chalk.red('✖') + ' ' + chalk.red(message));
}

function outputJson(level: string, message: string) {
  console.log(JSON.stringify({ level, message }));
}
