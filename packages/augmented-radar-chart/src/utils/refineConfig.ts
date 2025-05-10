import { ARCConfig } from '../types';

export function refineConfig(config: ARCConfig) {
  if (config.size <= 0 || !Number.isFinite(config.size)) {
    throw RangeError(`CONFIG_ERROR: config.size must be a valid positive number`);
  }

  if (config.band <= 0 || !Number.isSafeInteger(config.band)) {
    throw RangeError(`CONFIG_ERROR: config.band must be a valid positive number`);
  }

  return config;
}
