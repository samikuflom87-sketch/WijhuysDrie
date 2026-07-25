# Tigrinya Learn

A Duolingo-style web app for learning Tigrinya (Latin transliteration). Built with React, Vite, Tailwind CSS, and Framer Motion. All progress is stored in `localStorage` — there is no backend.

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

All lesson content lives in `src/data/lessons.json`. Each lesson is a title plus a list of word pairs:

```json
{
  "lessons": [
    {
      "id": 1,
      "title": "Basics 1",
      "words": [
        { "tigrinya": "selam", "english": "hello" }
      ]
    }
  ]
}
```

Add new lessons or words to this file and the app automatically generates multiple-choice, reverse multiple-choice, tap-the-pairs, and build-the-sentence exercises from it — no other code changes needed. Lessons unlock in order (`id` order); each `id` must be unique.

## Project structure

- `src/data/lessons.json` — lesson/word content (edit this to add vocabulary)
- `src/lib/exercises.js` — generates exercises from the word list
- `src/lib/storage.js` / `src/hooks/useProgress.js` — localStorage-backed XP/streak/crown progress
- `src/screens/Home.jsx` — the learning path (lesson bubbles, streak, XP, daily goal)
- `src/screens/LessonScreen.jsx` — exercise flow, hearts, end-of-lesson summary
- `src/components/` — Button, Mascot, ProgressBar, Hearts, exercise UIs, etc.
