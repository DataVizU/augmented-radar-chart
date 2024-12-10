import { AugmentedRadarChartData } from '../type';

export function preprocessData(data: AugmentedRadarChartData): AugmentedRadarChartData {
  /**
   * validate whether data follows the same schema
   * @param {AugmentedRadarChartData} data - data
   * @return {AugmentedRadarChartData?} - if valid return the original data else throw error
   */
  if (data.length === 0) {
    throw new Error('Data cannot be empty.');
  }

  // assume keys of the first element as schema
  const expectedKeys = Object.keys(data[0]);

  // validate each element
  data.forEach((item, index) => {
    const keys = Object.keys(item);
    if (!keys.every((key) => expectedKeys.includes(key))) {
      throw new Error(`Element ${index} contains invalid keys: ${keys.join(', ')}`);
    }
  });
  return data;
}
