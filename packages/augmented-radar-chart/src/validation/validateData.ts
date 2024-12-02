import { AugmentedRadarChartData } from '../type';

export function validateData(data: AugmentedRadarChartData): boolean {
  /**
   * @description - validate data
   * @param data - data to be validate
   * @return - boolean, whether is valid
   */
  return !!data;
}
