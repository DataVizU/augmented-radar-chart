type NonZeroNumber = number extends 0 ? never : number;
type FixedLengthArray<N extends NonZeroNumber> = number[] & { length: N };

export type AugmentedRadarChartData<N extends number> = FixedLengthArray<N>[];

export interface AugmentedRadarChartOptions {
  /**
   *
   */
  size?: number;
  /**
   *
   */
  colors?: string[];
}
