import { describe, it, expect } from 'vitest';
import { calculateEmissions } from '../utils/calculateEmissions';

describe('calculateEmissions', () => {
  it('returns zeros for null payload', () => {
    const result = calculateEmissions(null);
    expect(result).toEqual({
      transport: 0, food: 0, energy: 0, shopping: 0, waste: 0, total: 0, money_saved_vs_avg: 0
    });
  });

  it('calculates correct math for baseline payload', () => {
    const payload = {
      transportMode: 'petrol_2w',
      dailyKm: 10,
      flightsPerYear: '0',
      diet: 'pure_veg',
      eatingOut: 'Rarely',
      foodWaste: 'Minimal (We repurpose leftovers)',
      lpgCylinders: '4-6',
      electricityUnits: 100,
      acHours: 'No AC',
      inverter: 'no',
      newClothes: '0',
      onlineOrders: '0-1',
      wasteManagement: 'mixed'
    };

    const result = calculateEmissions(payload);
    
    // Detailed calculation check:
    // transport: 10 * 30 * 0.089 = 26.7
    // food: (0.5 * 30) + (0.5 * 4 * 1.8) + (0.2 * 30) = 15 + 3.6 + 6 = 24.6
    // energy: (5 / 12) * 11.7 + (100 * 0.82) = 4.875 + 82 = 86.875
    // shopping: (0.5 * 3.5) = 1.75
    // waste: 30 * 0.5 = 15
    // total: 26.7 + 24.6 + 86.875 + 1.75 + 15 = 154.925
    // money_saved: (216 - 154.925) * 15 = 61.075 * 15 = 916.125
    
    expect(result.transport).toBeCloseTo(26.7);
    expect(result.food).toBeCloseTo(24.6);
    expect(result.energy).toBeCloseTo(86.875);
    expect(result.shopping).toBeCloseTo(1.75);
    expect(result.waste).toBeCloseTo(15);
    expect(result.total).toBeCloseTo(154.925);
    expect(result.money_saved_vs_avg).toBeCloseTo(916.125);
  });

  it('calculates correctly with EV multipliers and segregated waste', () => {
    const payload = {
      transportMode: 'ev_car',
      dailyKm: 20,
      flightsPerYear: '1-2', // 1.5 flights. (1.5 * 1000 * 0.255) / 12 = 31.875
      diet: 'vegan', // 0.5 * 30 * 0.85 = 12.75
      eatingOut: '1-2x a week', // 1.5 * 4 * 1.8 = 10.8
      foodWaste: 'Average (Some scraps thrown)', // 0.5 * 30 = 15
      lpgCylinders: 'PNG Piped Gas', // 1.5. (1.5 / 12) * 11.7 = 1.4625
      electricityUnits: 200, // 200 * 0.82 = 164
      acHours: '1-3 hours', // 2 * 30 * 0.82 = 49.2
      inverter: 'yes', // 50 * 0.82 = 41
      newClothes: '1-2 items', // 1.5 * 15 = 22.5
      onlineOrders: '2-5', // 3.5 * 3.5 = 12.25
      wasteManagement: 'segregated' // 30 * 0.5 * 0.75 = 11.25
    };

    const result = calculateEmissions(payload);
    
    // ev_car: car_cng -> 0.096. 20 * 30 * 0.096 = 57.6
    // EV multiplier: 57.6 * 0.35 = 20.16
    // transport = 20.16 + 31.875 = 52.035
    expect(result.transport).toBeCloseTo(52.035);
    
    // food = 12.75 + 10.8 + 15 = 38.55
    expect(result.food).toBeCloseTo(38.55);
    
    // energy = 1.4625 + 164 + 49.2 + 41 = 255.6625
    expect(result.energy).toBeCloseTo(255.6625);
    
    // shopping = 22.5 + 12.25 = 34.75
    expect(result.shopping).toBeCloseTo(34.75);
    
    // waste = 11.25
    expect(result.waste).toBeCloseTo(11.25);
    
    // total = 52.035 + 38.55 + 255.6625 + 34.75 + 11.25 = 392.2475
    expect(result.total).toBeCloseTo(392.2475);
    
    // diff = 216 - 392.2475 = -176.2475. Diff not > 0, so money_saved = 0.
    expect(result.money_saved_vs_avg).toBe(0);
  });
});
