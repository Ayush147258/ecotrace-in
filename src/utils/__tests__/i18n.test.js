import { describe, it, expect } from 'vitest';
import { strings } from '../i18n';

describe('i18n', () => {
  const enKeys = Object.keys(strings.en);
  const hiKeys = Object.keys(strings.hi);

  it('has matching keys in English and Hindi', () => {
    enKeys.forEach((key) => {
      expect(hiKeys).toContain(key);
    });
  });

  it('includes critical UI strings', () => {
    expect(strings.en.landing_btn_start).toBeTruthy();
    expect(strings.en.dash_vs_india_avg).toBeTruthy();
    expect(strings.en.a11y_skip_to_main).toBeTruthy();
    expect(strings.en.chal_done).toBeTruthy();
  });
});
