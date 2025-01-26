import { preprocess } from './preprocess';
import { describe, it, expect } from 'vitest';
import { AugmentedRadarChartConfig, AugmentedRadarChartData } from '../type';

describe('preprocess', () => {
  it('should convert user input to ARCtypes, using default config if not given', () => {
    const testData = {
      MyGO: [1, 2, 3, 1, 2, 3, 3, 2],
      Morfonica: [4, 5, 6, 4, 5],
      Roselia: [7, 8, 9, 7, 8],
    };
    const testConfig = {
      size: 10,
      container: null,
      bins: {
        MyGO: { start: 0, end: 3 },
        Morfonica: { start: 4, end: 6 },
      },
      styles: {
        area: { band: 5, color: 'red' },
        line: { color: 'blue', width: 2 },
      },
    };

    const result = preprocess(testData, testConfig);

    const expectedData: AugmentedRadarChartData = {
      MyGO: [
        { point: 1, value: 2 },
        { point: 2, value: 3 },
        { point: 3, value: 3 },
      ],
      Morfonica: [
        { point: 4, value: 2 },
        { point: 5, value: 2 },
        { point: 6, value: 1 },
      ],
      Roselia: [
        { point: 7, value: 2 },
        { point: 8, value: 2 },
        { point: 9, value: 1 },
      ],
    };

    const expectedConfig: AugmentedRadarChartConfig = {
      container: null,
      size: 10,
      bins: {
        MyGO: { start: 0, end: 3 },
        Morfonica: { start: 4, end: 6 },
        Roselia: { start: 7, end: 9 },
      },
      styles: {
        area: { band: 5, color: 'red' },
        line: { color: 'blue', width: 2 },
      },
    };

    expect(result).toEqual({
      data: expectedData,
      config: expectedConfig,
    });
  });

  it('should throw error if data is empty', () => {
    const testData = {};
    const testConfig = {
      size: 10,
      container: null,
      bins: {
        MyGO: { start: 0, end: 3 },
        Morfonica: { start: 4, end: 6 },
        Roselia: { start: 7, end: 9 },
      },
      styles: {
        area: { band: 5, color: 'red' },
        line: { color: 'blue', width: 2 },
      },
    };

    expect(() => preprocess(testData, testConfig)).toThrowError('Empty data.');
  });

  it('should throw error if dimension is empty', () => {
    const testData = {
      MyGO: [1, 2, 3, 1, 2, 3, 3, 2],
      Morfonica: [4, 5, 6, 4, 5],
      Roselia: [],
    };
    const testConfig = {
      size: 10,
      container: null,
      bins: {
        MyGO: { start: 0, end: 3 },
        Morfonica: { start: 4, end: 6 },
        Roselia: { start: 7, end: 9 },
      },
      styles: {
        area: { band: 5, color: 'red' },
        line: { color: 'blue', width: 2 },
      },
    };

    expect(() => preprocess(testData, testConfig)).toThrowError(
      'Empty data for dimension "Roselia".',
    );
  });

  it('should throw error if bin ranges are invalid', () => {
    const testData = {
      MyGO: [1, 2, 3, 1, 2, 3, 3, 2],
      Morfonica: [4, 5, 6, 4, 5],
      Roselia: [7, 8, 9, 7, 8],
    };
    const testConfig = {
      size: 10,
      container: null,
      bins: {
        MyGO: { start: 0, end: 3 },
        Morfonica: { start: 6, end: 4 },
      },
      styles: {
        area: { band: 5, color: 'red' },
        line: { color: 'blue', width: 2 },
      },
    };

    expect(() => preprocess(testData, testConfig)).toThrowError(
      'Invalid range for "Morfonica" in bins.',
    );
  });

  it('should throw error if colors are invalid', () => {
    const testData = {
      MyGO: [1, 2, 3, 1, 2, 3, 3, 2],
      Morfonica: [4, 5, 6, 4, 5],
      Roselia: [7, 8, 9, 7, 8],
    };
    const testConfig = {
      size: 10,
      container: null,
      bins: {
        MyGO: { start: 0, end: 3 },
        Morfonica: { start: 4, end: 6 },
      },
      styles: {
        area: { band: 5, color: 'ADDINT' },
        line: { color: 'blue', width: 2 },
      },
    };

    expect(() => preprocess(testData, testConfig)).toThrowError(
      'Invalid area color in area configuration.',
    );
  });

  it('should throw error if bin ranges are invalid', () => {
    const testData = {
      MyGO: [1, 2, 3, 1, 2, 3, 3, 2],
      Morfonica: [4, 5, 6, 4, 5],
      Roselia: [7, 8, 9, 7, 8],
    };
    const testConfig = {
      size: 10,
      container: null,
      bins: {
        MyGO: { start: 0, end: 3 },
        Morfonica: { start: 6, end: 4 },
      },
      styles: {
        area: { band: 5, color: 'red' },
        line: { color: 'blue', width: 2 },
      },
    };

    expect(() => preprocess(testData, testConfig)).toThrowError(
      'Invalid range for "Morfonica" in bins.',
    );
  });

  it('should throw error if colors are invalid', () => {
    const testData = {
      MyGO: [1, 2, 3, 1, 2, 3, 3, 2],
      Morfonica: [4, 5, 6, 4, 5],
      Roselia: [7, 8, 9, 7, 8],
    };
    const testConfig = {
      size: -10,
      container: null,
      bins: {
        MyGO: { start: 0, end: 3 },
        Morfonica: { start: 4, end: 6 },
      },
      styles: {
        area: { band: 5, color: 'ADDINT' },
        line: { color: 'blue', width: 2 },
      },
    };

    expect(() => preprocess(testData, testConfig)).toThrowError(
      'Invalid size in chart configuration',
    );
  });
});
