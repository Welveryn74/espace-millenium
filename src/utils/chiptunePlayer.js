/**
 * chiptunePlayer.js — Moteur audio chiptune 8-bit via Web Audio API
 * Joue des mélodies en boucle avec visualiseur fréquentiel
 */

let audioCtx = null;
let analyser = null;
let masterGain = null;
let scheduledNodes = [];
let loopTimeout = null;
let startTime = 0;
let totalDuration = 0;
let currentMelody = null;
let isPlaying = false;
let isPaused = false;
let pauseTime = 0;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = localStorage.getItem('em_muted') === 'true' ? 0 : 0.1;
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.7;
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function stopScheduled() {
  scheduledNodes.forEach(n => {
    try { n.stop(); } catch {}
  });
  scheduledNodes = [];
  if (loopTimeout) {
    clearTimeout(loopTimeout);
    loopTimeout = null;
  }
}

function scheduleMelody(melody) {
  const ctx = getCtx();
  const { bpm = 120, wave = 'square', notes = [], bass = [] } = melody;
  const beatDur = 60 / bpm;
  let time = ctx.currentTime;
  startTime = time;

  // Calculate total duration
  let noteDur = 0;
  notes.forEach(([, beats]) => { noteDur += beats * beatDur; });
  let bassDur = 0;
  bass.forEach(([, beats]) => { bassDur += beats * beatDur; });
  totalDuration = Math.max(noteDur, bassDur) || 2;

  // Schedule melody notes
  let t = time;
  notes.forEach(([freq, beats, vel = 0.5]) => {
    const dur = beats * beatDur;
    if (freq > 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = wave;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(vel * 0.3, t);
      g.gain.setValueAtTime(vel * 0.3, t + dur * 0.7);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.95);
      osc.connect(g).connect(masterGain);
      osc.start(t);
      osc.stop(t + dur);
      scheduledNodes.push(osc);
    }
    t += dur;
  });

  // Schedule bass notes
  let tb = time;
  bass.forEach(([freq, beats, vel = 0.4]) => {
    const dur = beats * beatDur;
    if (freq > 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(vel * 0.25, tb);
      g.gain.setValueAtTime(vel * 0.25, tb + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.001, tb + dur * 0.9);
      osc.connect(g).connect(masterGain);
      osc.start(tb);
      osc.stop(tb + dur);
      scheduledNodes.push(osc);
    }
    tb += dur;
  });

  // Loop: re-schedule at the end
  loopTimeout = setTimeout(() => {
    if (isPlaying && !isPaused) {
      stopScheduled();
      scheduleMelody(melody);
    }
  }, totalDuration * 1000);
}

export function play(melody) {
  stop();
  currentMelody = melody;
  isPlaying = true;
  isPaused = false;
  getCtx();
  scheduleMelody(melody);
}

export function pause() {
  if (!isPlaying || isPaused) return;
  isPaused = true;
  pauseTime = audioCtx ? audioCtx.currentTime : 0;
  stopScheduled();
}

export function resume() {
  if (!isPaused || !currentMelody) return;
  isPaused = false;
  isPlaying = true;
  scheduleMelody(currentMelody);
}

export function stop() {
  isPlaying = false;
  isPaused = false;
  currentMelody = null;
  stopScheduled();
}

export function destroy() {
  stop();
  if (audioCtx) {
    audioCtx.close().catch(() => {});
    audioCtx = null;
    analyser = null;
    masterGain = null;
  }
}

export function getFrequencyData() {
  if (!analyser) return new Uint8Array(32);
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data;
}

export function getElapsedTime() {
  if (!isPlaying || !audioCtx) return 0;
  return (audioCtx.currentTime - startTime) % totalDuration;
}

export function getProgress() {
  if (!totalDuration) return 0;
  return (getElapsedTime() / totalDuration) * 100;
}

export function getIsPlaying() {
  return isPlaying && !isPaused;
}

export function setVolume(v) {
  if (masterGain) masterGain.gain.value = v;
}
