// Browser speech recognition for the "speaking practice" exercise. No
// browser's speech recognizer understands Tigrinya — only mainstream
// languages like English are supported — so this can only ever be a rough,
// approximate check, never a real pronunciation judge. It's used purely to
// pick an encouraging message; it never costs a heart or blocks progress,
// because a wrong guess here says nothing reliable about whether the
// learner actually said the word correctly.
export function speechRecognitionSupported() {
  return typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createRecognizer(lang = "en-US") {
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!SR) return null;
  const recognizer = new SR();
  recognizer.lang = lang;
  recognizer.continuous = false;
  recognizer.interimResults = false;
  recognizer.maxAlternatives = 1;
  return recognizer;
}

function normalize(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[?!.,;:]+/g, "")
    .replace(/\s+/g, "");
}

function levenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dist = Array.from({ length: rows }, (_, i) => [i, ...Array(cols - 1).fill(0)]);
  for (let j = 0; j < cols; j++) dist[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dist[i][j] = Math.min(dist[i - 1][j] + 1, dist[i][j - 1] + 1, dist[i - 1][j - 1] + cost);
    }
  }
  return dist[rows - 1][cols - 1];
}

// Generous similarity threshold since an English recognizer hearing
// Tigrinya sounds will rarely produce an exact spelling match.
export function roughMatch(transcript, target) {
  const a = normalize(transcript);
  const b = normalize(target);
  if (!a || !b) return false;
  const dist = levenshtein(a, b);
  const similarity = 1 - dist / Math.max(a.length, b.length);
  return similarity >= 0.4;
}
