import { AugmentedRadarChartConfig, AugmentedRadarChartData } from './type';
import { calculateAverage, calculateDistribution } from './calculation';
import { preprocess } from './preprocess';

abstract class AugmentedRadarChart {
  private data: AugmentedRadarChartData;
  private config: AugmentedRadarChartConfig;
  private average: Record<string, number>;
  private distribution: AugmentedRadarChartData;

  constructor(data: Record<string, Array<number>>, config: Record<string, unknown>) {
    ({ data: this.data, config: this.config } = preprocess(data, config));
    this.average = calculateAverage(this.data);
    this.distribution = calculateDistribution(this.data, this.config.bins);
  }
  public draw(): void {}
}

export class AugmentedRadarChartSVG extends AugmentedRadarChart {
  public draw(): void {}
}

export class AugmentedRadarChartCanvas extends AugmentedRadarChart {
  public draw(): void {}
}
