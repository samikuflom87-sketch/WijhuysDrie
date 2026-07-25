// Exercise types generated automatically from a lesson's word list.
// Edit `src/data/lessons.json` to add content — no code changes needed.

let uid = 0;
function nextId(prefix) {
  uid += 1;
  return `${prefix}-${uid}`;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function makeMultipleChoice(word, pool) {
  const distractorPool = pool.filter((w) => w.tigrinya !== word.tigrinya);
  const distractors = sample(distractorPool, Math.min(3, distractorPool.length));
  const options = shuffle([word, ...distractors]).map((w) => ({
    id: nextId("opt"),
    text: w.tigrinya,
    isCorrect: w.tigrinya === word.tigrinya,
  }));
  return {
    id: nextId("ex"),
    type: "multiple-choice",
    promptLabel: "Which one means",
    promptText: word.english,
    options,
    correctText: word.tigrinya,
  };
}

function makeReverseChoice(word, pool) {
  const distractorPool = pool.filter((w) => w.english !== word.english);
  const distractors = sample(distractorPool, Math.min(3, distractorPool.length));
  const options = shuffle([word, ...distractors]).map((w) => ({
    id: nextId("opt"),
    text: w.english,
    isCorrect: w.english === word.english,
  }));
  return {
    id: nextId("ex"),
    type: "reverse-choice",
    promptLabel: "Select the meaning of",
    promptText: word.tigrinya,
    options,
    correctText: word.english,
  };
}

function makeTapPairs(words) {
  const pairs = words.map((w) => ({
    id: nextId("pair"),
    tigrinya: w.tigrinya,
    english: w.english,
  }));
  const left = shuffle(
    pairs.map((p) => ({ id: nextId("tileL"), pairId: p.id, text: p.tigrinya })),
  );
  const right = shuffle(
    pairs.map((p) => ({ id: nextId("tileR"), pairId: p.id, text: p.english })),
  );
  return {
    id: nextId("ex"),
    type: "tap-pairs",
    pairs,
    left,
    right,
  };
}

function makeBuildSentence(words, pool) {
  const correctTokens = words.map((w) => w.tigrinya);
  const englishPrompt = capitalize(words.map((w) => w.english).join(" "));
  const distractorPool = pool.filter((w) => !words.includes(w));
  const distractors = sample(distractorPool, Math.min(2, distractorPool.length)).map(
    (w) => w.tigrinya,
  );
  const tiles = shuffle([...correctTokens, ...distractors]).map((text) => ({
    id: nextId("tile"),
    text,
  }));
  return {
    id: nextId("ex"),
    type: "build-sentence",
    englishPrompt,
    correctTokens,
    tiles,
  };
}

const EXERCISE_ROTATION = [
  "mc",
  "reverse",
  "mc",
  "reverse",
  "pairs",
  "mc",
  "reverse",
  "sentence",
  "reverse",
  "sentence",
];

export function generateLessonExercises(lesson) {
  const words = lesson.words;
  const pool = words;
  const shuffledWords = shuffle(words);
  let cursor = 0;
  const nextWord = () => {
    const word = shuffledWords[cursor % shuffledWords.length];
    cursor += 1;
    return word;
  };

  const exercises = EXERCISE_ROTATION.map((type) => {
    if (type === "mc") return makeMultipleChoice(nextWord(), pool);
    if (type === "reverse") return makeReverseChoice(nextWord(), pool);
    if (type === "pairs")
      return makeTapPairs(sample(words, Math.min(4, words.length)));
    if (type === "sentence")
      return makeBuildSentence(sample(words, Math.min(2, words.length)), pool);
    return null;
  }).filter(Boolean);

  return exercises;
}
