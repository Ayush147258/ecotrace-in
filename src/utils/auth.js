export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function signUp(name, email, password, guestId = null) {
  try {
    const accounts = JSON.parse(localStorage.getItem('ecotrace_accounts')) || [];
    
    // Check for duplicate email
    if (accounts.some(a => a.email === email)) {
      return { success: false, error: 'An account with this email already exists. Try logging in instead.' };
    }
    
    const passwordHash = await hashPassword(password);
    
    const newAccount = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash
    };
    
    accounts.push(newAccount);
    localStorage.setItem('ecotrace_accounts', JSON.stringify(accounts));
    
    // Merge guest data if a guestId is provided
    if (guestId) {
      const keysToRename = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith(`_${guestId}`)) {
          keysToRename.push(key);
        }
      }
      keysToRename.forEach(key => {
        const newKey = key.replace(`_${guestId}`, `_${newAccount.id}`);
        localStorage.setItem(newKey, localStorage.getItem(key));
        localStorage.removeItem(key);
      });
    }

    const currentUser = { id: newAccount.id, name: newAccount.name, email: newAccount.email };
    localStorage.setItem('ecotrace_current_user', JSON.stringify(currentUser));
    
    return { success: true, user: currentUser };
  } catch (error) {
    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}

export function updateAccountName(newName) {
  const currentUser = JSON.parse(localStorage.getItem('ecotrace_current_user'));
  if (currentUser) {
    currentUser.name = newName;
    localStorage.setItem('ecotrace_current_user', JSON.stringify(currentUser));
    
    if (!currentUser.isGuest) {
      const accounts = JSON.parse(localStorage.getItem('ecotrace_accounts')) || [];
      const accountIndex = accounts.findIndex(a => a.id === currentUser.id);
      if (accountIndex !== -1) {
        accounts[accountIndex].name = newName;
        localStorage.setItem('ecotrace_accounts', JSON.stringify(accounts));
      }
    }
    return currentUser;
  }
  return null;
}

export async function logIn(email, password) {
  try {
    const accounts = JSON.parse(localStorage.getItem('ecotrace_accounts')) || [];
    const normalizedEmail = email.trim().toLowerCase();
    
    const account = accounts.find(a => a.email === normalizedEmail);
    if (!account) {
      return { success: false, error: 'Incorrect email or password' };
    }
    
    const passwordHash = await hashPassword(password);
    if (account.passwordHash !== passwordHash) {
      return { success: false, error: 'Incorrect email or password' };
    }
    
    const currentUser = { id: account.id, name: account.name, email: account.email };
    localStorage.setItem('ecotrace_current_user', JSON.stringify(currentUser));
    
    return { success: true, user: currentUser };
  } catch (error) {
    return { success: false, error: 'Failed to log in. Please try again.' };
  }
}

export function continueAsGuest() {
  const guestUser = {
    id: 'guest_' + crypto.randomUUID(),
    name: 'Guest',
    email: null,
    isGuest: true
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
  } catch (e) {
    return null;
  }
}
