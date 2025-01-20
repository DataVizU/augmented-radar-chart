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
    };

    const testConfig = {
      MyGO: { start: 0, end: 5 },
    };

    const result = calculateDistribution(testData, testConfig);

    expect(result).toEqual({
      MyGO: [
        { point: 0.2, value: 10 },
        { point: 0.4, value: 20 },
        { point: 0.6, value: 30 },
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
