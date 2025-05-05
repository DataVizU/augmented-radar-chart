export function validateRange(range: { from: number; to: number }, max: number, min: number) {
  if (range.from <= min && range.to >= max) {
    return;
  } else {
    throw RangeError(`Invalid range: [${range.from}, ${range.to}]`);
  }
}
