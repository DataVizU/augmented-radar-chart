export type AugmentedRadarChartData = Record<
  // name of the dimension
  string,
  // data of the dimension
  Array<{
    // x
    point: number;
    // y
    value: number;
  }>
>;

export interface AugmentedRadarChartConfig {
  // DOM element to render the chart
  container: HTMLElement | null;
  // The size of the chart
  size: number;
  bins: Record<string, { start: number; end: number }>;

  // Styling options for the radar chart
  styles: {
    area: {
      band: number;
      color: string | Array<string>;
    };
    line: {
      color: string;
      width: number;
    };
  };
}
