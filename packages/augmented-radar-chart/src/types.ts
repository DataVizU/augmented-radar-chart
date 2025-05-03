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

// required
export interface ARCConfig {
  size: number;
  // number of bands
  band: number;
}

// optional
export interface ARCStyle {
  // range of x-value, [0, 1]
  x: { from: number; to: number };
  // range of y-value, [0, 1]
  y: { from: number; to: number };
  // both ends' offset of the horizon chart, relative to its container
  offset: number;
  border: Record<string, string | number | boolean | readonly (string | number)[]>;
  band: Record<string, string | number | boolean | readonly (string | number)[]>;
  area: Record<string, string | number | boolean | readonly (string | number)[]>;
  label: Record<string, string | number | boolean | readonly (string | number)[]>;
  line: Record<string, string | number | boolean | readonly (string | number)[]>;
}
