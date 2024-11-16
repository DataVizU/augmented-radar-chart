type NonZeroNumber = Exclude<number, 0>;
type FixedLengthArray<T, N extends NonZeroNumber> = T[] & { length: N };

export type AugmentedRadarChartSVGData<
  N extends NonZeroNumber = Exclude<number, 0>,
  K extends string = string,
> = FixedLengthArray<Record<K, number>, N>;

export interface AugmentedRadarChartSVGOptions {
  container: HTMLElement;
  size: number;
  radarChartOptions: {};
  horizonChartOptions: {};
}
