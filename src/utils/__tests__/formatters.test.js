import { describe, it, expect } from 'vitest';
import { formatCO2, formatMoney, formatPercent } from '../formatters';

describe('formatters', () => {
  it('formats CO2 in kg and tonnes', () => {
    expect(formatCO2(150)).toBe('150 kg');
    expect(formatCO2(1500)).toBe('1.5 t');
  });

  it('formats Indian rupee amounts', () => {
    expect(formatMoney(1500)).toBe('₹1,500');
  });

  it('formats percentages', () => {
    expect(formatPercent(72.4)).toBe('72%');
  });
});
