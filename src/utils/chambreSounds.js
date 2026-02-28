/**
 * chambreSounds.js — Sons ambiants de la chambre d'enfant
 * Tic-tac d'horloge, grillons nocturnes, clic de lampe, câlin peluche
 * Respecte em_muted
 */

let audioCtx = null;
let tickInterval = null;
let cricketTimeout = null;
let nightMode = false;

function getCtx() {
  if (localStorage.getItem('em_muted') === 'true') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.04, startDelay = 0) {
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

/* Tic-tac discret toutes les secondes */
function startTick() {
  if (tickInterval) return;
  tickInterval = setInterval(() => {
    playTone(2000, 0.02, 'sine', 0.015);
  }, 1000);
}

function stopTick() {
  if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
}

/* Grillons — deux tons alternés quand nuit */
function scheduleCricket() {
  if (!nightMode) return;
  const delay = 800 + Math.random() * 2200;
  cricketTimeout = setTimeout(() => {
    const freq = Math.random() > 0.5 ? 4000 : 4200;
    playTone(freq, 0.08, 'sine', 0.02);
    // second chirp
    setTimeout(() => {
      playTone(freq + 200, 0.06, 'sine', 0.015);
    }, 100);
    scheduleCricket();
  }, delay);
}

function stopCrickets() {
  if (cricketTimeout) { clearTimeout(cricketTimeout); cricketTimeout = null; }
}

/* API publique */

export function startChambreAmbient() {
  startTick();
  if (nightMode) scheduleCricket();
}

export function stopChambreAmbient() {
  stopTick();
  stopCrickets();
}

export function setChambreNightMode(isNight) {
  nightMode = isNight;
  if (isNight) {
    scheduleCricket();
  } else {
    stopCrickets();
  }
}

/** Clic mécanique de lampe */
export function playLampClick() {
  playTone(3000, 0.02, 'square', 0.06);
}

/** Son doux montant — câlin peluche */
export function playHugSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.linearRampToValueAtTime(400, t + 0.3);
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.4);
}
