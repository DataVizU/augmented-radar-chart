import { ARCStyle } from './type';

export const DEFAULT_STYLE: ARCStyle = {
  x: { start: 0.05, end: 0.95 },
  y: { start: 0, end: 1 },
  border: {
    fill: '#000000',
  },
  band: {
    fill: '#80008049',
  },
  label: {
    fill: '#000000',
    'font-size': 16,
  },
  area: {
    fill: '#ffffff00',
    stroke: '#000000',
  },
  line: {
    stroke: '#ff0000',
    r: 8,
    fill: '#ffffff',
  },
};
