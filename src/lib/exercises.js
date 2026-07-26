// Exercise types generated automatically from a lesson's word + sentence
// lists. Edit `src/data/lessons.json` to add content — no code changes
// needed here.

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
    promptAudio: word.audio,
    options,
    correctText: word.english,
  };
}

function makePictureChoice(word, pool) {
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
  };
}

function makeTapPairs(words) {
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

export function generateLessonExercises(lesson) {
  const words = lesson.words;
  const sentences = lesson.sentences || [];
  const imageWords = words.filter((w) => w.image);

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

  const target = 10;
  const sentenceCount = Math.min(sentences.length, 2);
  const pairsCount = words.length >= 4 ? 1 : 0;
  const pictureCount = imageWords.length >= 3 ? 2 : 0;
  const remaining = Math.max(0, target - sentenceCount - pairsCount - pictureCount);
  const mcCount = Math.ceil(remaining / 2);
  const reverseCount = remaining - mcCount;

  const mcBucket = Array.from({ length: mcCount }, () => "mc");
  const reverseBucket = Array.from({ length: reverseCount }, () => "reverse");
  const pictureBucket = Array.from({ length: pictureCount }, () => "picture");
  const pairsBucket = Array.from({ length: pairsCount }, () => "pairs");
  const sentenceBucket = Array.from({ length: sentenceCount }, () => "sentence");

  const rotation = interleave([mcBucket, reverseBucket, pictureBucket, pairsBucket, sentenceBucket]);
  const shuffledSentences = shuffle(sentences);
  let sentenceCursor = 0;

  const exercises = rotation
    .map((type) => {
      if (type === "mc") return makeMultipleChoice(nextWord(), words);
      if (type === "reverse") return makeReverseChoice(nextWord(), words);
      if (type === "picture") return makePictureChoice(nextImageWord(), imageWords);
      if (type === "pairs") return makeTapPairs(sample(words, Math.min(4, words.length)));
      if (type === "sentence") {
        const sentence = shuffledSentences[sentenceCursor % shuffledSentences.length];
        sentenceCursor += 1;
        return makeBuildSentence(sentence, words);
      }
      return null;
    })
    .filter(Boolean);

  return exercises;
}
