export class CliError extends Error {
  public readonly exitCode: number;

  constructor(message: string, exitCode = 1) {
    super(message);
    this.name = 'CliError';
    this.exitCode = exitCode;
  }
}

export class ConfigError extends CliError {
  constructor(message: string) {
    super(`Configuration Error: ${message}`, 2);
    this.name = 'ConfigError';
  }
}

export class DependencyError extends CliError {
  constructor(message: string) {
    super(`Dependency Error: ${message}`, 3);
    this.name = 'DependencyError';
  }
}
