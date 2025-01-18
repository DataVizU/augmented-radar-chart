import { describe, it, expect } from 'vitest';
import { calculateAverage } from './index';
import { AugmentedRadarChartData } from '../type';

describe('calculateAverage', () => {
  it('should calculate average values for multiple dimensions', () => {
    const testData: AugmentedRadarChartData = {
      MyGo: [
        { point: 1, value: 10 },
        { point: 2, value: 20 },
        { point: 3, value: 30 },
      ],
      Morfonica: [
        { point: 1, value: 40 },
        { point: 2, value: 50 },
        { point: 3, value: 60 },
      ],
    };

    const result = calculateAverage(testData);

    expect(result).toEqual({
      MyGo: 20, // (10 + 20 + 30) / 3
      Morfonica: 50, // (40 + 50 + 60) / 3
    });
  });
});

