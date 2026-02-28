/**
 * ambientSounds.js — Ambiance PC de bureau (ventilateur + clics disque dur)
 * Tout en Web Audio API, respecte em_muted
 */

let audioCtx = null;
let fanNode = null;
let fanGain = null;
let hdTimeout = null;
let running = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/** Bruit du ventilateur PC — bruit blanc filtré 80-120Hz */
function startFan() {
  const ctx = getCtx();
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  fanNode = ctx.createBufferSource();
  fanNode.buffer = buffer;
  fanNode.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 100;
  filter.Q.value = 0.5;

  fanGain = ctx.createGain();
  fanGain.gain.value = 0.06;

  fanNode.connect(filter).connect(fanGain).connect(ctx.destination);
  fanNode.start();
}

/** Clic de disque dur — spike aléatoire toutes les 15-40s */
function scheduleHDClick() {
  if (!running) return;
  const delay = 15000 + Math.random() * 25000;
  hdTimeout = setTimeout(() => {
    if (!running) return;
    if (localStorage.getItem('em_muted') === 'true') {
      if (running) scheduleHDClick();
      return;
    }
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 4000 + Math.random() * 1000;
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
    if (running) scheduleHDClick();
  }, delay);
}

/** Démarrer l'ambiance — appeler après boot */
export function startAmbient() {
  if (running) return;
  if (localStorage.getItem('em_muted') === 'true') return;
  running = true;
  startFan();
  scheduleHDClick();
}

/** Arrêter l'ambiance */
export function stopAmbient() {
  running = false;
  if (fanNode) {
    try { fanNode.stop(); } catch {}
    fanNode = null;
  }
  if (hdTimeout) {
    clearTimeout(hdTimeout);
    hdTimeout = null;
  }
  if (audioCtx) {
    audioCtx.close().catch(() => {});
    audioCtx = null;
  }
}

/** Mettre à jour le mute (couper le fan sans arrêter le cycle) */
export function setAmbientMuted(muted) {
  if (fanGain) {
    fanGain.gain.value = muted ? 0 : 0.06;
  }
}
