import { describe, it, expect } from 'vitest';
import { calculateEcoScore } from '../utils/calculateEcoScore';

describe('calculateEcoScore', () => {
  it('returns null if emissions is null or total is NaN', () => {
    expect(calculateEcoScore(null)).toBeNull();
    expect(calculateEcoScore({ total: NaN })).toBeNull();
  });

  it('clamps score to maximum 1000', () => {
    // total = 0, all categories = 0. Bonus = 5 * 40 = 200
    // score = 880 + 200 - 0 = 1080 -> 1000
    const emissions = {
      total: 0,
      transport: 0,
      food: 0,
      energy: 0,
      shopping: 0,
      waste: 0
    };
    const result = calculateEcoScore(emissions);
    expect(result.score).toBe(1000);
    expect(result.grade).toBe('A+');
    expect(result.percentile).toBe(88);
  });

  it('clamps score to minimum 420', () => {
    // total = 2000, all categories = 400. Bonus = 0
    // score = 880 + 0 - (2000 / 216) * 280 = 880 - 2592 = -1712 -> 420
    const emissions = {
      total: 2000,
      transport: 400,
      food: 400,
      energy: 400,
      shopping: 400,
      waste: 400
    };
    const result = calculateEcoScore(emissions);
    expect(result.score).toBe(420);
    expect(result.grade).toBe('C');
    expect(result.percentile).toBe(40);
  });

  it('calculates correct score and grade for middle values', () => {
    // target score ~ 750 (Grade A)
    // total = 216 (ratio = 1), categories: 2 below avg (43.2) -> 2 * 40 = 80 bonus
    // score = 880 + 80 - 280 = 680 (Grade B+)
    const emissions1 = {
      total: 216,
      transport: 40, // < 43.2
      food: 40,      // < 43.2
      energy: 50,
      shopping: 50,
      waste: 36
    }; // Actually 3 categories < 43.2 -> bonus 120. Score = 880 + 120 - 280 = 720
    const result1 = calculateEcoScore(emissions1);
    expect(result1.score).toBe(720);
    expect(result1.grade).toBe('B+');

    // Make score = 850 (A+)
    // 880 + bonus - ratio * 280 = 850
    // If bonus = 0 (all categories > 43.2, total 250) -> 880 - 324 = 556 (B)
    const emissions2 = {
      total: 250,
      transport: 50,
      food: 50,
      energy: 50,
      shopping: 50,
      waste: 50
    };
    const result2 = calculateEcoScore(emissions2);
    expect(result2.score).toBe(556);
    expect(result2.grade).toBe('B');
    expect(result2.percentile).toBe(58);
  });

  it('calculates comparisons vs india average and paris target', () => {
    const emissions = {
      total: 300,
      transport: 60,
      food: 60,
      energy: 60,
      shopping: 60,
      waste: 60
    };
    const result = calculateEcoScore(emissions);
    
    // vs india avg: ((300 - 216) / 216) * 100 = 84 / 216 * 100 = 38.88... -> 39
    expect(result.vs_india_avg).toBe(39);
    
    // vs paris target: ((300 - 167) / 167) * 100 = 133 / 167 * 100 = 79.6... -> 80
    expect(result.vs_paris_target).toBe(80);
  });
});
