import { AugmentedRadarChartConfig, AugmentedRadarChartData } from '../type';
import { calculateAverage, calculateDistribution } from '../calculation';
import { preprocess } from '../preprocess';

export abstract class AugmentedRadarChart {
  protected data: AugmentedRadarChartData;
  protected config: AugmentedRadarChartConfig;
  protected average: Record<string, number>;
  protected distribution: AugmentedRadarChartData;

  constructor(data: Record<string, Array<number>>, config: Record<string, unknown>) {
    ({ data: this.data, config: this.config } = preprocess(data, config));
    this.average = calculateAverage(this.data);
    this.distribution = calculateDistribution(this.data, this.config.bins);
  }
  public draw(): void {}
}
