import { AugmentedRadarChartData, AugmentedRadarChartSVGOptions } from './type';

export function helloWorld(): void {
  console.log('Hello World!');
}

export function drawSVG(
  data: AugmentedRadarChartData,
  option: AugmentedRadarChartSVGOptions,
): void {
  console.log({ data, option });
}
