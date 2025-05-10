export function calculateAverage(data: Array<number>): number {
  return data.reduce((acc, v) => acc + v, 0) / data.length;
}
