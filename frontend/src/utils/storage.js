export function readCollection(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return Array.isArray(value) && value.every(item => item && typeof item === 'object' && !Array.isArray(item))
      ? value : fallback;
  } catch {
    return fallback;
  }
}
