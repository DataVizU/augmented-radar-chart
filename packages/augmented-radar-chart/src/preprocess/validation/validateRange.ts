export function validateRange(range: { start: number; end: number }, max: number, min: number) {
  if (range.start <= min && range.end >= max) {
    return;
  } else {
    throw new Error('Invalid range');
  }
}
