import { AugmentedRadarChartConfig, AugmentedRadarChartData } from '../type';
import { defaultConfig } from '../constant';
import { isColor } from '../utils';

export function preprocess(
  data: Record<string, Array<number>>,
  config: Record<string, unknown>,
): { data: AugmentedRadarChartData; config: AugmentedRadarChartConfig } {
  const preprocessedData: AugmentedRadarChartData = {};
  const preprocessedConfig: AugmentedRadarChartConfig = Object.assign({}, defaultConfig, config);

  if (Object.keys(data).length === 0) {
    throw new Error('Empty data.');
  }

  for (const dimension in data) {
    if (data[dimension].length === 0) {
      throw new Error(`Empty data for dimension '${dimension}'.`);
    }
    const pointMap: Record<number, number> = {};
    for (let i = 0; i < data[dimension].length; i++) {
      const point = data[dimension][i];
      if (!pointMap[point]) pointMap[point] = 0;
      pointMap[point] += 1;
    }

    preprocessedData[dimension] = [];
    for (const point in pointMap) {
      preprocessedData[dimension].push({
        point: Number(point),
        value: pointMap[point],
      });
    }
  }

  if (preprocessedConfig.container === null) {
    throw new Error('Invalid container in chart configuration');
  }

  if (preprocessedConfig.size <= 0) {
    throw new Error('Invalid size in chart configuration');
  }

  for (const dimension in preprocessedData) {
    const points = preprocessedData[dimension].map((x) => x.point);

    if (!preprocessedConfig.bins[dimension]) {
      preprocessedConfig.bins[dimension] = { start: Math.min(...points), end: Math.max(...points) };
    } else {
      const { start, end } = preprocessedConfig.bins[dimension];
      if (end <= start) {
        throw new Error(`Invalid range for "${dimension}" in bins.`);
      }
    }
  }

  if (preprocessedConfig.styles.area.band <= 0) {
    throw new Error('Invalid band value in area configuration.');
  }

  if (typeof preprocessedConfig.styles.area.color === 'string') {
    if (!isColor(preprocessedConfig.styles.area.color)) {
      throw new Error(`Invalid area color in area configuration.`);
    }
  } else {
    for (const color of preprocessedConfig.styles.area.color as Array<string>) {
      if (!isColor(color)) {
        throw new Error(`Invalid area color in area configuration.`);
      }
    }
  }

  if (!isColor(preprocessedConfig.styles.line.color)) {
    throw new Error(`Invalid line color in line configuration.`);
  }

  if (preprocessedConfig.styles.line.width <= 0) {
    throw new Error('Invalid line width in line configuration.');
  }

  return {
    data: preprocessedData as AugmentedRadarChartData,
    config: preprocessedConfig as AugmentedRadarChartConfig,
  };
}
