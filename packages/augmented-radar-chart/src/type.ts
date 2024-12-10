type NonZeroNumber = Exclude<number, 0>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type FixedLengthArray<T, N extends NonZeroNumber> = T[] & { length: N };
/*
export type AugmentedRadarChartData<
  N extends NonZeroNumber = Exclude<number, 0>,
  K extends string = string,
> = FixedLengthArray<Record<K, number>, N>;

 */

export type AugmentedRadarChartData = Record<
  string,
  Array<{
    point: number;
    value: number;
  }>
>;

export interface AugmentedRadarChartConfig {
  // DOM element to render the chart
  container: HTMLElement;
  // The size of the chart
  size: number;
  bins: Record<string, { start: number; end: number }>;

  // Styling options for the radar chart
  styles: {
    area: {
      bands: number;
      colors: string | Array<string>;
    };
    label: {
      // Text color for axis labels
      color: string;
    };
    line: {
      color: string;
      width: number;
    };
  };
}
