import { getVolumeMultiplier } from './volumeManager';

export function playModemSound(audioCtx, duration = 3) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.08 * getVolumeMultiplier();
  masterGain.connect(audioCtx.destination);

  // Dial tones
  [697, 1209, 770, 1336, 852, 1477].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    g.gain.setValueAtTime(0.3, now + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1);
    osc.connect(g).connect(masterGain);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.1);
  });

  // Carrier tones (handshake)
  const handshakeStart = now + 0.8;
  [1200, 2400, 1800, 980, 1650, 2100].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = i % 2 === 0 ? "square" : "sawtooth";
    g.gain.setValueAtTime(0, handshakeStart + i * 0.3);
    g.gain.linearRampToValueAtTime(0.15, handshakeStart + i * 0.3 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, handshakeStart + i * 0.3 + 0.28);
    osc.connect(g).connect(masterGain);
    osc.start(handshakeStart + i * 0.3);
    osc.stop(handshakeStart + i * 0.3 + 0.3);
  });

  // White noise burst
  const noiseLen = audioCtx.sampleRate * 1.5;
  const noiseBuffer = audioCtx.createBuffer(1, noiseLen, audioCtx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseLen; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = audioCtx.createBufferSource();
  const noiseGain = audioCtx.createGain();
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 1800;
  noiseFilter.Q.value = 2;
  noise.buffer = noiseBuffer;
  noiseGain.gain.setValueAtTime(0, now + 2.2);
  noiseGain.gain.linearRampToValueAtTime(0.4, now + 2.4);
  noiseGain.gain.linearRampToValueAtTime(0, now + 3.5);
  noise.connect(noiseFilter).connect(noiseGain).connect(masterGain);
  noise.start(now + 2.2);
  noise.stop(now + 3.5);
}
