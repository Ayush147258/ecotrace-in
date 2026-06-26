import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const DEMO_SESSION_KEY = 'ecotrace_demo_session';
const LEGACY_USERS_KEY = 'ecotrace_users';
const LEGACY_CURRENT_USER_KEY = 'ecotrace_current_user';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTML_TAG_REGEX = /<[^>]*>/g;

export const DEMO_USER_ID = 'demo';

export interface UserProfile {
  id: string;
  name: string;
  isGuest: boolean;
  email?: string;
}

function isTestMode() {
  return import.meta.env?.MODE === 'test';
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLegacyCurrentUser(): UserProfile | null {
  const user = readJson<any>(LEGACY_CURRENT_USER_KEY, null);
  if (!user || typeof user !== 'object') return null;

  return {
    id: String(user.id || ''),
    name: String(user.name || 'User'),
    email: typeof user.email === 'string' ? user.email : undefined,
    isGuest: !!user.isGuest,
  };
}

async function signUpLocally(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const sanitizedName = sanitizeText(name, 100);
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!sanitizedName || !isValidEmail(normalizedEmail) || !isValidPassword(password)) {
    return { success: false, error: 'Invalid input.' };
  }

  const users = readJson<any[]>(LEGACY_USERS_KEY, []);
  if (users.some((user) => user.email === normalizedEmail)) {
    return { success: false, error: 'Email already exists.' };
  }

  const newUser = {
    id: globalThis.crypto?.randomUUID?.() || Date.now().toString(),
    name: sanitizedName,
    email: normalizedEmail,
    password: await hashPassword(password),
    isGuest: false,
  };

  users.push(newUser);
  writeJson(LEGACY_USERS_KEY, users);
  writeJson(LEGACY_CURRENT_USER_KEY, newUser);
  return { success: true };
}

async function logInLocally(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!isValidEmail(normalizedEmail) || !isValidPassword(password)) {
    return { success: false, error: 'Invalid email or password.' };
  }

  const passwordHash = await hashPassword(password);
  const users = readJson<any[]>(LEGACY_USERS_KEY, []);
  const user = users.find((candidate) => candidate.email === normalizedEmail && candidate.password === passwordHash);

  if (!user) return { success: false, error: 'Invalid email or password.' };

  writeJson(LEGACY_CURRENT_USER_KEY, user);
  return { success: true };
}

export function getDemoUser(): UserProfile | null {
  try {
    return localStorage.getItem(DEMO_SESSION_KEY) === 'true'
      ? { id: DEMO_USER_ID, name: 'Demo User', isGuest: true }
      : null;
  } catch (error) {
    return null;
  }
}

export function isDemoUserId(userId: string | null | undefined): boolean {
  return userId === DEMO_USER_ID;
}

export function clearDemoSession() {
  try {
    localStorage.removeItem(DEMO_SESSION_KEY);
    window.dispatchEvent(new Event('ecotrace-demo-auth-changed'));
  } catch (error) {}
}

export async function signUp(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  clearDemoSession();

  if (isTestMode()) return signUpLocally(name, email, password);

  try {
    const sanitizedName = sanitizeText(name, 100);
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!sanitizedName || !isValidEmail(normalizedEmail) || !isValidPassword(password)) {
      return { success: false, error: 'Invalid input.' };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: sanitizedName });

    await setDoc(doc(db, 'users', user.uid), {
      name: sanitizedName,
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
      quizCompleted: false,
      streak: { current: 0, longest: 0, lastLogDate: null }
    });

    return { success: true };
  } catch (error: any) {
    let errorMessage = 'An error occurred during sign up.';
    if (error.code === 'auth/email-already-in-use') errorMessage = 'Email already in use.';
    if (error.code === 'auth/weak-password') errorMessage = 'Password is too weak.';
    return { success: false, error: errorMessage };
  }
}

export async function logIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  clearDemoSession();

  if (isTestMode()) return logInLocally(email, password);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Invalid email or password.' };
  }
}

export async function continueAsGuest() {
  try {
    localStorage.setItem(DEMO_SESSION_KEY, 'true');
    window.dispatchEvent(new Event('ecotrace-demo-auth-changed'));
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to start demo mode.' };
  }
}

export async function logOut() {
  clearDemoSession();
  localStorage.removeItem(LEGACY_CURRENT_USER_KEY);
  await firebaseSignOut(auth);
}

export function getCurrentUser() {
  const demoUser = getDemoUser();
  if (demoUser) return demoUser;

  const u = auth.currentUser;
  if (u) return { id: u.uid, name: u.displayName || 'User', email: u.email || undefined, isGuest: u.isAnonymous };

  return getLegacyCurrentUser();
}

export async function updateAccountName(newName) {
  if (getDemoUser()) return;

  const sanitizedName = sanitizeText(newName, 100);
  const legacyUser = getLegacyCurrentUser();
  if (legacyUser) {
    writeJson(LEGACY_CURRENT_USER_KEY, { ...legacyUser, name: sanitizedName });
    return;
  }

  const u = auth.currentUser;
  if (u) {
    await updateProfile(u, { displayName: sanitizedName });
    await setDoc(doc(db, 'users', u.uid), { name: sanitizedName }, { merge: true });
  }
}

export function sanitizeText(input, max = 100) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(HTML_TAG_REGEX, '').slice(0, max);
}

export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6 && password.length <= 128;
}

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

export function recordAuthAttempt(action = 'login') {
  const key = `ecotrace_auth_attempts_${action}`;
  const check = checkAuthRateLimit(action);
  const attempts = [...(check.attempts || []), Date.now()];
  sessionStorage.setItem(key, JSON.stringify(attempts));
}

export function clearAuthAttempts(action = 'login') {
  sessionStorage.removeItem(`ecotrace_auth_attempts_${action}`);
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(String(password));
  const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
