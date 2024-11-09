import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  globalName: 'AugmentedRadarChart',
  dts: true,
  clean: true,
  minify: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
});
