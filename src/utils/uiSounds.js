/**
 * uiSounds.js — Sons d'interface Windows XP via Web Audio API
 * Vérifie em_muted avant chaque son
 */

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
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ctx.currentTime + startDelay;
  gain.gain.setValueAtTime(volume, t);
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
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.12);
  gain.gain.setValueAtTime(0.05, t);
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
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  source.connect(gain).connect(ctx.destination);
  source.start();
  playTone(100, 0.3, 'sine', 0.06, 0);
}

/** Froissement papier — ouverture corbeille */
export function playPaperSound() {
  const ctx = getCtx();
  if (!ctx) return;
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
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

/** Son de zip — cartable */
export function playZipSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.linearRampToValueAtTime(3000, t + 0.15);
  gain.gain.setValueAtTime(0.03, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.2);
}
