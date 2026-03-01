/**
 * volumeManager.js — Gestion centralisée du volume global
 * Stocke em_volume (0-100) dans localStorage
 * Tous les modules son importent getVolumeMultiplier()
 */

const STORAGE_KEY = 'em_volume';
const DEFAULT_VOLUME = 75;

/** Lire le volume brut (0-100) */
export function getVolume() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === null) return DEFAULT_VOLUME;
    const n = parseInt(v, 10);
    return isNaN(n) ? DEFAULT_VOLUME : Math.max(0, Math.min(100, n));
  } catch {
    return DEFAULT_VOLUME;
  }
}

/** Sauvegarder le volume (0-100) */
export function saveVolume(v) {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.min(100, v))));
  } catch {}
}

/** Multiplicateur pour les gains audio (0.0 — 1.0) */
export function getVolumeMultiplier() {
  if (localStorage.getItem('em_muted') === 'true') return 0;
  return getVolume() / 100;
}
