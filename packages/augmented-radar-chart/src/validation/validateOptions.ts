import { AugmentedRadarChartOptions } from '../type';

export function validateOptions(options: AugmentedRadarChartOptions): boolean {
  /**
   * @description - validate options
   * @param data - options to be validate
   * @return - boolean, whether is valid
   */
  return !!options;
}
