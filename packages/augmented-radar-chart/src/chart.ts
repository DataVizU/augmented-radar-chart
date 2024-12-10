import { AugmentedRadarChartConfig, AugmentedRadarChartData } from './type';
import { validateConfig, validateData } from './validation';
import { calculateAverage, calculateDistribution } from './calculation';

abstract class AugmentedRadarChart {
  private data: AugmentedRadarChartData | undefined;
  private config: AugmentedRadarChartConfig | undefined;
  private average: Record<string, number> | undefined;
  private distribution: Record<string, Record<number, number>> | undefined;

  constructor(data: AugmentedRadarChartData, config: AugmentedRadarChartConfig) {
    if (validateConfig(config) && validateData(data)) {
      this.data = data;
      this.config = config;
      this.average = calculateAverage(data);
      this.distribution = calculateDistribution(data, config.bins);
    } else {
      throw new Error(`Invalid data or config`);
    }
  }

  protected abstract render(
    average: Record<string, number> | undefined,
    distribution: Record<string, Record<number, number>> | undefined,
    config: AugmentedRadarChartConfig | undefined,
  ): void;

  public draw() {
    this.render(this.average, this.distribution, this.config);
  }
}

export class AugmentedRadarChartSVG extends AugmentedRadarChart {
  protected render(
    average: Record<string, number> | undefined,
    distribution: Record<string, Record<number, number>> | undefined,
    config: AugmentedRadarChartConfig | undefined,
  ): void {
    console.log({ average, distribution, config });
  }
}

export class AugmentedRadarChartCanvas extends AugmentedRadarChart {
  protected render(
    average: Record<string, number> | undefined,
    distribution: Record<string, Record<number, number>> | undefined,
    config: AugmentedRadarChartConfig | undefined,
  ): void {
    console.log({ average, distribution, config });
  }
}
