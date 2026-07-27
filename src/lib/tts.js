// Browser-native text-to-speech, used as the sound for every speaker button
// until real Tigrinya recordings are dropped into public/audio/. There is no
// Tigrinya voice in any browser, so this is a best-effort reading of the
// Latin transliteration — not authentic pronunciation, but real audible
// speech instead of nothing.
let cachedVoices = [];

if (typeof window !== "undefined" && window.speechSynthesis) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

const PREFERRED_LANG_PREFIXES = ["ti", "am"];

function pickVoice() {
  for (const prefix of PREFERRED_LANG_PREFIXES) {
    const match = cachedVoices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (match) return match;
  }
  return null;
}

export function ttsSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speakText(text) {
  if (!text || !ttsSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 1;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}
