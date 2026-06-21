import { describe, it, expect } from 'vitest';
import { calculateEmissions } from '../calculateEmissions';
import { sampleQuizAnswers } from '../../test/fixtures.js';

describe('calculateEmissions', () => {
  it('returns zeros for null input', () => {
    const result = calculateEmissions(null);
    expect(result.total).toBe(0);
  });

  it('produces finite numbers for string-based quiz answers', () => {
    const result = calculateEmissions(sampleQuizAnswers);
    expect(Number.isFinite(result.total)).toBe(true);
    expect(Number.isFinite(result.transport)).toBe(true);
    expect(Number.isFinite(result.food)).toBe(true);
    expect(Number.isFinite(result.energy)).toBe(true);
    expect(Number.isFinite(result.shopping)).toBe(true);
    expect(Number.isFinite(result.waste)).toBe(true);
    expect(result.total).toBeGreaterThan(0);
  });

  it('calculates money saved when below India average', () => {
    const lowFootprint = {
      ...sampleQuizAnswers,
      transportMode: 'walking',
      dailyKm: 0,
      flightsPerYear: '0',
      eatingOut: 'Rarely',
      electricityUnits: 50,
      acHours: 'No AC',
      onlineOrders: '0-1',
      newClothes: '0',
    };
    const result = calculateEmissions(lowFootprint);
    expect(result.money_saved_vs_avg).toBeGreaterThan(0);
  });

  it('never returns NaN for partial quiz data', () => {
    const partial = { transportMode: 'bus', dailyKm: 5 };
    const result = calculateEmissions(partial);
    expect(Number.isNaN(result.total)).toBe(false);
  });
});
