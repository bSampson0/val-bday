// Web Audio API — generates retro 8-bit sounds with no audio files needed
let ctx = null;

const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
};

const beep = (freq, duration, type = 'square', vol = 0.12, delay = 0) => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.connect(gain);
    gain.connect(c.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, c.currentTime + delay);
    gain.gain.setValueAtTime(vol, c.currentTime + delay + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + duration + 0.05);
  } catch {}
};

export const playCoin = () => {
  beep(988, 0.08);
  beep(1319, 0.15, 'square', 0.12, 0.09);
};

export const playPop = () => {
  try {
    const c = getCtx();
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.08), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = c.createBufferSource();
    const gain = c.createGain();
    src.buffer = buf;
    src.connect(gain);
    gain.connect(c.destination);
    gain.gain.setValueAtTime(0.25, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    src.start();
  } catch {}
};

export const playLevelUp = () => {
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((freq, i) => beep(freq, 0.18, 'square', 0.1, i * 0.09));
};

export const playStartup = () => {
  const notes = [330, 392, 494, 659, 784, 988];
  notes.forEach((freq, i) => beep(freq, 0.22, 'triangle', 0.1, i * 0.08));
};

export const playClick = () => {
  beep(440, 0.06, 'square', 0.08);
};
