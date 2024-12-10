import { AugmentedRadarChartConfig, AugmentedRadarChartData } from './type';
import { validateConfig, validateData } from './validation';
import { calculateAverage, calculateDistribution } from './calculation';

abstract class AugmentedRadarChart {
  private data: AugmentedRadarChartData | undefined;
  private config: AugmentedRadarChartConfig | undefined;
  private average: Record<string, number> | undefined;
  private distribution: AugmentedRadarChartData | undefined;

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
  public draw(): void {}
}

export class AugmentedRadarChartSVG extends AugmentedRadarChart {
  public draw(): void {}
}

export class AugmentedRadarChartCanvas extends AugmentedRadarChart {
  public draw(): void {}
}
