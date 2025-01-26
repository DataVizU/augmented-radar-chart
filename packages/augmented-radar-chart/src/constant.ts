import { AugmentedRadarChartConfig } from './type';

export const defaultConfig: AugmentedRadarChartConfig = {
  container: null,
  size: 0,
  bins: {},
  styles: {
    area: {
      band: 0,
      color: '',
    },
    line: {
      color: '',
      width: 0,
    },
  },
};
