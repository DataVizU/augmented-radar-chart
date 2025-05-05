export type ARCData = Record<
  string,
  {
    data: Array<number>;
    range?: { from: number; to: number };
  }
>;

export type ARCDimension = Record<
  string,
  {
    average: number;
    distribution: Array<{ point: number; value: number }>;
  }
>;

export interface ARCConfig {
  size: number;
  band: number;
}

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
