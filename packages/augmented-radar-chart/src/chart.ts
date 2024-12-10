import { AugmentedRadarChartConfig, AugmentedRadarChartData } from './type';
import { preprocessConfig, preprocessData } from './prepocessing';
import { calculateAverage, calculateDistribution } from './calculation';

abstract class AugmentedRadarChart {
  protected data: AugmentedRadarChartData;
  protected config: AugmentedRadarChartConfig;
  protected average: Record<string, number>;
  protected distribution: Record<
    string,
    {
      max: number;
      min: number;
    }
  >;

  constructor(data: AugmentedRadarChartData, config: AugmentedRadarChartConfig) {
    this.data = preprocessData(data);
    this.config = preprocessConfig(config);
    this.average = calculateAverage(data);
    this.distribution = calculateDistribution(data);
  }

  protected abstract render(
    average: Record<string, number>,
    distribution: Record<
      string,
      {
        max: number;
        min: number;
      }
    >,
    config: AugmentedRadarChartConfig,
  ): void;

  public draw() {
    this.render(this.average, this.distribution, this.config);
  }
}

export class AugmentedRadarChartSVG extends AugmentedRadarChart {
  protected render(
    average: Record<string, number>,
    distribution: Record<
      string,
      {
        max: number;
        min: number;
      }
    >,
    config: AugmentedRadarChartConfig,
  ): void {
    console.log({ average, distribution, config });
  }
}

export class AugmentedRadarChartCanvas extends AugmentedRadarChart {
  protected render(
    average: Record<string, number>,
    distribution: Record<
      string,
      {
        max: number;
        min: number;
      }
    >,
    config: AugmentedRadarChartConfig,
  ): void {
    console.log({ average, distribution, config });
  }
}
