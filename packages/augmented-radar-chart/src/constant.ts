import { ARCStyle } from './types';

export const DEFAULT_STYLE: ARCStyle = {
  x: { from: 0.05, to: 0.95 },
  y: { from: 0, to: 2 },
  offset: 0.05,
  border: {
    fill: '#aaaaaa',
  },
  band: {
    fill: '#80008049',
  },
  label: {
    fill: '#000000',
    'font-size': 24,
    // 'font size': 24,
  },
  area: {
    fill: '#ffffff00',
    stroke: '#aaaaaa',
  },
  line: {
    stroke: '#000000',
    fill: '#ffffff',
    strokeWidth: 16,
  },
};
