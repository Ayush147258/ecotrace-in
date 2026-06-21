const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_TAG_REGEX = /<[^>]*>/g;

/**
 * Strips HTML tags and dangerous characters from user text input.
 * @param {unknown} input
 * @param {number} maxLength
 */
export function sanitizeText(input, maxLength = 100) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(HTML_TAG_REGEX, '').slice(0, maxLength);
}

/** @param {unknown} email */
export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

/** @param {unknown} password */
export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6 && password.length <= 128;
}

/** Client-side login rate limit — max 5 attempts per 15 minutes. */
export function checkAuthRateLimit(action = 'login') {
  const key = `ecotrace_auth_attempts_${action}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  try {
    const raw = sessionStorage.getItem(key);
    const attempts = raw ? JSON.parse(raw) : [];
    const recent = attempts.filter((ts) => now - ts < windowMs);

    if (recent.length >= maxAttempts) {
      return { allowed: false, retryAfterMs: windowMs - (now - recent[0]) };
    }
    return { allowed: true, attempts: recent };
  } catch {
    return { allowed: true, attempts: [] };
  }
}

/** @param {string} action */
export function recordAuthAttempt(action = 'login') {
  const key = `ecotrace_auth_attempts_${action}`;
  const check = checkAuthRateLimit(action);
  const attempts = [...(check.attempts || []), Date.now()];
  sessionStorage.setItem(key, JSON.stringify(attempts));
}

/** @param {string} action */
export function clearAuthAttempts(action = 'login') {
  sessionStorage.removeItem(`ecotrace_auth_attempts_${action}`);
}
