import { AugmentedRadarChartData, AugmentedRadarChartOptions } from './type';

export class AugmentedRadarChart {
  public data: AugmentedRadarChartData;
  public options: AugmentedRadarChartOptions;

  constructor(data: AugmentedRadarChartData, options: AugmentedRadarChartOptions) {
    /**
     * @description - validate params and (if validated) continue calculate & render
     * @param data
     * @param options
     */
    this.data = data;
    this.options = options;
  }

  private validate() {}

  private calculate() {}

  public render() {}
}

/*
const chart = AugmentedRadarChart(data, options)
chart.render()
 */
