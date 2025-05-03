import { ARCConfig } from '../types';

export function refineConfig(config: ARCConfig) {
  if (config.size <= 0) {
    throw new Error();
  }

  if (config.band <= 0) {
    throw new Error();
  }

  return config;
}
