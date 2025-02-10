export type ARCData = Record<
  string,
  {
    data: Array<number>;
    range?: { start: number; end: number };
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
  container: HTMLElement | null;
  renderer: string;
  size: number;
  band: number;
}

export interface ARCStyle {
  x: { start: number; end: number };
  y: { start: number; end: number };
  border: Record<string, string | number | boolean | readonly (string | number)[]>;
  band: Record<string, string | number | boolean | readonly (string | number)[]>;
  area: Record<string, string | number | boolean | readonly (string | number)[]>;
  label: Record<string, string | number | boolean | readonly (string | number)[]>;
  line: Record<string, string | number | boolean | readonly (string | number)[]>;
}
