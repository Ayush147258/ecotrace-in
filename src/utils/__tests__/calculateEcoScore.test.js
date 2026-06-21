import { describe, it, expect } from 'vitest';
import { calculateEcoScore } from '../calculateEcoScore';

describe('calculateEcoScore', () => {
  const baseEmissions = {
    transport: 30,
    food: 40,
    energy: 50,
    shopping: 20,
    waste: 15,
    total: 155,
  };

  it('returns null for invalid emissions', () => {
    expect(calculateEcoScore(null)).toBeNull();
    expect(calculateEcoScore({ total: NaN })).toBeNull();
  });

  it('returns score between 420 and 1000', () => {
    const result = calculateEcoScore(baseEmissions);
    expect(result.score).toBeGreaterThanOrEqual(420);
    expect(result.score).toBeLessThanOrEqual(1000);
  });

  it('never assigns grade F', () => {
    const highFootprint = { ...baseEmissions, total: 500 };
    const result = calculateEcoScore(highFootprint);
    expect(result.grade).not.toBe('F');
    expect(result.grade).toMatch(/^[ABC]\+?$/);
  });

  it('includes percentile and vs India average', () => {
    const result = calculateEcoScore(baseEmissions);
    expect(result.percentile).toBeGreaterThanOrEqual(40);
    expect(typeof result.vs_india_avg).toBe('number');
    expect(result.level).toBeTruthy();
  });

  it('rewards low footprint with higher score', () => {
    const low = calculateEcoScore(baseEmissions);
    const high = calculateEcoScore({ ...baseEmissions, total: 400 });
    expect(low.score).toBeGreaterThan(high.score);
  });
});
