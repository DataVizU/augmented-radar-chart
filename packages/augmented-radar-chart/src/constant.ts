import { ARCStyle } from './types';

export const DEFAULT_STYLE: ARCStyle = {
  x: { start: 0.05, end: 0.95 },
  y: { start: 0, end: 1 },
  border: {
    fill: '#aaaaaa',
  },
  band: {
    fill: '#80008049',
  },
  label: {
    fill: '#000000',
    'font-size': 24,
  },
  area: {
    fill: '#ffffff00',
    stroke: '#aaaaaa',
  },
  line: {
    stroke: '#000000',
    fill: '#ffffff',
  },
};
