// Tiny Web Audio chime so a new coaching cue feels like a coach getting your
// attention. No audio files needed; the tones are synthesized.
let ctx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Call from a user gesture (e.g. the Start Coaching click) to unlock audio so
// the first chime can play without being blocked by autoplay policy.
export function primeAudio() {
  getCtx();
}

// Short two-note ascending blip.
export function playCueChime() {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  const notes = [659.25, 987.77]; // E5 -> B5
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = now + i * 0.08;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  });
}
