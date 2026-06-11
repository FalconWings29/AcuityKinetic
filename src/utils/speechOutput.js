// Thin wrapper over the Web Speech API. Voices load asynchronously in most
// browsers, so we cache them and refresh on the `voiceschanged` event.
let voicesCache = [];

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  voicesCache = window.speechSynthesis.getVoices() || [];
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

function pickVoice() {
  if (!voicesCache.length) loadVoices();
  const english = voicesCache.filter((v) => /^en/i.test(v.lang));
  const preferred = english.find((v) =>
    /Google US English|Samantha|Microsoft Aria|Microsoft Jenny|Microsoft Guy/i.test(v.name)
  );
  return preferred || english[0] || voicesCache[0] || null;
}

export function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.02;
    utterance.pitch = 1;
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    // Cancel any in-flight speech so the newest cue is spoken promptly.
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    /* speech is best-effort; never let it break the coaching loop */
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* no-op */
  }
}
