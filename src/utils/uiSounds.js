/**
 * uiSounds.js — Sons d'interface Windows XP via Web Audio API
 * Vérifie em_muted + em_volume avant chaque son
 */

import { getVolumeMultiplier } from './volumeManager';

let audioCtx = null;

function getCtx() {
  if (localStorage.getItem('em_muted') === 'true') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.08, startDelay = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const vol = volume * getVolumeMultiplier();
  if (vol < 0.001) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ctx.currentTime + startDelay;
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.01);
}

/** Clic doux bouton */
export function playClick() {
  playTone(800, 0.04, 'sine', 0.05);
}

/** Chime ascendant 3 notes — ouverture fenêtre */
export function playWindowOpen() {
  playTone(440, 0.12, 'sine', 0.06, 0);
  playTone(554, 0.12, 'sine', 0.06, 0.08);
  playTone(659, 0.18, 'sine', 0.06, 0.16);
}

/** Descente 2 notes — fermeture fenêtre */
export function playWindowClose() {
  playTone(554, 0.1, 'sine', 0.05, 0);
  playTone(370, 0.15, 'sine', 0.05, 0.08);
}

/** Sweep descendant rapide — minimize */
export function playMinimize() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.12);
  gain.gain.setValueAtTime(0.05 * vm, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.15);
}

/** Tick subtil — hover menu */
export function playMenuHover() {
  playTone(800, 0.035, 'sine', 0.03);
}

/** Bonk XP — erreur */
export function playError() {
  playTone(200, 0.15, 'square', 0.06, 0);
  playTone(160, 0.2, 'square', 0.06, 0.1);
}

/** Le "doodoo" MSN iconique — B4→E5→B5 */
export function playMSNMessage() {
  playTone(494, 0.12, 'sine', 0.08, 0);     // B4
  playTone(659, 0.12, 'sine', 0.08, 0.1);    // E5
  playTone(988, 0.18, 'sine', 0.08, 0.2);    // B5
}

/** Buzzer wizz MSN */
export function playMSNNudge() {
  const ctx = getCtx();
  if (!ctx) return;
  for (let i = 0; i < 4; i++) {
    playTone(150 + (i % 2) * 80, 0.06, 'sawtooth', 0.07, i * 0.07);
  }
}

/** Clic doux — sélection icône */
export function playIconSelect() {
  playTone(600, 0.03, 'sine', 0.04);
}

/** Montée de notes — victoire démineur */
export function playVictorySound() {
  playTone(523, 0.12, 'sine', 0.06, 0);     // C5
  playTone(659, 0.12, 'sine', 0.06, 0.1);   // E5
  playTone(784, 0.12, 'sine', 0.06, 0.2);   // G5
  playTone(1047, 0.25, 'sine', 0.07, 0.3);  // C6
}

/** Descente bruitée — explosion démineur */
export function playExplosionSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08 * vm, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  source.connect(gain).connect(ctx.destination);
  source.start();
  playTone(100, 0.3, 'sine', 0.06, 0);
}

/** Froissement papier — ouverture corbeille */
export function playPaperSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.04 * vm, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

/** Bruit blanc TV — changement de chaîne */
export function playTVStatic() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 3000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.04 * vm, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

/** Son de zip — cartable */
export function playZipSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.linearRampToValueAtTime(3000, t + 0.15);
  gain.gain.setValueAtTime(0.03 * vm, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.2);
}

// ── Sons mini-jeux ──

/** Pop court — manger fruit, flip carte */
export function playPop() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(500, t);
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.06);
  gain.gain.setValueAtTime(0.07 * vm, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.08);
}

/** Sweep montant — Tetris ligne complète */
export function playLineClear() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
  gain.gain.setValueAtTime(0.07 * vm, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.18);
}

/** Tick court — Tetris pièce posée */
export function playPieceLock() {
  playTone(300, 0.04, 'square', 0.06);
}

/** Rebond court — paddle Pong/CasseBriques */
export function playBounce() {
  playTone(600, 0.03, 'sine', 0.06);
}

/** Brique cassée — noise + tone */
export function playBrickBreak() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.05 * vm, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  source.connect(gain).connect(ctx.destination);
  source.start();
  playTone(800, 0.05, 'sine', 0.05);
}

/** Dé qui roule — 5 tones rapides aléatoires */
export function playDiceRoll() {
  const ctx = getCtx();
  if (!ctx) return;
  for (let i = 0; i < 5; i++) {
    playTone(300 + Math.random() * 300, 0.03, 'sine', 0.04, i * 0.04);
  }
}

/** Capture/élimination — sweep descendant */
export function playCapture() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.1);
  gain.gain.setValueAtTime(0.07 * vm, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.12);
}

/** Game over — 3 notes descendantes */
export function playGameOver() {
  playTone(400, 0.15, 'square', 0.06, 0);
  playTone(300, 0.15, 'square', 0.06, 0.12);
  playTone(200, 0.25, 'square', 0.06, 0.24);
}

/** Level up — 4 notes montantes rapides */
export function playLevelUp() {
  playTone(523, 0.08, 'triangle', 0.06, 0);
  playTone(659, 0.08, 'triangle', 0.06, 0.07);
  playTone(784, 0.08, 'triangle', 0.06, 0.14);
  playTone(1047, 0.15, 'triangle', 0.07, 0.21);
}

/** Paire trouvée — 2 notes montantes */
export function playMatchSound() {
  playTone(500, 0.1, 'sine', 0.06, 0);
  playTone(700, 0.15, 'sine', 0.06, 0.08);
}

/** Mauvaise paire — note basse */
export function playMismatch() {
  playTone(200, 0.08, 'sine', 0.05);
}

/** Tir bille — sweep montant court */
export function playShoot() {
  const ctx = getCtx();
  if (!ctx) return;
  const vm = getVolumeMultiplier();
  if (vm < 0.001) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(200, t);
  osc.frequency.exponentialRampToValueAtTime(600, t + 0.08);
  gain.gain.setValueAtTime(0.06 * vm, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.1);
}
