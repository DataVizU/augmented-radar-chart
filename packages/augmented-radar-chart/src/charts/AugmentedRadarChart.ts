import { ARCConfig, ARCData, ARCDimension, ARCStyle } from '../type';
import { preprocessConfig, preprocessStyle } from '../preprocess';
import { preprocessData } from '../preprocess';
import { DEFAULT_STYLE } from '../constant';

export abstract class AugmentedRadarChart {
  protected config: ARCConfig;
  protected style: ARCStyle;
  protected dimension: ARCDimension;

  constructor(data: ARCData, config: ARCConfig, style?: Record<string, unknown>) {
    this.dimension = preprocessData(data);
    this.config = preprocessConfig(config);

    // @ts-expect-error: TBD
    this.style = style ? preprocessStyle(style) : DEFAULT_STYLE;
  }
  public abstract render(): void;
}
