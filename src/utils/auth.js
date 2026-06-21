import { sanitizeText, isValidEmail, isValidPassword, checkAuthRateLimit, recordAuthAttempt, clearAuthAttempts } from './sanitize';

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function signUp(name, email, password, guestId = null) {
  try {
    const safeName = sanitizeText(name, 80);
    const safeEmail = sanitizeText(email, 254).toLowerCase();

    if (safeName.length < 2) {
      return { success: false, error: 'Name must be at least 2 characters.' };
    }
    if (!isValidEmail(safeEmail)) {
      return { success: false, error: 'Invalid email format.' };
    }
    if (!isValidPassword(password)) {
      return { success: false, error: 'Password must be 6–128 characters.' };
    }

    const rateCheck = checkAuthRateLimit('signup');
    if (!rateCheck.allowed) {
      return { success: false, error: 'Too many attempts. Please wait a few minutes.' };
    }
    recordAuthAttempt('signup');

    const accounts = JSON.parse(localStorage.getItem('ecotrace_accounts')) || [];

    if (accounts.some((a) => a.email === safeEmail)) {
      return { success: false, error: 'An account with this email already exists. Try logging in instead.' };
    }

    const passwordHash = await hashPassword(password);

    const newAccount = {
      id: crypto.randomUUID(),
      name: safeName,
      email: safeEmail,
      passwordHash,
    };

    accounts.push(newAccount);
    localStorage.setItem('ecotrace_accounts', JSON.stringify(accounts));

    if (guestId) {
      const keysToRename = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith(`_${guestId}`)) {
          keysToRename.push(key);
        }
      }
      keysToRename.forEach((key) => {
        const newKey = key.replace(`_${guestId}`, `_${newAccount.id}`);
        localStorage.setItem(newKey, localStorage.getItem(key));
        localStorage.removeItem(key);
      });
    }

    const currentUser = { id: newAccount.id, name: newAccount.name, email: newAccount.email };
    localStorage.setItem('ecotrace_current_user', JSON.stringify(currentUser));
    clearAuthAttempts('signup');

    return { success: true, user: currentUser };
  } catch {
    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}

export function updateAccountName(newName) {
  const currentUser = JSON.parse(localStorage.getItem('ecotrace_current_user'));
  if (currentUser) {
    currentUser.name = sanitizeText(newName, 80);
    localStorage.setItem('ecotrace_current_user', JSON.stringify(currentUser));

    if (!currentUser.isGuest) {
      const accounts = JSON.parse(localStorage.getItem('ecotrace_accounts')) || [];
      const accountIndex = accounts.findIndex((a) => a.id === currentUser.id);
      if (accountIndex !== -1) {
        accounts[accountIndex].name = currentUser.name;
        localStorage.setItem('ecotrace_accounts', JSON.stringify(accounts));
      }
    }
    return currentUser;
  }
  return null;
}

export async function logIn(email, password) {
  try {
    const safeEmail = sanitizeText(email, 254).toLowerCase();

    if (!isValidEmail(safeEmail) || !password) {
      return { success: false, error: 'Incorrect email or password' };
    }

    const rateCheck = checkAuthRateLimit('login');
    if (!rateCheck.allowed) {
      return { success: false, error: 'Too many login attempts. Please wait a few minutes.' };
    }
    recordAuthAttempt('login');

    const accounts = JSON.parse(localStorage.getItem('ecotrace_accounts')) || [];
    const account = accounts.find((a) => a.email === safeEmail);

    if (!account) {
      return { success: false, error: 'Incorrect email or password' };
    }

    const passwordHash = await hashPassword(password);
    if (account.passwordHash !== passwordHash) {
      return { success: false, error: 'Incorrect email or password' };
    }

    const currentUser = { id: account.id, name: account.name, email: account.email };
    localStorage.setItem('ecotrace_current_user', JSON.stringify(currentUser));
    clearAuthAttempts('login');

    return { success: true, user: currentUser };
  } catch {
    return { success: false, error: 'Failed to log in. Please try again.' };
  }
}

export function continueAsGuest() {
  const guestUser = {
    id: `guest_${crypto.randomUUID()}`,
    name: 'Guest',
    email: null,
    isGuest: true,
  };
  localStorage.setItem('ecotrace_current_user', JSON.stringify(guestUser));
  return { success: true, user: guestUser };
}

export function logOut() {
  localStorage.removeItem('ecotrace_current_user');
  localStorage.removeItem('ecotrace_quiz_completed');
}

export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem('ecotrace_current_user'));
    return user || null;
  } catch {
    return null;
  }
}
