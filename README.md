# Habesha Steps

A gamified web app for learning Tigrinya (Latin transliteration — no Ge'ez script). Original visual identity: warm coral, sunny yellow, and deep teal, with five original mascots (Zaki, Nardos, Bemnet, Saba, and Tesfa). One of them accompanies you through each lesson — visible during exercises, not just after you answer — and reacts to correct/wrong answers in its own voice. Built with React, Vite, Tailwind CSS, and Framer Motion. All progress is stored in `localStorage` — there is no backend.

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

## How a lesson works

1. **Teach, interleaved** — new words are taught two at a time (flashcard: Tigrinya, English, picture, audio, optional note), then immediately quizzed on those same two before the next pair is taught. These mini-quizzes are low-stakes: wrong answers show the right one but never cost a heart. Already-known words (tracked per-word in localStorage) skip straight to full practice.
2. **Practice** — once every new word has been taught+quizzed, a full mixed round of all 9 exercise types (below) kicks in, using the complete word set — this is where hearts are on the line.
3. **Review** — anything you got wrong in practice comes back at the end and repeats until you get it right.
4. **Celebration** — XP earned, accuracy %, crown, and any newly unlocked badge.

Every button press, correct answer, and wrong answer has its own short synthesized sound (Web Audio API tones — no audio files needed), toggleable in Settings.

A **"?" hint button** is available on most exercises — it reveals the taught word's meaning and audio without ending the question, but that question earns no XP if used.

## Exercise types

Multiple choice, reverse (Tigrinya → English), picture choice, listening (audio → pick the word), type-what-you-hear, type-the-translation (typed answers are forgiving of case/spacing/punctuation), tap-the-pairs, build-the-sentence, and odd-one-out (spot the word from a different lesson's theme). Each lesson only gets the types its content supports — e.g. no picture-choice without enough imaged words, no build-the-sentence without a `sentences` list, no odd-one-out for a single-lesson set.

## Spaced repetition & Review sessions

Every word tracks times-seen/times-correct/last-practiced in localStorage. The Home screen's **"Review words you've missed"** button (appears once you've practiced at least one word) builds a session from your lowest-accuracy, longest-untouched words across *all* lessons — skips the intro phase since you've already been taught them.

## Gamification

- XP levels with rank names (Curious Beginner → Habesha Master), shown on Home.
- Daily goal measured in **lessons/day** (Casual 1 / Regular 3 / Serious 5), set in Settings.
- Streak with an earnable streak-freeze (awarded every 7-day streak, caps at 3) that auto-covers exactly one missed day.
- A badges/achievements screen (`/achievements`) — first lesson, all lessons, streak milestones, words-taught milestones, XP milestones, earning a freeze.
- Each lesson node on Home shows an accuracy ring (green/yellow/coral by how well you know it), separate from its locked/unlocked/crowned state.

## Settings

`/settings` — sound on/off, reduced-motion toggle (turns off mascot idle loops and confetti), daily goal picker, and a two-step "reset all progress" (clears XP, word stats, and preferences).

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
        { "tigrinya": "selam", "english": "hello", "audio": "/audio/selam.mp3", "image": "wave", "verify": false, "note": "A friendly all-purpose greeting." }
      ],
      "sentences": [
        { "tigrinya": "selam, kemey ilka?", "english": "hello, how are you?", "audio": "/audio/s-selam-kemey.mp3", "verify": true }
      ]
    }
  ]
}
```

Field notes:

- `audio` — path to an `.mp3` under `public/audio/`. Every speaker button plays it; missing files fail silently (no crash) until you record and drop in the real files.
- `image` — an illustration key (e.g. `"father"`, `"water"`, `"num3"`, `"wave"`). Words with a non-null image can appear in picture-choice exercises. See `src/components/Illustration.jsx` for the full list — add a new `case` there for a new key.
- `note` — optional short usage tip shown on the word's intro flashcard. Omit it if you don't need one.
- `verify` — marks a translation not yet confirmed by a native speaker. The app never edits, removes, or "corrects" this flag or the surrounding text — it's purely for your own tracking.
- `sentences` — used to auto-generate build-the-sentence exercises. Leave the array empty (`[]`) to skip that exercise type for a lesson.

Add new lessons/words/sentences and everything — intro flashcards, all 9 exercise types, review sessions, spaced repetition — regenerates automatically. No code changes needed. Lessons unlock in order (`id` order); each `id` must be unique.

## Adding audio recordings

Drop `.mp3` files into `public/audio/`, named exactly as referenced by each `audio` field (e.g. `selam.mp3` for `/audio/selam.mp3`). No code changes needed — the speaker buttons start working automatically.

## Project structure

- `src/data/lessons.json` — lesson/word/sentence content (edit this to add vocabulary)
- `src/data/mascots.js` — the five mascots' personalities and message banks
- `src/data/badges.js` — achievement definitions and unlock conditions
- `src/lib/exercises.js` — generates all 9 exercise types + intro-word splitting from lesson content
- `src/lib/wordStats.js` / `src/hooks/useWordStats.js` — per-word spaced-repetition tracking
- `src/lib/storage.js` / `src/hooks/useProgress.js` — XP/levels/streak/freeze/badges/daily-goal progress
- `src/lib/settings.js` / `src/context/SettingsContext.jsx` — sound/reduced-motion preferences, available app-wide
- `src/components/Mascot.jsx` — the five original SVG mascots
- `src/components/Illustration.jsx` — original SVG pictograms for picture-choice exercises
- `src/components/Flashcard.jsx` — the intro "teach before test" card
- `src/components/HintReveal.jsx` — the in-exercise "?" hint
- `src/components/ProgressRing.jsx` — per-lesson accuracy ring on Home
- `src/components/SpeakerButton.jsx` — plays a word's audio file, fails silently if missing
- `src/components/Confetti.jsx` — correct-answer particle burst
- `src/screens/Home.jsx` — learning path, streak/XP/level, daily goal, Review button
- `src/screens/LessonScreen.jsx` — intro → practice → review → celebration flow
- `src/screens/Settings.jsx` / `src/screens/Achievements.jsx`
