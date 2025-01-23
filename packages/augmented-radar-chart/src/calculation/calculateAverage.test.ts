import { describe, it, expect } from 'vitest';
import { calculateAverage } from './index';
import { AugmentedRadarChartData } from '../type';

describe('calculateAverage', () => {
  it('should calculate average values for multiple dimensions', () => {
    const testData: AugmentedRadarChartData = {
      MyGo: [
        { point: 20, value: 2 },
        { point: 30, value: 2 },
      ],
      Morfonica: [
        { point: -10, value: 6 },
        { point: 20, value: 3 },
        { point: 30, value: 6 },
      ],
    };

    const result = calculateAverage(testData);

    expect(result).toEqual({
      MyGo: 25, // (20 * 2 + 30 * 2) / 4
      Morfonica: 12,
    });
  });
});
