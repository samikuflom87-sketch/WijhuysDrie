# Habesha Steps

A gamified web app for learning Tigrinya (Latin transliteration — no Ge'ez script). Original visual identity: warm coral, sunny yellow, and deep teal, with five original mascots (Zaki, Nardos, Bemnet, Saba, and Tesfa). One of them accompanies you through each lesson — visible during exercises, not just after you answer — and reacts to correct/wrong answers in its own voice. Built with React, Vite, Tailwind CSS, and Framer Motion. All progress is stored in `localStorage` — there is no backend.

## Installing it as an app

There's a `manifest.json` and app icons, so on a phone you can add it to the
home screen (Chrome/Safari: share/menu → "Add to Home Screen") and it opens
full-screen with its own icon, like an installed app — no offline support
yet, just the installable shell.

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
2. **Practice** — once every new word has been taught+quizzed, a full mixed round of all 10 exercise types (below) kicks in, using the complete word set — this is where hearts are on the line.
3. **Review** — anything you got wrong in practice comes back at the end and repeats until you get it right.
4. **Celebration** — XP earned, accuracy %, crown, and any newly unlocked badge.

Every button press, correct answer, and wrong answer has its own short synthesized sound (Web Audio API tones — no audio files needed), toggleable in Settings.

A **"?" hint button** is available on most exercises — it reveals the taught word's meaning and audio without ending the question, but that question earns no XP if used.

Exactly one exercise per practice round is randomly marked a **✨ golden question** — get it right and it pays extra bonus XP on top of the normal reward. It's never revealed in advance, only once you've answered it.

After a lesson's celebration screen, an optional **🎁 bonus round** offers a few extra no-hearts-at-risk questions for more XP — a low-stakes way to keep going for players who want more without any risk of losing progress.

## Exercise types

Multiple choice, reverse (Tigrinya → English), picture choice, listening (audio → pick the word), type-what-you-hear, type-the-translation (typed answers are forgiving of case/spacing/punctuation), tap-the-pairs, build-the-sentence, odd-one-out (spot the word from a different lesson's theme), and speaking practice. Each lesson only gets the types its content supports — e.g. no picture-choice without enough imaged words, no build-the-sentence without a `sentences` list, no odd-one-out for a single-lesson set.

**Speaking practice** asks the learner to record themselves saying a word, using the browser's speech recognition. No browser's speech recognizer understands Tigrinya — only mainstream languages like English — so this can only ever be a rough, approximate guess, never a real pronunciation grade. Because of that, it's labeled "beta" in the UI and is designed to never punish the learner: a "miss" here never costs a heart, never blocks progress, and never sends the word to review — the rough match only picks between two encouraging messages. Needs microphone permission and a browser with `SpeechRecognition` support (Chrome); it degrades to a friendly "not supported" message elsewhere.

## Spaced repetition & Review sessions

Every word tracks times-seen/times-correct/last-practiced in localStorage. The Home screen's **"Review words you've missed"** button (appears once you've practiced at least one word) builds a session from your lowest-accuracy, longest-untouched words across *all* lessons — skips the intro phase since you've already been taught them.

The **"📓 Mistakes"** screen (`/mistakes`) is a persistent, browsable version of that same data — every word you've ever been quizzed on, worst accuracy first, without starting a session.

## Practice Hub

`/practice` offers targeted, heart-free practice on words you've already been taught: **Listening** (audio → meaning), **Speaking** (say the word, beta), and **Vocabulary** (quick-fire multiple choice), plus a shortcut into the existing Review session. XP earns normally, but no heart is ever lost and nothing here affects streaks, badges, or lesson completion — it's purely supplementary.

## Placement test

Brand-new learners (no lesson completed yet) see a **"Take a placement test"** button on Home. It's a short multiple-choice quiz sampled across the whole course — score well and the first few lessons are marked complete for you (with a small starter-XP bonus), so you can skip straight to your actual level instead of repeating what you already know. Skipped lessons stay fully revisitable.

## Gems, Quests & Shop

- **Gems** are a lightweight currency earned from finishing lessons (with a bonus for a perfect one) and from quests — shown with a 💎 icon next to your XP.
- **Quests** (`/quests`) are simple daily and weekly goals (finish a lesson, hit an XP target, keep a streak) that pay out gems once claimed.
- The **Shop** (`/shop`) sells a few extra cosmetic mascot accessories for gems, on top of the ones that unlock from streak/vocabulary milestones.
- If your hearts run out mid-lesson, a **"Refill hearts"** option appears (gems permitting) so you can keep going instead of restarting.
- If a streak breaks, Home shows a **"Restore it for gems"** banner for as long as it stays unclaimed — dismiss it any time to make it go away for good.

None of this touches real money — it's a self-contained progress-and-reward loop, not a store.

## CEFR-style level estimate

Home and Achievements show a rough **A1–C2** label next to your level, estimated from how many words you've learned so far. It's a fun approximation for motivation, not an official proficiency certificate.

## Gamification

- XP levels with rank names (Curious Beginner → Habesha Master), shown on Home.
- Daily goal measured in **lessons/day** (Casual 1 / Regular 3 / Serious 5), set in Settings.
- Streak with an earnable streak-freeze (awarded every 7-day streak, caps at 3) that auto-covers exactly one missed day.
- A badges/achievements screen (`/achievements`) — first lesson, all lessons, streak milestones, words-taught milestones, XP milestones, earning a freeze. It also shows a GitHub-style **streak calendar** (a 70-day grid of which days you practiced).
- Each lesson node on Home shows an accuracy ring (green/yellow/coral by how well you know it), separate from its locked/unlocked/crowned state.
- Cosmetic **mascot accessories** (a party hat, glasses) unlock from milestones like streaks or words-taught, and once unlocked they render on your mascot everywhere it appears.
- A **"📖 My Words" screen** (`/words`) lists every word you've been taught across all lessons, each with a 1–3 star mastery rating based on your accuracy on it, plus its picture and a speaker button.
- Each lesson's top bar carries a subtle accent color tied to its theme (greetings, family, food, numbers, everyday), so lessons feel visually distinct from one another instead of interchangeable.
- If your browser supports the Badging API (`navigator.setAppBadge`), the installed home-screen icon shows your current streak as a small badge number — it's a no-op, invisible enhancement everywhere else.
- A **"📤 Share your progress"** button on Achievements renders your streak/level onto a shareable image (via the Web Share API where supported, otherwise a plain download) — no server round-trip.
- A first-run **"why are you learning?"** picker personalizes the Home greeting with a short blurb matching your answer.

## Settings

`/settings` — sound on/off, an optional soft ambient music bed during lessons, reduced-motion toggle (turns off mascot idle loops and confetti), a light/dark/system appearance picker, daily goal picker, and a two-step "reset all progress" (clears XP, word stats, and preferences).

## Appearance / dark mode

Theming follows the system's light/dark preference by default (`prefers-color-scheme`), or can be pinned to light or dark from Settings regardless of the OS setting. Every color in the app is a CSS custom property (`--color-brand-*`, defined in `src/index.css`), redefined per theme, so components never hardcode a light- or dark-specific color directly.

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

- `audio` — path to an `.mp3` under `public/audio/`. Every speaker button plays it if the file exists; if it's missing (the default, until you record real ones), the button instead reads the word aloud using the browser's built-in text-to-speech, so sound always works. There's no Tigrinya voice in any browser, so this is a best-effort reading of the Latin spelling, not authentic pronunciation — dropping in a real recording with the matching filename automatically takes over from the synthesized voice.
- `image` — an illustration key (e.g. `"father"`, `"water"`, `"num3"`, `"wave"`). Words with a non-null image can appear in picture-choice exercises. See `src/components/Illustration.jsx` for the full list — most concrete concepts render a Twemoji icon from `public/icons/`, while family members and numbers use the custom illustrations further down in that file. Add a new key to whichever system fits.
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
- `src/data/accessories.js` — cosmetic mascot-accessory definitions (milestone-unlocked and gem-purchasable) and unlock conditions
- `src/data/quests.js` — daily and weekly quest definitions and their gems rewards
- `src/lib/exercises.js` — generates all 10 exercise types + intro-word splitting from lesson content, plus the golden-question marker, bonus-round, placement-test, and Practice Hub focused-session generators
- `src/lib/tts.js` — browser text-to-speech fallback used by every speaker button when no real recording exists yet
- `src/lib/speech.js` — browser speech recognition + rough similarity match used by the speaking-practice exercise
- `src/lib/wordStats.js` / `src/hooks/useWordStats.js` — per-word spaced-repetition tracking + mastery-star rating
- `src/lib/storage.js` / `src/hooks/useProgress.js` — XP/gems/levels/streak/freeze/badges/accessories/daily-goal progress, active-days history, streak repair, placement results
- `src/lib/settings.js` / `src/context/SettingsContext.jsx` — sound/music/theme/reduced-motion preferences, available app-wide
- `src/lib/motion.js` — shared Framer Motion spring/easing presets used across components for a consistent feel
- `src/lib/lessonTheme.js` — maps each lesson theme to an accent color for its top bar
- `src/lib/appBadge.js` — sets/clears the installed app's home-screen icon badge (Badging API) to the current streak
- `src/lib/ambientMusic.js` — optional soft generative ambient pad (Web Audio API) played during lessons
- `src/components/Mascot.jsx` — the five original SVG mascots, with support for cosmetic accessories (hat, glasses)
- `src/components/Illustration.jsx` — picture-choice illustrations: Twemoji icons for concrete concepts, custom SVGs for family members and numbers
- `public/icons/` — the Twemoji SVG icon files referenced above
- `src/components/Flashcard.jsx` — the intro "teach before test" card
- `src/components/HintReveal.jsx` — the in-exercise "?" hint
- `src/components/ProgressRing.jsx` — per-lesson accuracy ring on Home
- `src/components/SpeakerButton.jsx` — plays a word's audio file, fails silently if missing
- `src/components/Confetti.jsx` — correct-answer particle burst (burst/rain/fountain variants)
- `src/components/StreakCalendar.jsx` — GitHub-style grid of recently active practice days
- `src/components/OnboardingGoal.jsx` — first-run "why are you learning" picker
- `src/components/ShareCard.jsx` — canvas-rendered shareable progress image + Web Share/download button
- `src/screens/Home.jsx` — learning path, streak/XP/gems/level, daily goal, Review button, links to My Words/Mistakes/Practice Hub/Shop, streak-repair banner
- `src/screens/LessonScreen.jsx` — intro → practice → review → celebration → optional bonus round flow; also drives Review and Practice Hub sessions via `isReview`/`practiceMode` props
- `src/screens/WordCollection.jsx` — every taught word across all lessons, with mastery stars
- `src/screens/Mistakes.jsx` — every practiced word, worst accuracy first
- `src/screens/PracticeHub.jsx` — Listening/Speaking/Vocabulary mode picker
- `src/screens/PlacementTest.jsx` — quick quiz that can skip a new learner ahead
- `src/screens/Quests.jsx` — daily/weekly quest progress and gems claiming
- `src/screens/Shop.jsx` — spend gems on extra mascot accessories
- `src/screens/Settings.jsx` / `src/screens/Achievements.jsx`
- `src/components/ErrorBoundary.jsx` — catches a crash anywhere in the app and shows a friendly "back to home" screen instead of a blank white page
- `public/manifest.json`, `public/icons/app-*.png`, `public/apple-touch-icon.png` — installable-app assets
- `index.html` / `src/main.jsx` — animated splash screen shown while the app's first paint loads

## Attribution

Picture-choice icons in `public/icons/` are from [Twemoji](https://twemoji.twitter.com/), licensed [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
