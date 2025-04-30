import { ARCData, ARCDimension } from '../types';
import { validateRange } from './validateRange';
import { calcAverage, calcDistribution } from '../calculation';

export function preprocessData(data: ARCData): ARCDimension {
  const dimension: ARCDimension = {};
  Object.entries(data).forEach((d) => {
    const [key, value] = d;
    const max = Math.max(...value.data);
    const min = Math.min(...value.data);
    if (value.range === undefined) {
      value.range = { start: min, end: max };
    } else {
      validateRange(value.range, max, min);
    }

    dimension[key] = {
      average:
        (calcAverage(value.data) - value.range.start) / (value.range.end - value.range.start),
      distribution: calcDistribution(value.data, value.range),
    };
  });
  return dimension;
}
