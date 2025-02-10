import { ARCConfig, ARCData, ARCStyle } from '../type';
import { preprocessConfig, preprocessStyle } from '../preprocess';
import { preprocessData } from '../preprocess';
import { DEFAULT_STYLE } from '../constant';

export abstract class AugmentedRadarChart {
  protected data: ARCData;
  protected config: ARCConfig;
  protected style: ARCStyle;

  constructor(data: ARCData, config: ARCConfig, style?: Record<string, unknown>) {
    this.data = preprocessData(data);
    this.config = preprocessConfig(config);

    // @ts-expect-error: TBD
    this.style = style ? preprocessStyle(style) : DEFAULT_STYLE;
  }
  public abstract render(): void;
}
