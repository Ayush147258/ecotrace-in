import { describe, it, expect, beforeEach } from 'vitest';
import {
  sanitizeText, isValidEmail, isValidPassword,
  checkAuthRateLimit, recordAuthAttempt, clearAuthAttempts,
} from '../sanitize';

describe('sanitize', () => {
  it('strips HTML-like characters and trims input', () => {
    expect(sanitizeText('  Hello<script>  ')).toBe('Hello');
    expect(sanitizeText('a'.repeat(200), 50)).toHaveLength(50);
  });

  it('validates email format', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
  });

  it('validates password length', () => {
    expect(isValidPassword('secret123')).toBe(true);
    expect(isValidPassword('12345')).toBe(false);
  });

  it('rate limits auth attempts', () => {
    clearAuthAttempts('login');
    for (let i = 0; i < 5; i++) recordAuthAttempt('login');
    const blocked = checkAuthRateLimit('login');
    expect(blocked.allowed).toBe(false);
    clearAuthAttempts('login');
    expect(checkAuthRateLimit('login').allowed).toBe(true);
  });
});

describe('auth', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('hashes passwords consistently', async () => {
    const { hashPassword } = await import('../auth');
    const h1 = await hashPassword('testpass');
    const h2 = await hashPassword('testpass');
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(64);
  });

  it('signs up and logs in a user', async () => {
    const { signUp, logIn, getCurrentUser } = await import('../auth');
    const signup = await signUp('Ayush Kumar', 'ayush@test.com', 'password123');
    expect(signup.success).toBe(true);

    localStorage.removeItem('ecotrace_current_user');
    const login = await logIn('ayush@test.com', 'password123');
    expect(login.success).toBe(true);
    expect(getCurrentUser()?.email).toBe('ayush@test.com');
  });

  it('rejects duplicate email on signup', async () => {
    const { signUp } = await import('../auth');
    await signUp('User One', 'dup@test.com', 'password123');
    localStorage.removeItem('ecotrace_current_user');
    const dup = await signUp('User Two', 'dup@test.com', 'password456');
    expect(dup.success).toBe(false);
  });

  it('sanitizes malicious name input on signup', async () => {
    const { signUp, getCurrentUser } = await import('../auth');
    await signUp('<script>alert(1)</script>Hi', 'safe@test.com', 'password123');
    expect(getCurrentUser()?.name).not.toContain('<');
  });

  it('rejects invalid login credentials', async () => {
    const { logIn } = await import('../auth');
    const result = await logIn('bad@test.com', 'wrong');
    expect(result.success).toBe(false);
  });

  it('rejects weak signup input', async () => {
    const { signUp } = await import('../auth');
    const result = await signUp('A', 'not-an-email', '123');
    expect(result.success).toBe(false);
  });
});
