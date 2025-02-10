import { ARCData } from '../type';
import { validateRange } from './validation';
import { calcAverage, calcDistribution } from '../calculation';

export function preprocessData(data: ARCData) {
  Object.values(data).forEach((d) => {
    const max = Math.max(...d.data);
    const min = Math.min(...d.data);
    if (d.range === undefined) {
      d.range = { start: max, end: min };
    } else {
      validateRange(d.range, max, min);
    }

    d.average = (calcAverage(d.data) - d.range.start) / (d.range.end - d.range.start);
    d.distribution = calcDistribution(d.data, d.range);
  });
  return data;
}
