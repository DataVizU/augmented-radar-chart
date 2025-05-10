export function validateRange(
  key: string,
  range: { from: number; to: number },
  max: number,
  min: number,
) {
  if (range.from <= min && range.to >= max) {
    return;
  } else {
    throw RangeError(`DATA_ERROR (in '${key}'): Invalid range for [${range.from}, ${range.to}]`);
  }
}
