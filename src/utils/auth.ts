import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInAnonymously,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  name: string;
  isGuest: boolean;
}

export async function signUp(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Set display name
    await updateProfile(user, { displayName: name });
    
    // Create initial user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      quizCompleted: false,
      streak: { current: 0, longest: 0, lastLogDate: null }
    });

    return { success: true };
  } catch (error: any) {
    let errorMessage = "An error occurred during sign up.";
    if (error.code === 'auth/email-already-in-use') errorMessage = "Email already in use.";
    if (error.code === 'auth/weak-password') errorMessage = "Password is too weak.";
    return { success: false, error: errorMessage };
  }
}

export async function logIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Invalid email or password." };
  }
}

export async function continueAsGuest() {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    
    // Set default guest name
    await updateProfile(user, { displayName: "Guest User" });
    
    // Create guest document if it doesn't exist
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        name: "Guest User",
        createdAt: new Date().toISOString(),
        quizCompleted: false,
        isGuest: true,
        streak: { current: 0, longest: 0, lastLogDate: null }
      });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to sign in anonymously." };
  }
}

export async function logOut() {
  await firebaseSignOut(auth);
}

export function getCurrentUser() {
  const u = auth.currentUser;
  if (!u) return null;
  return { id: u.uid, name: u.displayName || "User", isGuest: u.isAnonymous };
}

export async function updateAccountName(newName) {
  const u = auth.currentUser;
  if (u) {
    await updateProfile(u, { displayName: newName });
    await setDoc(doc(db, "users", u.uid), { name: newName }, { merge: true });
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
