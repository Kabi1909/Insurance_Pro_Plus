export function readSession(key) {
  for (const storage of [sessionStorage, localStorage]) {
    try {
      const value = JSON.parse(storage.getItem(key) || 'null');
      if (value && typeof value === 'object' && !Array.isArray(value) &&
          typeof value.name === 'string' && typeof value.email === 'string' &&
          typeof value.id === 'string') return value;
      storage.removeItem(key);
    } catch {
      // A stale or malformed demo session must not prevent the app loading.
      try { storage.removeItem(key); } catch { /* Storage may be unavailable. */ }
    }
  }
  return null;
}

export function clearSession(key) {
  for (const storage of [sessionStorage, localStorage]) {
    try { storage.removeItem(key); } catch { /* Logout still clears React state. */ }
  }
}

export function writeSession(key, value, remember = false) {
  clearSession(key);
  try {
    (remember ? localStorage : sessionStorage).setItem(key, JSON.stringify(value));
  } catch {
    throw new Error('Unable to save your session. Allow browser storage and try again.');
  }
}

export function updateSession(key, value) {
  writeSession(key, value, localStorage.getItem(key) !== null);
}
