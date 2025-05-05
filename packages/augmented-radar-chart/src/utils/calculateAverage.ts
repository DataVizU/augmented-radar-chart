/**
 * @description **Calculate the average of a list of numbers**
 */
export function calculateAverage(data: Array<number>): number {
  if (data.includes(Infinity) || data.includes(NaN)) {
    throw RangeError('Data must be numbers');
  }
  return data.reduce((acc, v) => acc + v, 0) / data.length;
}
