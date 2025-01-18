import { describe, it, expect } from 'vitest';
import { calculateDistribution } from './index';
import { AugmentedRadarChartData } from '../type';

describe('calculateDistribution', () => {
  it('should normalize points for multiple dimensions', () => {
    const testData: AugmentedRadarChartData = {
      MyGO: [
        { point: 1, value: 10 },
        { point: 2, value: 20 },
        { point: 3, value: 30 },
      ],
      Morfonica: [
        { point: 1, value: 0 },
        { point: 2, value: 20 },
        { point: 3, value: 40 },
      ],
      Roselia: [
        { point: 1, value: -20 },
        { point: 2, value: 0 },
        { point: 3, value: 40 },
      ],
    };

    const testConfig = {
      MyGO: { start: 0, end: 50 },
      Morfonica: { start: 0, end: 40 },
      Roselia: { start: -30, end: 50 },
    };

    const result = calculateDistribution(testData, testConfig);

    expect(result).toEqual({
      MyGO: [
        { point: 1, value: 0.2 },
        { point: 2, value: 0.4 },
        { point: 3, value: 0.6 },
      ],
      Morfonica: [
        { point: 1, value: 0.0 },
        { point: 2, value: 0.5 },
        { point: 3, value: 1.0 },
      ],
      Roselia: [
        { point: 1, value: 0.125 },
        { point: 2, value: 0.375 },
        { point: 3, value: 0.875 },
      ],
    });
  });

  it('should infer bins if not given', () => {
    // use [min, max]
    const testData: AugmentedRadarChartData = {
      RAS: [
        { point: 1, value: 10 },
        { point: 2, value: 20 },
        { point: 3, value: 30 },
      ],
    };

    const result = calculateDistribution(testData);

    expect(result).toEqual({
      RAS: [
        { point: 0, value: 10 },
        { point: 0.5, value: 20 },
        { point: 1, value: 30 },
      ],
    });
  });
});
