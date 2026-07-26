// Minimal configuration implementation placeholder
export interface OxffConfig {
  provider: {
    default: string;
    model: string;
  };
  context: {
    maxTokens: number;
  };
}

export const defaultConfig: OxffConfig = {
  provider: {
    default: 'anthropic',
    model: 'claude-3-5-sonnet',
  },
  context: {
    maxTokens: 32000,
  },
};

export function loadConfig(): OxffConfig {
  // In the future, this will load from .0xff/config.json
  // For now, return default config
  return defaultConfig;
}
