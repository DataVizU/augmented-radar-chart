type NonZeroNumber = Exclude<number, 0>;
type FixedLengthArray<T, N extends NonZeroNumber> = T[] & { length: N };

export type AugmentedRadarChartData<
  N extends NonZeroNumber = Exclude<number, 0>,
  K extends string = string,
> = FixedLengthArray<Record<K, number>, N>;

export interface AugmentedRadarChartOptions {
  // container of the chart
  container: HTMLElement;

  // size of the chart
  size: number;

  data: AugmentedRadarChartData;

  // name and max value for each dimension
  // in case dimension names are not correspond with the keys of data
  // TODO: both radar chart and horizon chart apply the same linear scale (min to max)?
  // TODO: support custom scale
  indicator: Array<{
    name?: string;
    min?: number;
    max?: number;
  }>;

  startAngle?: number;

  clockwise?: boolean;

  radarChartOptions: {
    // style of axis
    label: {
      // color of the label text
      textColor?: string;
      // offset of the label
      offset?: number;
    };

    // style of line
    line: {
      color?: string;
      lineWidth?: number;
      lineType?: 'solid' | 'dashed' | 'dotted'; // TODO: other type
      opacity?: number;
    };

    dot: {
      dotRadius?: number;
      dotType?: 'circle' | 'rect'; // TODO: other type
    };

    // style of background area
    area: {
      // color of the background
      color?: string;
      opacity?: number;
      borderColor?: string;
      borderWidth?: number;
    };
  };

  horizonChartOptions: {
    area: {
      // number of layers
      split: number;
      // color of the uppermost layer
      color: string | Array<string>;
    };

    axis?: {
      // number of ticks in each layer
      lineCount: number;
      lineColor: string;
      opacity?: number;
    };

    label: {
      // color of the label text
      textColor?: string;
      // offset of the label
      offset?: number;
    };

    dot: {
      dotRadius?: number;
      dotType?: 'circle' | 'rect'; // TODO: other type
    };
  };
}

// TODO: specific options
export interface AugmentedRadarChartSVGOptions extends AugmentedRadarChartOptions {
  behavior?: Array<(event: MouseEvent, data: unknown) => void>; // 点击事件回调
}

export interface AugmentedRadarChartCanvasOptions extends AugmentedRadarChartOptions {
  behavior?: Array<(type: 'hover' | 'click', x: number, y: number, data: unknown) => void>;
}
