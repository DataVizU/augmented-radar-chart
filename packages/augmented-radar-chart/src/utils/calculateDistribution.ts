export function calculateDistribution(data: Array<number>, range: { from: number; to: number }) {
  return Array.from(
    data.reduce((map, value) => {
      const normalize = (value - range.from) / (range.to - range.from);
      map.set(normalize, (map.get(normalize) || 0) + 1);
      return map;
    }, new Map<number, number>()),
  )
    .map(([point, value]) => ({ point, value }))
    .sort((a, b) => a.point - b.point);
}
