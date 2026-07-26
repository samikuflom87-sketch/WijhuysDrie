# Habesha Steps

A gamified web app for learning Tigrinya (Latin transliteration — no Ge'ez script). Original visual identity: warm coral, sunny yellow, and deep teal, with three original mascots (Zaki, Nardos, and Bemnet). Built with React, Vite, Tailwind CSS, and Framer Motion. All progress is stored in `localStorage` — there is no backend.

## Running it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`). For a phone-sized view, open your browser's device toolbar/responsive mode, or just resize the window narrow.

To build for production:

```bash
npm run build
npm run preview
```

## Adding content

All lesson content lives in `src/data/lessons.json`. Each lesson has a title, a `words` list, and an optional `sentences` list:

```json
{
  "lessons": [
    {
      "id": 1,
      "title": "Greetings",
      "theme": "greetings",
      "words": [
        { "tigrinya": "selam", "english": "hello", "audio": "/audio/selam.mp3", "image": null, "verify": false }
      ],
      "sentences": [
        { "tigrinya": "selam, kemey ilka?", "english": "hello, how are you?", "audio": "/audio/s-selam-kemey.mp3", "verify": true }
      ]
    }
  ]
}
```

Field notes:

- `audio` — path to an `.mp3` under `public/audio/`. Each word/sentence gets a speaker button that plays it. Missing files fail silently (no crash) until you record and drop in the real files.
- `image` — an illustration key (e.g. `"father"`, `"water"`, `"num3"`). Words with a non-null image can appear in **picture-choice** exercises. See `src/components/Illustration.jsx` for the full list of supported keys — add a new `case` there if you introduce a new key.
- `verify` — marks a translation that hasn't been confirmed by a native speaker. The app never edits or removes this flag; it's for your own tracking.
- `sentences` — used to auto-generate **build-the-sentence** exercises. Leave the array empty (`[]`) to skip that exercise type for a lesson.

Add new lessons/words/sentences to this file and the app automatically regenerates all five exercise types (multiple choice, reverse choice, picture choice, tap-the-pairs, build-the-sentence) — no code changes needed. A lesson only gets picture-choice exercises if it has at least 3 words with images, and only gets build-the-sentence exercises if `sentences` is non-empty. Lessons unlock in order (`id` order); each `id` must be unique.

## Adding audio recordings

Drop `.mp3` files into `public/audio/`, named exactly as referenced by each `audio` field (e.g. `selam.mp3` for `/audio/selam.mp3`). No code changes needed — the speaker buttons will start working automatically.

## Project structure

- `src/data/lessons.json` — lesson/word/sentence content (edit this to add vocabulary)
- `src/data/mascots.js` — Zaki, Nardos, and Bemnet's personalities and message banks
- `src/lib/exercises.js` — generates all 5 exercise types from lesson content
- `src/lib/storage.js` / `src/hooks/useProgress.js` — localStorage-backed XP/streak/crown progress
- `src/components/Mascot.jsx` — the three original SVG mascots
- `src/components/Illustration.jsx` — original SVG pictograms for picture-choice exercises
- `src/components/SpeakerButton.jsx` — plays a word's audio file, fails silently if missing
- `src/components/Confetti.jsx` — correct-answer particle burst
- `src/screens/Home.jsx` — the learning path (lesson nodes, streak, XP, daily goal, mascot greeting)
- `src/screens/LessonScreen.jsx` — exercise flow, hearts, end-of-lesson celebration
