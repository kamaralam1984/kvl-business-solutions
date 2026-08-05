'use client';

// Free-only voice output — the browser's built-in speechSynthesis, but
// actively picking the best available female/"natural"-labeled system voice
// instead of leaving it on whatever default the browser falls back to, plus
// a slightly warmer pitch/rate. This is the ceiling for zero-cost voice
// output — it will never be indistinguishable from a real person the way a
// paid neural TTS API would, but it reads noticeably softer than the flat
// default voice most browsers ship.
let voicesCache: SpeechSynthesisVoice[] = [];
let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve([]);
  if (voicesCache.length) return Promise.resolve(voicesCache);
  if (voicesReady) return voicesReady;

  voicesReady = new Promise(resolve => {
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length) { voicesCache = existing; resolve(existing); return; }

    const onVoices = () => {
      voicesCache = synth.getVoices();
      synth.removeEventListener('voiceschanged', onVoices);
      resolve(voicesCache);
    };
    synth.addEventListener('voiceschanged', onVoices);
    // Some browsers never fire voiceschanged if the list was already ready — safety timeout.
    setTimeout(() => resolve(synth.getVoices()), 500);
  });
  return voicesReady;
}

function pickVoice(voices: SpeechSynthesisVoice[], isHindi: boolean): SpeechSynthesisVoice | undefined {
  const lang = isHindi ? 'hi' : 'en';
  const inLang = voices.filter(v => v.lang.toLowerCase().startsWith(lang));
  const pool = inLang.length ? inLang : voices;
  const soft = pool.find(v => /female|women|zira|samantha|susan|natural|google.*female|google हिन्दी/i.test(v.name));
  return soft || pool[0];
}

export async function speakNatural(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined') { onEnd?.(); return; }
  const synth = window.speechSynthesis;
  if (!synth) { onEnd?.(); return; }
  synth.cancel();

  const isHindi = /[ऀ-ॿ]/.test(text);
  const voices = await loadVoices();
  const voice = pickVoice(voices, isHindi);

  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  u.lang = voice?.lang || (isHindi ? 'hi-IN' : 'en-IN');
  u.pitch = 1.08;
  u.rate = 0.97;
  u.onend = () => onEnd?.();
  synth.speak(u);
}

export function cancelSpeaking() {
  if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
}
