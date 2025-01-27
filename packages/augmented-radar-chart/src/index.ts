import { AugmentedRadarChartCanvas, AugmentedRadarChartSVG } from './charts';

export function draw(
  data: Record<string, Array<number>>,
  config: Record<string, unknown>,
  renderer: 'SVG' | 'Canvas',
): void {
  let chart;
  if (renderer === 'SVG') {
    chart = new AugmentedRadarChartSVG(data, config);
  } else {
    chart = new AugmentedRadarChartCanvas(data, config);
  }
  chart.draw();
}
