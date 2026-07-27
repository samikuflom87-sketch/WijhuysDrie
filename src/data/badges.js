import { totalWordsIntroduced } from "../lib/wordStats";

// Each badge's `check` receives (progress, wordStats, lessons) and returns
// true once it should be unlocked. Badges never re-lock once earned.
export const BADGES = [
  {
    id: "first-lesson",
    name: "First Steps",
    description: "Complete your first lesson.",
    icon: "🌱",
    check: (progress) => Object.keys(progress.completedLessons).length >= 1,
  },
  {
    id: "all-lessons",
    name: "Path Finder",
    description: "Complete every lesson.",
    icon: "🗺️",
    check: (progress, wordStats, lessons) =>
      lessons.every((l) => Boolean(progress.completedLessons[l.id])),
  },
  {
    id: "streak-3",
    name: "Streak Starter",
    description: "Reach a 3-day streak.",
    icon: "🔥",
    check: (progress) => progress.streak >= 3,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Reach a 7-day streak.",
    icon: "🏆",
    check: (progress) => progress.streak >= 7,
  },
  {
    id: "words-25",
    name: "Vocabulary Builder",
    description: "Get taught 25 words.",
    icon: "📚",
    check: (progress, wordStats) => totalWordsIntroduced(wordStats) >= 25,
  },
  {
    id: "words-50",
    name: "Century Club",
    description: "Get taught 50 words.",
    icon: "💯",
    check: (progress, wordStats) => totalWordsIntroduced(wordStats) >= 50,
  },
  {
    id: "xp-100",
    name: "Rising Star",
    description: "Earn 100 XP.",
    icon: "⭐",
    check: (progress) => progress.xp >= 100,
  },
  {
    id: "xp-500",
    name: "XP Machine",
    description: "Earn 500 XP.",
    icon: "🚀",
    check: (progress) => progress.xp >= 500,
  },
  {
    id: "freeze-earned",
    name: "Cool Under Pressure",
    description: "Earn a streak freeze.",
    icon: "🧊",
    check: (progress) => progress.streakFreezes >= 1,
  },
];

// Returns { progress: updated-if-needed, newlyUnlocked: [badge, ...] }
export function checkBadges(progress, wordStats, lessons) {
  const newlyUnlocked = [];
  for (const badge of BADGES) {
    if (progress.unlockedBadges.includes(badge.id)) continue;
    if (badge.check(progress, wordStats, lessons)) {
      newlyUnlocked.push(badge);
    }
  }
  if (newlyUnlocked.length === 0) {
    return { progress, newlyUnlocked };
  }
  return {
    progress: {
      ...progress,
      unlockedBadges: [...progress.unlockedBadges, ...newlyUnlocked.map((b) => b.id)],
    },
    newlyUnlocked,
  };
}
