import { ARCStyle } from './types';

export const DEFAULT_STYLE: ARCStyle = {
  x: { from: 0.05, to: 0.95 },
  y: { from: 0, to: 2 },
  offset: 0.05,
  background: {
    stroke: '#aaaaaa',
    fill: '#ffffff',
  },
  label: {
    fill: '#000000',
    offset: 0.05,
    'font-size': 24,
  },
  chart: {
    fill: '#80008049',
  },
  line: {
    stroke: '#000000',
  },
};
