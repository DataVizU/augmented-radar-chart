export function calcDistribution(data: Array<number>, range: { start: number; end: number }) {
  const { start, end } = range;

  return Array.from(
    data.reduce((map, value) => {
      const normalize = (value - start) / (end - start);
      map.set(normalize, (map.get(normalize) || 0) + 1);
      return map;
    }, new Map<number, number>()),
  )
    .map(([point, value]) => ({ point, value }))
    .sort((a, b) => a.point - b.point);
}
