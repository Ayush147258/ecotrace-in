import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const DEMO_SESSION_KEY = 'ecotrace_demo_session';
export const DEMO_USER_ID = 'demo';

export interface UserProfile {
  id: string;
  name: string;
  isGuest: boolean;
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
  try {
    clearDemoSession();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
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
  try {
    clearDemoSession();
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
  await firebaseSignOut(auth);
}

export function getCurrentUser() {
  const demoUser = getDemoUser();
  if (demoUser) return demoUser;

  const u = auth.currentUser;
  if (!u) return null;
  return { id: u.uid, name: u.displayName || 'User', isGuest: u.isAnonymous };
}

export async function updateAccountName(newName) {
  if (getDemoUser()) return;

  const u = auth.currentUser;
  if (u) {
    await updateProfile(u, { displayName: newName });
    await setDoc(doc(db, 'users', u.uid), { name: newName }, { merge: true });
  }
}

// Fallbacks for testing
export function sanitizeText(str, max) { return str.slice(0, max); }
export function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
export function isValidPassword(p) { return p.length >= 6; }
export function checkAuthRateLimit() { return { allowed: true }; }
export function recordAuthAttempt() {}
export function clearAuthAttempts() {}
export async function hashPassword(p) { return p; }