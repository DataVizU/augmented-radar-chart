/**
 * @description Primary input data structure for chart rendering
 * @property {string} key - Dimension name (e.g. "Software Engineer")
 * @property {Object} value - Dimension configuration
 * @property {Array<number>} value.data - Raw numerical values for the dimension
 * @property {{from: number, to: number}} [value.range] - Optional normalization range
 *
 * @example
 * {
 *   "Frontend": { data: [25, 30, 28] },
 *   "Backend": { data: [15, 20, 18], range: { from: 0, to: 50 } }
 * }
 */
export type ARCData = Record<
  string,
  {
    data: Array<number>;
    range?: { from: number; to: number };
  }
>;

/**
 * @description Processed dimension data after calculation
 * @property {number} average - Computed average value
 * @property {Array<{point: number, value: number}>} distribution - Normalized distribution points
 */
export type ARCDimension = Record<
  string,
  {
    average: number;
    distribution: Array<{ point: number; value: number }>;
  }
>;

/**
 * @interface ARCConfig - Main chart configuration parameters
 * @property {number} size - Chart diameter (px)
 * @property {number} band - Number of bands/levels in radar chart
 *
 * @example
 * { size: 600, band: 3 }
 */
export interface ARCConfig {
  size: number;
  band: number;
}

/**
 * @interface ARCStyle - Complete style configuration
 * @property {Object} x - X-axis normalization range [0-1]
 * @property {Object} y - Y-axis normalization range [0-1]
 * @property {number} offset - Horizon chart offset percentage
 * @property {CSSStyleDeclaration} background - Canvas/SVG background styles
 * @property {CSSStyleDeclaration} chart - Radar chart polygon styles
 * @property {CSSStyleDeclaration} label - Dimension label styles
 * @property {CSSStyleDeclaration} line - Average line styles
 *
 * @example
 * {
 *   label: { 'font-size': 12, 'font-family': 'Arial' },
 *   chart: { 'stroke-width': 2, stroke: '#333' }
 * }
 */
export interface ARCStyle {
  // range of x-value, [0, 1]
  x: { from: number; to: number };
  // range of y-value, [0, 1]
  y: { from: number; to: number };
  // both ends' offset of the horizon chart, relative to its container
  offset: number;
  background: Record<string, string | number | boolean | readonly (string | number)[]>;
  chart: Record<string, string | number | boolean | readonly (string | number)[]>;
  label: Record<string, string | number | boolean | readonly (string | number)[]>;
  line: Record<string, string | number | boolean | readonly (string | number)[]>;
}
