import { ARCConfig } from '../types';

export function refineConfig(config: ARCConfig) {
  if (config.size <= 0) {
    throw RangeError('config.size must be a positive number');
  }

  if (config.band <= 0) {
    throw RangeError('config.band must be a positive number');
  }

  return config;
}
