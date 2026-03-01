/**
 * radioMelodies.js — Mélodies chiptune en boucle pour la radio de chambre
 * 4 stations avec oscillateurs Web Audio
 * Respecte em_muted + em_volume
 */

import { getVolumeMultiplier } from './volumeManager';

let audioCtx = null;
let currentOsc = null;
let currentGain = null;
let loopTimeout = null;
let currentStation = null;

function getCtx() {
  if (localStorage.getItem('em_muted') === 'true') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

const STATIONS = {
  nrj: {
    name: "NRJ Hits",
    // Pop entraînante — notes rapides
    notes: [523, 587, 659, 698, 784, 698, 659, 587, 523, 440, 494, 523],
    durations: [0.15, 0.15, 0.15, 0.15, 0.3, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15, 0.3],
    type: 'square',
    volume: 0.04,
  },
  rtl2: {
    name: "RTL2",
    // Ballade douce — notes longues sine
    notes: [330, 392, 440, 494, 440, 392, 349, 330, 294, 330, 349, 392],
    durations: [0.4, 0.4, 0.3, 0.5, 0.3, 0.4, 0.4, 0.3, 0.4, 0.3, 0.3, 0.5],
    type: 'sine',
    volume: 0.05,
  },
  fun: {
    name: "Fun Radio",
    // Techno rapide — square
    notes: [262, 330, 392, 523, 392, 330, 262, 330, 392, 523, 659, 523],
    durations: [0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.2],
    type: 'square',
    volume: 0.035,
  },
  inter: {
    name: "France Inter",
    // Jingle calme — sine lent
    notes: [440, 494, 523, 494, 440, 392, 440, 494, 523, 587, 523, 494],
    durations: [0.5, 0.3, 0.4, 0.3, 0.5, 0.4, 0.3, 0.3, 0.4, 0.5, 0.3, 0.5],
    type: 'sine',
    volume: 0.04,
  },
};

function playMelody(stationId) {
  const ctx = getCtx();
  if (!ctx) return;
  const station = STATIONS[stationId];
  if (!station) return;

  let time = 0;
  const notes = station.notes;
  const durs = station.durations;

  for (let i = 0; i < notes.length; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = station.type;
    osc.frequency.value = notes[i];
    const t = ctx.currentTime + time;
    gain.gain.setValueAtTime(station.volume * getVolumeMultiplier(), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durs[i] * 0.9);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + durs[i]);
    time += durs[i];
  }

  // Loop after melody ends + small pause
  loopTimeout = setTimeout(() => {
    if (currentStation === stationId) playMelody(stationId);
  }, time * 1000 + 400);
}

export function getStationList() {
  return Object.entries(STATIONS).map(([id, s]) => ({ id, name: s.name }));
}

export function startRadio(stationId) {
  stopRadio();
  currentStation = stationId;
  playMelody(stationId);
}

export function stopRadio() {
  currentStation = null;
  if (loopTimeout) { clearTimeout(loopTimeout); loopTimeout = null; }
}

export function isPlaying() {
  return currentStation !== null;
}

export function getCurrentStation() {
  return currentStation;
}
