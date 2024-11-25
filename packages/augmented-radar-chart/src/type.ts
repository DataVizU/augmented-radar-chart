type NonZeroNumber = Exclude<number, 0>;
type FixedLengthArray<T, N extends NonZeroNumber> = T[] & { length: N };

export type AugmentedRadarChartData<
  N extends NonZeroNumber = Exclude<number, 0>,
  K extends string = string,
> = FixedLengthArray<Record<K, number>, N>;

export interface AugmentedRadarChartOptions {
  // DOM element to render the chart
  container: HTMLElement;
  // The size of the chart
  size: number;

  // Styling options for the radar chart
  styles: {
    area: {
      layerCount: number;
      colors: string | Array<string>;
    };
    label: {
      // Text color for axis labels
      color?: string;
      offset?: number;
    };
    line: {
      color?: string;
      width?: number;
      type?: string;
    };
  };
}

export interface AugmentedRadarChartSVGOptions extends AugmentedRadarChartOptions {}

export interface AugmentedRadarChartCanvasOptions extends AugmentedRadarChartOptions {}
