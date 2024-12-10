import { AugmentedRadarChartData } from '../type';

export function calculateDistribution(
  data: AugmentedRadarChartData,
): Record<string, { max: number; min: number }> {
  /**
   * calculate distribution of each dimension
   * @param {AugmentedRadarChartData} data
   * @return {Record<string, { max: number; min: number }>} distribution of each dimension
   */
  console.log(data);
  return { '': { max: 1, min: 0 } };
}
