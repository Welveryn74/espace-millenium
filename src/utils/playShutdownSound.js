import { getVolumeMultiplier } from './volumeManager';

// XP shutdown jingle — 4 descending sine notes
export function playShutdownSound(audioCtx) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.1 * getVolumeMultiplier();
  masterGain.connect(audioCtx.destination);

  const notes = [
    { freq: 523, start: 0,    dur: 0.4 },   // C5
    { freq: 392, start: 0.35, dur: 0.4 },   // G4
    { freq: 330, start: 0.7,  dur: 0.4 },   // E4
    { freq: 262, start: 1.05, dur: 0.9 },   // C4 — long fade
  ];

  notes.forEach(({ freq, start, dur }) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    g.gain.setValueAtTime(0.3, now + start);
    g.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
    osc.connect(g).connect(masterGain);
    osc.start(now + start);
    osc.stop(now + start + dur);
  });
}
