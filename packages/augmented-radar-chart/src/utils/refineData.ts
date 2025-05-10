import { ARCData, ARCDimension } from '../types';
import { validateRange } from './validateRange';
import { calculateAverage } from './calculateAverage';
import { calculateDistribution } from './calculateDistribution';

export function refineData(data: ARCData): ARCDimension {
  const dimension: ARCDimension = {};
  Object.entries(data).forEach((d) => {
    const [key, value] = d;

    value.data.forEach((val) => {
      if (!Number.isFinite(val)) {
        throw RangeError(`DATA_ERROR (in '${key}'): Data must be a valid number`);
      }
    });

    const max = Math.max(...value.data);
    const min = Math.min(...value.data);

    if (value.range === undefined) {
      value.range = { from: min, to: max };
    } else {
      validateRange(key, value.range, max, min);
    }

    dimension[key] = {
      average:
        (calculateAverage(value.data) - value.range.from) / (value.range.to - value.range.from),
      distribution: calculateDistribution(value.data, value.range),
    };
  });
  return dimension;
}
