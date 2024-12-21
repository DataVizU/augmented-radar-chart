import { AugmentedRadarChartConfig, AugmentedRadarChartData } from './type';
import { AugmentedRadarChartCanvas, AugmentedRadarChartSVG } from './chart';

export function draw(
  data: AugmentedRadarChartData,
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

export function helloWorld(): void {
  console.log('Hello World!');
}
