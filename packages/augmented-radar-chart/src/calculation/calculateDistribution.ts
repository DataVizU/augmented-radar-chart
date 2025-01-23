import { AugmentedRadarChartData } from '../type';

export function calculateDistribution(
  data: AugmentedRadarChartData,
  config?: Record<string, { start: number; end: number }>,
): AugmentedRadarChartData {
  /**
   * @deprecated
   * calculate distribution of each dimension
   * @param {AugmentedRadarChartData} data - data
   * @param {Record<string, { start: number; end: number }>} config
   * @return {AugmentedRadarChartData} - distribution of each dimension
   */
  return Object.keys(data).reduce((acc, key) => {
    const points = data[key];
    const pointmin = Math.min(...points.map((p) => p.point));
    const pointmax = Math.max(...points.map((p) => p.point));
    const { start, end } = config?.[key] ?? { start: pointmin, end: pointmax };
    return {
      ...acc,
      [key]: data[key].map(({ point, value }) => ({
        point: (point - start) / (end - start),
        value: value,
      })),
    };
  }, {});
}
