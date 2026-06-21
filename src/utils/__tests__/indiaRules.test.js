import { describe, it, expect, vi } from 'vitest';
import { getRuleBasedTips } from '../indiaRules';

describe('indiaRules', () => {
  it('returns default tips when emissions are null', () => {
    const tips = getRuleBasedTips(null);
    expect(tips).toHaveLength(3);
    tips.forEach((tip) => {
      expect(tip.text).toBeTruthy();
      expect(tip.co2).toBeGreaterThan(0);
    });
  });

  it('returns tips from highest emitting categories', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const tips = getRuleBasedTips({
      transport: 100,
      food: 80,
      energy: 60,
      shopping: 20,
      waste: 10,
    });
    expect(tips).toHaveLength(3);
    Math.random.mockRestore();
  });
});
