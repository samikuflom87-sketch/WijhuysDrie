// Exercise types generated automatically from a lesson's word + sentence
// lists. Edit `src/data/lessons.json` to add content — no code changes
// needed here.

import { wordId } from "./wordStats";

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

// Review sessions mix words from multiple original lessons; each word
// carries its own `lessonId` in that case so stats land on the right entry.
function owningLessonId(word, fallbackLessonId) {
  return word.lessonId ?? fallbackLessonId;
}

// Strips trailing punctuation/whitespace and lowercases, so typed answers
// aren't marked wrong over "Selam" vs "selam." vs "selam  ".
export function normalizeAnswer(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[?!.,;:]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Splits a lesson's words into ones the learner has never been taught yet
// (need an intro flashcard) vs ones already introduced in a prior session.
export function splitIntroWords(lesson, wordStats) {
  const newWords = [];
  for (const word of lesson.words) {
    const id = wordId(lesson.id, word.tigrinya);
    if (!wordStats[id]?.introduced) newWords.push(word);
  }
  return newWords;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const TEACH_GROUP_SIZE = 2;

// Builds an interleaved "teach a couple, quiz on them" sequence instead of
// front-loading every flashcard before any exercise: teach word 1+2, quiz
// on them, teach word 3+4, quiz, and so on. Distractors for the mini-quiz
// can be sampled from the whole lesson (not just taught-so-far words)
// since they only ever appear as wrong answers, never the tested word.
export function buildTeachingSequence(lesson, introWords) {
  const groups = chunk(introWords, TEACH_GROUP_SIZE);
  const sequence = [];
  for (const group of groups) {
    for (const word of group) {
      sequence.push({ kind: "teach", word });
    }
    for (const word of group) {
      const exercise =
        Math.random() < 0.5
          ? makeMultipleChoice(lesson.id, word, lesson.words)
          : makeReverseChoice(lesson.id, word, lesson.words);
      sequence.push({ kind: "quiz", exercise });
    }
  }
  return sequence;
}

function makeMultipleChoice(lessonId, word, pool) {
  const distractorPool = pool.filter((w) => w.tigrinya !== word.tigrinya);
  const distractors = sample(distractorPool, Math.min(3, distractorPool.length));
  const options = shuffle([word, ...distractors]).map((w) => ({
    id: nextId("opt"),
    text: w.tigrinya,
    audio: w.audio,
    isCorrect: w.tigrinya === word.tigrinya,
  }));
  return {
    id: nextId("ex"),
    type: "multiple-choice",
    promptLabel: "Which one means",
    promptText: word.english,
    options,
    correctText: word.tigrinya,
    hintWord: word,
    wordIds: [wordId(owningLessonId(word, lessonId), word.tigrinya)],
  };
}

function makeReverseChoice(lessonId, word, pool) {
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
    promptAudio: word.audio,
    options,
    correctText: word.english,
    hintWord: word,
    wordIds: [wordId(owningLessonId(word, lessonId), word.tigrinya)],
  };
}

function makePictureChoice(lessonId, word, pool) {
  const distractorPool = pool.filter((w) => w.tigrinya !== word.tigrinya);
  const distractors = sample(distractorPool, Math.min(3, distractorPool.length));
  const options = shuffle([word, ...distractors]).map((w) => ({
    id: nextId("opt"),
    text: w.tigrinya,
    audio: w.audio,
    isCorrect: w.tigrinya === word.tigrinya,
  }));
  return {
    id: nextId("ex"),
    type: "picture-choice",
    promptLabel: "Which word matches this picture?",
    promptImage: word.image,
    options,
    correctText: word.tigrinya,
    hintWord: word,
    wordIds: [wordId(owningLessonId(word, lessonId), word.tigrinya)],
  };
}

function makeListening(lessonId, word, pool) {
  const distractorPool = pool.filter((w) => w.tigrinya !== word.tigrinya);
  const distractors = sample(distractorPool, Math.min(3, distractorPool.length));
  const options = shuffle([word, ...distractors]).map((w) => ({
    id: nextId("opt"),
    text: w.tigrinya,
    audio: w.audio,
    isCorrect: w.tigrinya === word.tigrinya,
  }));
  return {
    id: nextId("ex"),
    type: "listening",
    promptLabel: "Listen, then choose the word you hear",
    promptAudio: word.audio,
    options,
    correctText: word.tigrinya,
    hintWord: word,
    wordIds: [wordId(owningLessonId(word, lessonId), word.tigrinya)],
  };
}

function makeTypeAnswer(lessonId, word, mode) {
  return {
    id: nextId("ex"),
    type: "type-answer",
    mode, // 'listen' | 'translate'
    promptLabel: mode === "listen" ? "Type what you hear" : "Type the Tigrinya translation",
    promptText: mode === "translate" ? word.english : null,
    promptAudio: mode === "listen" ? word.audio : null,
    correctAnswer: word.tigrinya,
    correctText: word.tigrinya,
    hintWord: word,
    wordIds: [wordId(owningLessonId(word, lessonId), word.tigrinya)],
  };
}

function makeSpeakAnswer(lessonId, word) {
  return {
    id: nextId("ex"),
    type: "speak-answer",
    promptLabel: "Say this word in Tigrinya",
    promptText: word.english,
    correctAnswer: word.tigrinya,
    correctText: word.tigrinya,
    hintWord: word,
    wordIds: [wordId(owningLessonId(word, lessonId), word.tigrinya)],
  };
}

function makeTapPairs(lessonId, words) {
  const pairs = words.map((w) => ({
    id: nextId("pair"),
    tigrinya: w.tigrinya,
    english: w.english,
    audio: w.audio,
  }));
  const left = shuffle(
    pairs.map((p) => ({ id: nextId("tileL"), pairId: p.id, text: p.tigrinya, audio: p.audio })),
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
    hintWord: null,
    wordIds: words.map((w) => wordId(owningLessonId(w, lessonId), w.tigrinya)),
  };
}

function makeBuildSentence(sentence, words) {
  const correctTokens = sentence.tigrinya.split(" ").filter(Boolean);
  const englishPrompt = capitalize(sentence.english);
  const wordPool = words.map((w) => w.tigrinya).filter((t) => !correctTokens.includes(t));
  const distractors = sample(wordPool, Math.min(2, wordPool.length));
  const tiles = shuffle([...correctTokens, ...distractors]).map((text) => ({
    id: nextId("tile"),
    text,
  }));
  return {
    id: nextId("ex"),
    type: "build-sentence",
    englishPrompt,
    correctTokens,
    correctText: sentence.tigrinya,
    sentenceAudio: sentence.audio,
    tiles,
    hintWord: null,
    wordIds: [],
  };
}

function makeOddOneOut(lesson, allLessons) {
  const otherLessons = allLessons.filter(
    (l) => l.id !== lesson.id && l.theme && l.theme !== lesson.theme && l.words.length > 0,
  );
  if (otherLessons.length === 0) return null;

  const otherLesson = otherLessons[Math.floor(Math.random() * otherLessons.length)];
  const oddWord = sample(otherLesson.words, 1)[0];
  const belongWords = sample(lesson.words, Math.min(3, lesson.words.length));
  if (belongWords.length < 3) return null;

  const options = shuffle([
    ...belongWords.map((w) => ({ word: w, isOdd: false })),
    { word: oddWord, isOdd: true },
  ]).map(({ word, isOdd }) => ({
    id: nextId("opt"),
    text: word.tigrinya,
    audio: word.audio,
    isCorrect: isOdd,
  }));

  return {
    id: nextId("ex"),
    type: "odd-one-out",
    promptLabel: "Which one doesn't belong?",
    options,
    correctText: oddWord.tigrinya,
    hintWord: oddWord,
    wordIds: [wordId(otherLesson.id, oddWord.tigrinya)],
  };
}

function interleave(buckets) {
  const result = [];
  let added = true;
  while (added) {
    added = false;
    for (const bucket of buckets) {
      if (bucket.length) {
        result.push(bucket.shift());
        added = true;
      }
    }
  }
  return result;
}

// `lesson` is the lesson being practiced; `allLessons` is the full lesson
// list (needed to source an "odd one out" from a different theme). Every
// word in `lesson.words` is assumed already taught by this point.
export function generateLessonExercises(lesson, allLessons = [lesson]) {
  const words = lesson.words;
  if (!words || words.length === 0) return [];
  const sentences = lesson.sentences || [];
  const imageWords = words.filter((w) => w.image);
  const audioWords = words.filter((w) => w.audio);

  const shuffledWords = shuffle(words);
  let wordCursor = 0;
  const nextWord = () => {
    const word = shuffledWords[wordCursor % shuffledWords.length];
    wordCursor += 1;
    return word;
  };

  const shuffledImageWords = shuffle(imageWords);
  let imageCursor = 0;
  const nextImageWord = () => {
    const word = shuffledImageWords[imageCursor % shuffledImageWords.length];
    imageCursor += 1;
    return word;
  };

  const shuffledAudioWords = shuffle(audioWords);
  let audioCursor = 0;
  const nextAudioWord = () => {
    const word = shuffledAudioWords[audioCursor % shuffledAudioWords.length];
    audioCursor += 1;
    return word;
  };

  const canOddOneOut = Boolean(
    lesson.theme &&
      allLessons.some((l) => l.id !== lesson.id && l.theme && l.theme !== lesson.theme) &&
      words.length >= 3,
  );

  const counts = {
    mc: 2,
    reverse: 2,
    typeTranslate: 2,
    picture: imageWords.length >= 3 ? 2 : 0,
    listening: audioWords.length >= 3 ? 2 : 0,
    typeListen: audioWords.length >= 1 ? 1 : 0,
    pairs: words.length >= 4 ? 1 : 0,
    sentence: Math.min(sentences.length, 2),
    oddOneOut: canOddOneOut ? 1 : 0,
    speak: words.length >= 1 ? 1 : 0,
  };

  const buckets = [
    Array.from({ length: counts.mc }, () => "mc"),
    Array.from({ length: counts.reverse }, () => "reverse"),
    Array.from({ length: counts.picture }, () => "picture"),
    Array.from({ length: counts.listening }, () => "listening"),
    Array.from({ length: counts.typeTranslate }, () => "typeTranslate"),
    Array.from({ length: counts.typeListen }, () => "typeListen"),
    Array.from({ length: counts.pairs }, () => "pairs"),
    Array.from({ length: counts.sentence }, () => "sentence"),
    Array.from({ length: counts.oddOneOut }, () => "oddOneOut"),
    Array.from({ length: counts.speak }, () => "speak"),
  ];

  const rotation = interleave(buckets);
  const shuffledSentences = shuffle(sentences);
  let sentenceCursor = 0;

  const exercises = rotation
    .map((type) => {
      if (type === "mc") return makeMultipleChoice(lesson.id, nextWord(), words);
      if (type === "reverse") return makeReverseChoice(lesson.id, nextWord(), words);
      if (type === "picture") return makePictureChoice(lesson.id, nextImageWord(), imageWords);
      if (type === "listening") return makeListening(lesson.id, nextAudioWord(), audioWords);
      if (type === "typeTranslate") return makeTypeAnswer(lesson.id, nextWord(), "translate");
      if (type === "typeListen") return makeTypeAnswer(lesson.id, nextAudioWord(), "listen");
      if (type === "pairs") return makeTapPairs(lesson.id, sample(words, Math.min(4, words.length)));
      if (type === "sentence") {
        const sentence = shuffledSentences[sentenceCursor % shuffledSentences.length];
        sentenceCursor += 1;
        return makeBuildSentence(sentence, words);
      }
      if (type === "oddOneOut") return makeOddOneOut(lesson, allLessons);
      if (type === "speak") return makeSpeakAnswer(lesson.id, nextWord());
      return null;
    })
    .filter(Boolean);

  markOneGoldenQuestion(exercises);

  return exercises;
}

// Marks exactly one choice-type exercise per practice round as a "golden"
// question — its correct option pays out bonus XP, a small unpredictable
// reward baked into a normal round rather than a separate mini-game.
function markOneGoldenQuestion(exercises) {
  const eligible = exercises.filter((ex) => Array.isArray(ex.options));
  if (eligible.length === 0) return;
  const chosen = eligible[Math.floor(Math.random() * eligible.length)];
  chosen.isGoldenQuestion = true;
}

// A short, low-stakes set of extra multiple-choice questions offered after
// a lesson finishes — a "want to keep going?" bonus, never required.
export function makeBonusRound(lesson, count = 3) {
  const words = sample(lesson.words, Math.min(count, lesson.words.length));
  return words.map((w) => makeMultipleChoice(lesson.id, w, lesson.words));
}

// A quick multiple-choice quiz sampled evenly across the whole course, from
// earliest to latest lesson, so a brand-new learner's score reflects how
// far they can skip ahead — the same idea as a placement test.
export function makePlacementQuestions(lessons, count = 8) {
  const eligible = lessons.filter((l) => l.words && l.words.length >= 4);
  if (eligible.length === 0) return [];
  const picks = [];
  for (let i = 0; i < count; i++) {
    const lessonIndex = Math.min(eligible.length - 1, Math.floor((i / count) * eligible.length));
    const lesson = eligible[lessonIndex];
    const word = sample(lesson.words, 1)[0];
    picks.push(makeMultipleChoice(lesson.id, word, lesson.words));
  }
  return picks;
}

// Builds a focused single-type practice session from a pool of already-
// introduced words gathered from across every lesson — the engine behind
// Practice Hub's Listening/Speaking/Vocabulary modes.
export function makeFocusedSession(words, mode, count = 10) {
  const eligible = mode === "listening" ? words.filter((w) => w.audio) : words;
  if (eligible.length === 0) return [];
  const pool = shuffle(eligible);
  const picks = Array.from({ length: count }, (_, i) => pool[i % pool.length]);
  if (mode === "listening") return picks.map((w) => makeListening(w.lessonId, w, eligible));
  if (mode === "speaking") return picks.map((w) => makeSpeakAnswer(w.lessonId, w));
  if (mode === "vocabulary") {
    return picks.map((w, i) =>
      i % 2 === 0 ? makeMultipleChoice(w.lessonId, w, eligible) : makeReverseChoice(w.lessonId, w, eligible),
    );
  }
  return [];
}
