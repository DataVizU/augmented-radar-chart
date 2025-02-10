import { ARCConfig } from '../type';

export function preprocessConfig(config: ARCConfig) {
  if (config.container === null) {
    throw new Error();
  }

  if (config.size <= 0) {
    throw new Error();
  }

  if (config.band <= 0) {
    throw new Error();
  }

  return config;
}
