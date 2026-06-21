import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword } from './auth';
import { sanitizeText, isValidEmail, isValidPassword, checkAuthRateLimit } from './sanitize';

describe('Auth & Sanitize Utilities', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    });
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  describe('sanitizeText', () => {
    it('strips HTML tags', () => {
      expect(sanitizeText('<script>alert(1)</script>hello', 100)).toBe('alert(1)hello');
      expect(sanitizeText('<p>test</p>')).toBe('test');
    });

    it('enforces maxLength', () => {
      expect(sanitizeText('hello world', 5)).toBe('hello');
    });

    it('handles non-strings gracefully', () => {
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(123)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejects incorrect emails', () => {
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('test example.com')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('validates passwords between 6 and 128 characters', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('a'.repeat(128))).toBe(true);
    });

    it('rejects passwords outside the length limits', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('a'.repeat(129))).toBe(false);
      expect(isValidPassword(null)).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('hashes password using SHA-256', async () => {
      // Mock crypto if not present in jsdom
      if (!globalThis.crypto) {
        globalThis.crypto = {
          subtle: {
            digest: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer)
          }
        };
      } else if (!globalThis.crypto.subtle) {
        globalThis.crypto.subtle = {
          digest: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer)
        };
      }
      
      const hash = await hashPassword('password123');
      expect(typeof hash).toBe('string');
      // For actual SHA-256 of 'password123', the length of hex string is 64
      // We don't want to strictly match mock if crypto exists in jsdom
      if (globalThis.crypto.subtle.digest.mock) {
        expect(hash).toBe('010203');
      } else {
        expect(hash).toHaveLength(64);
      }
    });
  });

  describe('checkAuthRateLimit', () => {
    it('allows if attempts are under limit', () => {
      sessionStorage.getItem.mockReturnValue(JSON.stringify([]));
      const result = checkAuthRateLimit('login');
      expect(result.allowed).toBe(true);
    });

    it('blocks if attempts exceed limit', () => {
      const now = Date.now();
      const attempts = [now, now, now, now, now];
      sessionStorage.getItem.mockReturnValue(JSON.stringify(attempts));
      
      const result = checkAuthRateLimit('login');
      expect(result.allowed).toBe(false);
      expect(result.retryAfterMs).toBeGreaterThan(0);
    });
  });
});
