/**
 * chiptunePlayer.js — Moteur audio dual-mode : preview Spotify (~30s) + chiptune 8-bit
 * Preview : <audio> joue directement (pas de MediaElementSource → pas de piège CORS)
 * Chiptune : oscillateurs Web Audio → masterGain → analyser → destination
 * Visualiseur : réagit au chiptune via AnalyserNode, animation simulée en mode preview
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

// Preview mode
let audioElement = null;
let playbackMode = 'chiptune'; // 'chiptune' | 'preview'
let onEndedCallback = null;

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

function getAudioElement() {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = 'auto';
    // Volume aligné sur le gain chiptune (0.1 par défaut)
    audioElement.volume = localStorage.getItem('em_muted') === 'true' ? 0 : 0.1;
  }
  return audioElement;
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

function cleanAudioHandlers(el) {
  el.onerror = null;
  el.onended = null;
  el.onloadedmetadata = null;
}

function stopPreview() {
  const el = getAudioElement();
  cleanAudioHandlers(el);
  el.pause();
  el.removeAttribute('src');
  el.load();
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

function playPreview(url, melody) {
  const ctx = getCtx();
  const el = getAudioElement();

  // Nettoyer tout ancien handler avant d'en poser de nouveaux
  cleanAudioHandlers(el);

  playbackMode = 'preview';
  el.src = url;

  // Flag anti-doublon : le fallback ne peut se déclencher qu'une seule fois
  let didFallback = false;
  const fallback = () => {
    if (didFallback) return;
    didFallback = true;
    cleanAudioHandlers(el);
    el.pause();
    if (melody && isPlaying) {
      playbackMode = 'chiptune';
      scheduleMelody(melody);
    }
  };

  el.onerror = fallback;

  el.onloadedmetadata = () => {
    totalDuration = el.duration || 30;
    startTime = ctx.currentTime;
  };

  el.onended = () => {
    if (isPlaying && onEndedCallback) onEndedCallback();
  };

  const playPromise = el.play();
  if (playPromise) {
    playPromise.catch(fallback);
  }
}

/**
 * play() — accepte un objet track complet OU une melody brute (rétrocompatibilité)
 */
export function play(trackOrMelody, endedCb) {
  stop();
  onEndedCallback = endedCb || null;
  isPlaying = true;
  isPaused = false;
  getCtx();

  // Objet track complet (avec previewUrl et/ou melody)
  if (trackOrMelody && trackOrMelody.previewUrl) {
    currentMelody = trackOrMelody.melody || null;
    playPreview(trackOrMelody.previewUrl, currentMelody);
  } else {
    // Melody brute ou objet track sans previewUrl
    const melody = trackOrMelody?.melody || trackOrMelody;
    currentMelody = melody;
    playbackMode = 'chiptune';
    if (melody) scheduleMelody(melody);
  }
}

export function pause() {
  if (!isPlaying || isPaused) return;
  isPaused = true;
  if (playbackMode === 'preview') {
    getAudioElement().pause();
  } else {
    pauseTime = audioCtx ? audioCtx.currentTime : 0;
    stopScheduled();
  }
}

export function resume() {
  if (!isPaused) return;
  isPaused = false;
  isPlaying = true;
  if (playbackMode === 'preview') {
    getAudioElement().play().catch(() => {});
  } else if (currentMelody) {
    scheduleMelody(currentMelody);
  }
}

export function stop() {
  isPlaying = false;
  isPaused = false;
  currentMelody = null;
  onEndedCallback = null;
  stopScheduled();
  if (audioElement) stopPreview();
}

export function destroy() {
  stop();
  if (audioElement) {
    cleanAudioHandlers(audioElement);
    audioElement.removeAttribute('src');
    audioElement.load();
    audioElement = null;
  }
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

  // En mode preview, l'audio ne passe pas par l'AnalyserNode → simuler le visualiseur
  if (playbackMode === 'preview' && isPlaying && !isPaused) {
    for (let i = 0; i < data.length; i++) {
      // Courbe descendante réaliste : basses fortes, aigus faibles
      const base = Math.max(0, 1 - i / data.length);
      data[i] = Math.floor((100 + Math.random() * 100) * base);
    }
  }

  return data;
}

export function getElapsedTime() {
  if (!isPlaying) return 0;
  if (playbackMode === 'preview' && audioElement) {
    return audioElement.currentTime || 0;
  }
  if (!audioCtx) return 0;
  return (audioCtx.currentTime - startTime) % totalDuration;
}

export function getProgress() {
  if (!totalDuration) return 0;
  if (playbackMode === 'preview' && audioElement) {
    const dur = audioElement.duration || totalDuration;
    return dur > 0 ? (audioElement.currentTime / dur) * 100 : 0;
  }
  return (getElapsedTime() / totalDuration) * 100;
}

export function getTotalDuration() {
  if (playbackMode === 'preview' && audioElement && audioElement.duration) {
    return audioElement.duration;
  }
  return totalDuration;
}

export function getPlaybackMode() {
  return playbackMode;
}

export function getIsPlaying() {
  return isPlaying && !isPaused;
}

export function setVolume(v) {
  if (masterGain) masterGain.gain.value = v;
  if (audioElement) audioElement.volume = v;
}
