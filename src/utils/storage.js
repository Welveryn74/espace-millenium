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

export function getUsername() {
  return loadState('username', 'Utilisateur');
}

export function logActivity(activity) {
  try {
    const log = loadState('activity_log', []);
    log.push({ action: activity, time: Date.now() });
    // Garder les 50 dernières
    if (log.length > 50) log.splice(0, log.length - 50);
    saveState('activity_log', log);
  } catch {
    // Silent fail
  }
}

export function getRecentActivities(count = 10) {
  const log = loadState('activity_log', []);
  return log.slice(-count);
}
