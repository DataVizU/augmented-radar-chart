/**
 * @description **Check whether a given range is valid** <br> i.e. min < range.from < range.to < max
 * @param range - range to validate
 * @param max - the maximum datum in data
 * @param min - the minimum datum in data
 */
export function validateRange(range: { from: number; to: number }, max: number, min: number) {
  if (range.from <= min && range.to >= max) {
    return;
  } else {
    throw new Error('Invalid range');
  }
}
