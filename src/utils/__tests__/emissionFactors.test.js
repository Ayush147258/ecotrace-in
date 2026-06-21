import { describe, it, expect } from 'vitest';
import { INDIA_FACTORS, INDIA_BENCHMARKS } from '../emissionFactors';

describe('emissionFactors', () => {
  it('defines India-specific transport factors', () => {
    expect(INDIA_FACTORS.transport.petrol_bike).toBeGreaterThan(0);
    expect(INDIA_FACTORS.transport.metro).toBeLessThan(INDIA_FACTORS.transport.car_petrol);
    expect(INDIA_FACTORS.transport.walk_cycle).toBe(0);
  });

  it('uses India national average of 216 kg/month', () => {
    expect(INDIA_BENCHMARKS.national_avg_monthly).toBe(216);
  });

  it('includes all five footprint categories', () => {
    expect(INDIA_FACTORS.food).toBeDefined();
    expect(INDIA_FACTORS.energy).toBeDefined();
    expect(INDIA_FACTORS.shopping).toBeDefined();
    expect(INDIA_FACTORS.waste).toBeDefined();
  });
});
