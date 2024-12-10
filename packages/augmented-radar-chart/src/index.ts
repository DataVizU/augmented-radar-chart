import { AugmentedRadarChartConfig } from './type';
import { AugmentedRadarChartCanvas, AugmentedRadarChartSVG } from './chart';

export function draw(
  data: Array<Record<string, number>>,
  options: AugmentedRadarChartConfig,
  renderer: 'SVG' | 'Canvas',
): void {
  let chart;
  if (renderer === 'SVG') {
    chart = new AugmentedRadarChartSVG(data, options);
  } else {
    chart = new AugmentedRadarChartCanvas(data, options);
  }
  chart.draw();
}
