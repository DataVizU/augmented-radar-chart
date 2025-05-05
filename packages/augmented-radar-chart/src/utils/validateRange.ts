/**
 * @description **Validate if the given range fully contains the data range** <br>
 * Passes validation only when range.from ≤ min AND range.to ≥ max
 * @param range - Range object to validate
 * @param max - Maximum value in the dataset
 * @param min - Minimum value in the dataset
 * @throws {RangeError} Throws error when range doesn't fully contain [min, max]
 */
export function validateRange(range: { from: number; to: number }, max: number, min: number) {
  if (range.from <= min && range.to >= max) {
    return;
  } else {
    throw RangeError(`Invalid range: [${range.from}, ${range.to}]`);
  }
}
