import { AugmentedRadarChartCanvas, AugmentedRadarChartSVG } from './charts';
import { ARCConfig, ARCData } from './type';

export function draw(data: ARCData, config: ARCConfig, style?: Record<string, unknown>): void {
  let chart;

  const renderer = config.renderer;

  if (renderer === 'svg') {
    chart = new AugmentedRadarChartSVG(data, config, style);
  } else {
    chart = new AugmentedRadarChartCanvas(data, config, style);
  }
  chart.render();
}
