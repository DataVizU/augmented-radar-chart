import { AugmentedRadarChartSVG } from 'augmented-radar-chart';

customElements.define('augmented-radar-chart-svg', AugmentedRadarChartSVG);
const svg = document.createElement('augmented-radar-chart-svg') as AugmentedRadarChartSVG;

document.body.appendChild(svg);

const data = {
  'Software Engineer': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=10'))
      .json()
      .then((data) => data.numbers.map((x: number) => x % 10)),
  },
  'Product Manager': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=10'))
      .json()
      .then((data) => data.numbers.map((x: number) => x % 10)),
  },
  'HR Specialist': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=10'))
      .json()
      .then((data) => data.numbers.map((x: number) => x % 10)),
  },
  'Data Scientist': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=10'))
      .json()
      .then((data) => data.numbers.map((x: number) => x % 10)),
  },
  'Marketing Coordinator': {
    data: await (await fetch('https://uapis.cn/api/sjsz?count=10'))
      .json()
      .then((data) => data.numbers.map((x: number) => x % 10)),
  },
};

const config = {
  size: 600,
  band: 5,
};

svg.data = data;
svg.config = config;

console.log(data);
