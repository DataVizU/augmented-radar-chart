import { AugmentedRadarChartData } from '../type';

export function calculateAverage(data: AugmentedRadarChartData): Record<string, number> {
  /**
   * calculate averages of each dimension
   * @param {AugmentedRadarChartData} data - data
   * @return {Record<string, number>} - averages of each dimension
   */
  return Object.entries(data).reduce((averages, [dimension, points]) => ({
    ...averages,
    [dimension]: points.reduce((acc, d) => acc + d.point * d.value, 0) / points.reduce((acc, d) => acc + d.value, 0)
  }), {});  
}
