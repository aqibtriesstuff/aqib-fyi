// Soft retro UI sounds via the Web Audio API (no audio files).
// Browsers only allow the audio context to start after a user gesture, so
// the very first auto-playing intro line is silent until the visitor clicks
// or presses a key; everything after that plays.

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

// call on a user gesture (e.g. the intro's first click) to unlock audio so
// everything after -- including the first typed line -- can play
export function unlockAudio() {
  getCtx();
}

type Wave = 'square' | 'sine' | 'triangle' | 'sawtooth';

export function playTone(freq: number, durMs: number, gain: number, type: Wave = 'square') {
  const c = getCtx();
  if (!c) return;
  try {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = c.currentTime;
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + durMs / 1000);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t);
    osc.stop(t + durMs / 1000);
  } catch {
    /* ignore audio errors */
  }
}

// menu / link hover + select
export function playHover() {
  playTone(523, 55, 0.03, 'square');
}
export function playSelect() {
  playTone(659, 80, 0.04, 'square');
  window.setTimeout(() => playTone(880, 90, 0.04, 'square'), 70);
}

// intro: a soft tick per typed character, a gentle advance, a soft close
// mechanical key press: a short bandpassed noise "click" plus a quick
// pitch-dropping "thock" body. Slightly randomized so it isn't robotic.
export function playTick() {
  const c = getCtx();
  if (!c) return;
  try {
    const now = c.currentTime;

    // 1) the click -- a brief bandpassed noise transient
    const len = Math.max(1, Math.floor(c.sampleRate * 0.02));
    const buffer = c.createBuffer(1, len, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2600 + Math.random() * 900;
    bp.Q.value = 1.1;
    const ng = c.createGain();
    ng.gain.value = 0.35;
    noise.connect(bp);
    bp.connect(ng);
    ng.connect(c.destination);
    noise.start(now);

    // 2) the thock -- a quick pitch-dropping body
    const osc = c.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280 + Math.random() * 70, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
    const og = c.createGain();
    og.gain.setValueAtTime(0.16, now);
    og.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    osc.connect(og);
    og.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    /* ignore audio errors */
  }
}
export function playAdvance() {
  playTone(330, 50, 0.025, 'triangle');
}
export function playClose() {
  playTone(392, 130, 0.03, 'sine');
}

// a low, fluttering purr when the cat is petted
export function playPurr() {
  const c = getCtx();
  if (!c) return;
  try {
    const now = c.currentTime;
    const dur = 1.3;

    const osc = c.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 55;

    // tremolo: the rrrr flutter of a purr
    const mod = c.createGain();
    mod.gain.value = 0.06;
    const lfo = c.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 24;
    const lfoGain = c.createGain();
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(mod.gain);

    // overall fade in and out
    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(1, now + 0.2);
    env.gain.setValueAtTime(1, now + dur - 0.25);
    env.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(mod);
    mod.connect(env);
    env.connect(c.destination);
    osc.start(now);
    lfo.start(now);
    osc.stop(now + dur);
    lfo.stop(now + dur);
  } catch {
    /* ignore audio errors */
  }
}

// a short grumpy grumble when the cat is over-petted
export function playGrumble() {
  const c = getCtx();
  if (!c) return;
  try {
    const now = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(165, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.26);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.06, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  } catch {
    /* ignore audio errors */
  }
}
