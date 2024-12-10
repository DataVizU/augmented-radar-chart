import { AugmentedRadarChartData } from '../type';

export function calculateDistribution(
  data: AugmentedRadarChartData,
  config: Record<string, { start: number; end: number }>,
): AugmentedRadarChartData {
  /**
   * @deprecated
   * calculate distribution of each dimension
   * @param {AugmentedRadarChartData} data - data
   * @param {Record<string, { start: number; end: number }>} config
   * @return {AugmentedRadarChartData} - distribution of each dimension
   */
  console.log({ data, config });
  return {};
}
