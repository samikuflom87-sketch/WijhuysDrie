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
  const synth = window.speechSynthesis;
  synth.cancel();
  // Chrome silently suspends its speech engine after ~15s of tab
  // inactivity; resume() before speaking wakes it back up so the next
  // utterance isn't dropped (a well-known Chrome speechSynthesis bug).
  synth.resume();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 1;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  synth.speak(utterance);
}

export function cancelSpeech() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}

// Used by the Settings "test sound" diagnostic so a non-technical user can
// see in the app itself whether their browser has any voice installed at
// all, instead of needing devtools.
export function voiceCount() {
  return cachedVoices.length;
}

export function speakWithReport(text, onEvent) {
  if (!ttsSupported()) {
    onEvent("unsupported");
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.resume();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.onstart = () => onEvent("started");
  utterance.onerror = () => onEvent("error");
  utterance.onend = () => onEvent("ended");
  synth.speak(utterance);
  // If neither onstart nor onerror fires within a couple seconds, the
  // engine likely has no voice to speak with at all.
  setTimeout(() => onEvent("timeout-check"), 2500);
}
