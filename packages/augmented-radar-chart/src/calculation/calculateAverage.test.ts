import { describe, it, expect } from 'vitest';
import { calculateAverage } from './calculateAverage';
import { AugmentedRadarChartData } from '../type';

describe('calculateAverage', () => {
  it('should calculate average values for multiple dimensions', () => {
    const testData: AugmentedRadarChartData = [
      { coding: 90, design: 70, teamwork: 85, communication: 75, leadership: 60 },
      { coding: 85, design: 80, teamwork: 90, communication: 80, leadership: 70 },
      { coding: 95, design: 75, teamwork: 80, communication: 85, leadership: 65 },
    ];

    const result = calculateAverage(testData);

    expect(result).toEqual({
      coding: 90, // (90 + 85 + 95) / 3
      design: 75, // (70 + 80 + 75) / 3
      teamwork: 85, // (85 + 90 + 80) / 3
      communication: 80, // (75 + 80 + 85) / 3
      leadership: 65, // (60 + 70 + 65) / 3
    });
  });

  it('should handle decimal values correctly', () => {
    const testData: AugmentedRadarChartData = [
      { math: 92.5, physics: 88.3, chemistry: 76.8 },
      { math: 87.2, physics: 91.5, chemistry: 82.4 },
      { math: 90.8, physics: 85.7, chemistry: 79.3 },
    ];

    const result = calculateAverage(testData);

    expect(result).toEqual({
      math: 90.17, // (92.5 + 87.2 + 90.8) / 3
      physics: 88.5, // (88.3 + 91.5 + 85.7) / 3
      chemistry: 79.5, // (76.8 + 82.4 + 79.3) / 3
    });
  });

  it('should handle different number of data points', () => {
    const testData: AugmentedRadarChartData = [
      { sales: 100, marketing: 80, development: 90 },
      { sales: 120, marketing: 85, development: 95 },
      { sales: 110, marketing: 75, development: 85 },
      { sales: 105, marketing: 90, development: 88 },
      { sales: 115, marketing: 82, development: 92 },
    ];

    const result = calculateAverage(testData);

    expect(result).toEqual({
      sales: 110, // (100 + 120 + 110 + 105 + 115) / 5
      marketing: 82.4, // (80 + 85 + 75 + 90 + 82) / 5
      development: 90, // (90 + 95 + 85 + 88 + 92) / 5
    });
  });

  it('should handle single item data', () => {
    const testData: AugmentedRadarChartData = [
      { performance: 85, quality: 90, efficiency: 88, innovation: 92 },
    ];

    const result = calculateAverage(testData);

    expect(result).toEqual({
      performance: 85,
      quality: 90,
      efficiency: 88,
      innovation: 92,
    });
  });

  it('should handle empty data array', () => {
    const testData: AugmentedRadarChartData = [];

    expect(() => calculateAverage(testData)).toThrow();
  });
});
