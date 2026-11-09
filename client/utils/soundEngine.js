/**
 * High-Tech Web Audio API Synthesizer & Sound FX Engine
 * Zero dependencies, ultra-low latency, native browser audio.
 */

let audioCtx = null;
let isSoundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundEngine = {
  isEnabled: () => isSoundEnabled,
  toggle: () => {
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      SoundEngine.playSuccess();
    }
    return isSoundEnabled;
  },
  setEnabled: (val) => {
    isSoundEnabled = !!val;
  },

  // Soft futuristic UI click
  playClick: () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  },

  // Bit traversal tone (0 = low 440Hz triangle, 1 = high 880Hz sine)
  playBit: (bit) => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = bit === '1' ? 880 : 440;
      osc.type = bit === '1' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
  },

  // Dynamic pitched tone for symbol hover / frequency inspection
  playTone: (freq = 600, duration = 0.09, type = 'sine') => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(120, Math.min(2400, freq)), ctx.currentTime);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  },

  // Harmonious chime when reaching a leaf node (C-E-G triad)
  playLeafChime: (weight = 1) => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const baseFreq = 523.25; // C5
      const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5]; // C - E - G

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.02);

        gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35 + i * 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.02);
        osc.stop(ctx.currentTime + 0.35 + i * 0.02);
      });
    } catch (e) {}
  },

  // Triumphant sci-fi arpeggio on successful compression or model generation
  playSuccess: () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((note, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.07, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.22);
      });
    } catch (e) {}
  },

  // Sci-fi sparkle flourish
  playSparkle: () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const freqs = [880, 1108.73, 1318.51, 1760];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.04);

        gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.18);
      });
    } catch (e) {}
  },

  // Error/glitch sound for channel bit-flip corruption
  playGlitch: () => {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  }
};
