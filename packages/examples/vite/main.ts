import { AugmentedRadarChartSVG, AugmentedRadarChartCanvas } from 'augmented-radar-chart';

customElements.define('augmented-radar-chart-svg', AugmentedRadarChartSVG);
customElements.define('augmented-radar-chart-canvas', AugmentedRadarChartCanvas);

const svg = document.createElement('augmented-radar-chart-svg') as AugmentedRadarChartSVG;
const canvas = document.createElement('augmented-radar-chart-canvas') as AugmentedRadarChartCanvas;

document.querySelector('div')!.appendChild(svg);
document.querySelector('div')!.appendChild(canvas);

const data = {
  'Software Engineer': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=20'))
      .json()
      .then((data) => data.numbers.map((x: number) => Math.trunc(Math.log(x + 1)))),
  },
  'Product Manager': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=20'))
      .json()
      .then((data) => data.numbers.map((x: number) => Math.trunc(Math.log(x + 1)))),
  },
  'HR Specialist': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=20'))
      .json()
      .then((data) => data.numbers.map((x: number) => Math.trunc(Math.log(x + 1)))),
  },
  'Data Scientist': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=20'))
      .json()
      .then((data) => data.numbers.map((x: number) => Math.trunc(Math.log(x + 1)))),
  },
  'Marketing Coordinator': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=20'))
      .json()
      .then((data) => data.numbers.map((x: number) => Math.trunc(Math.log(x + 1)))),
  },
};

const config = {
  size: 600,
  band: 2,
};

svg.data = data;
svg.config = config;

canvas.data = data;
canvas.config = config;
