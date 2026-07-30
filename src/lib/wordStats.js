// Per-word spaced-repetition stats, keyed by a stable id derived from the
// lesson + tigrinya text. Tracks what's been taught, how often it's been
// seen, and how often it's been answered correctly.

const STORAGE_KEY = "habesha-steps-word-stats";

export function wordId(lessonId, tigrinya) {
  return `${lessonId}::${tigrinya}`;
}

export function loadWordStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveWordStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function defaultEntry() {
  return { introduced: false, seen: 0, correct: 0, lastPracticedAt: null };
}

export function isIntroduced(stats, id) {
  return Boolean(stats[id]?.introduced);
}

export function markIntroduced(stats, id) {
  const entry = stats[id] || defaultEntry();
  return { ...stats, [id]: { ...entry, introduced: true } };
}

export function recordAttempt(stats, id, wasCorrect) {
  const entry = stats[id] || defaultEntry();
  return {
    ...stats,
    [id]: {
      ...entry,
      introduced: true,
      seen: entry.seen + 1,
      correct: entry.correct + (wasCorrect ? 1 : 0),
      lastPracticedAt: Date.now(),
    },
  };
}

export function accuracyFor(stats, id) {
  const entry = stats[id];
  if (!entry || entry.seen === 0) return null;
  return entry.correct / entry.seen;
}

// Average accuracy across a lesson's words that have been seen at least
// once. Returns null if nothing in the lesson has been practiced yet.
export function lessonAccuracy(stats, lesson) {
  const seen = lesson.words
    .map((w) => accuracyFor(stats, wordId(lesson.id, w.tigrinya)))
    .filter((a) => a !== null);
  if (seen.length === 0) return null;
  return seen.reduce((sum, a) => sum + a, 0) / seen.length;
}

export function totalWordsIntroduced(stats) {
  return Object.values(stats).filter((e) => e.introduced).length;
}

// A rough, non-certified CEFR-style label based on words learned so far —
// purely a fun progress indicator, not a real proficiency assessment.
const CEFR_THRESHOLDS = [
  { level: "A1", min: 0 },
  { level: "A2", min: 15 },
  { level: "B1", min: 30 },
  { level: "B2", min: 50 },
  { level: "C1", min: 75 },
  { level: "C2", min: 100 },
];

export function estimatedCefrLevel(wordsKnown) {
  let level = CEFR_THRESHOLDS[0].level;
  for (const t of CEFR_THRESHOLDS) {
    if (wordsKnown >= t.min) level = t.level;
  }
  return level;
}

// 1-3 star mastery rating for the word collection screen: 0 if not yet
// introduced, 1 for a freshly-taught or still-shaky word, up to 3 once
// accuracy and repetition both show it's stuck.
export function masteryStars(stats, id) {
  const entry = stats[id];
  if (!entry || !entry.introduced) return 0;
  if (entry.seen === 0) return 1;
  const acc = entry.correct / entry.seen;
  if (acc >= 0.85 && entry.seen >= 3) return 3;
  if (acc >= 0.6) return 2;
  return 1;
}

// Every word ever introduced, across all lessons, with its owning lesson id
// attached — the pool Practice Hub's focused sessions sample from.
export function allIntroducedWords(stats, lessons) {
  const out = [];
  for (const lesson of lessons) {
    for (const word of lesson.words) {
      const id = wordId(lesson.id, word.tigrinya);
      if (stats[id]?.introduced) out.push({ ...word, lessonId: lesson.id });
    }
  }
  return out;
}

// Builds a review session's word list across all lessons, prioritizing
// words with the lowest accuracy and the longest time since last practiced.
export function pickReviewWords(stats, lessons, limit = 8) {
  const candidates = [];
  for (const lesson of lessons) {
    for (const word of lesson.words) {
      const id = wordId(lesson.id, word.tigrinya);
      const entry = stats[id];
      if (!entry || !entry.introduced || entry.seen === 0) continue;
      const accuracy = entry.correct / entry.seen;
      candidates.push({
        ...word,
        lessonId: lesson.id,
        _accuracy: accuracy,
        _lastPracticedAt: entry.lastPracticedAt || 0,
      });
    }
  }
  candidates.sort((a, b) => {
    if (a._accuracy !== b._accuracy) return a._accuracy - b._accuracy;
    return a._lastPracticedAt - b._lastPracticedAt;
  });
  return candidates.slice(0, limit);
}
