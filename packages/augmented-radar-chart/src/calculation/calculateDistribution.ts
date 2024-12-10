import { AugmentedRadarChartData } from '../type';

export function calculateDistribution(
  data: AugmentedRadarChartData,
  option: Record<string, { start: number; end: number }>,
): Record<string, Record<number, number>> {
  /**
   * calculate distribution of each dimension
   * @param {AugmentedRadarChartData} - data
   * @return {Record<string, Array<number>>} - distribution of each dimension
   */
  console.log({ data, option });
  return {};
}
