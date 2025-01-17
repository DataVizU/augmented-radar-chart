import { AugmentedRadarChartData } from '../type';

export function calculateAverage(data: AugmentedRadarChartData): Record<string, number> {
  /**
   * calculate averages of each dimension
   * @param {AugmentedRadarChartData} data - data
   * @return {Record<string, number>} - averages of each dimension
   */
  const averages: Record<string, number> = {};
  for (const dimension in data) {
    const points = data[dimension];
    const sum = points.reduce((acc, pointData) => acc + pointData.value, 0);
    const average = sum / points.length;
    averages[dimension] = average;}
  //console.log({ data });
  return averages;
}
