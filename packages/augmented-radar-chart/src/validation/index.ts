import { AugmentedRadarChartData, AugmentedRadarChartOptions } from '../type';
import { validateData } from './validateData';
import { validateOptions } from './validateOptions';

export function validateParams(data: AugmentedRadarChartData, options: AugmentedRadarChartOptions) {
  return validateData(data) && validateOptions(options);
}
