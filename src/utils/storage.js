const PREFIX = 'em_';

export function loadState(key, defaultValue) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Silent fail — private browsing or quota exceeded
  }
}

export function clearState(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Silent fail
  }
}
