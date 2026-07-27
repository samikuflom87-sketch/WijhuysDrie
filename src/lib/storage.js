const STORAGE_KEY = "habesha-steps-progress";

export const DAILY_GOAL_OPTIONS = { casual: 1, regular: 3, serious: 5 };
export const DEFAULT_DAILY_GOAL_LESSONS = DAILY_GOAL_OPTIONS.regular;
export const MAX_STREAK_FREEZES = 3;
export const STREAK_FREEZE_MILESTONE = 7;

export const RANKS = [
  "Curious Beginner",
  "Word Collector",
  "Phrase Finder",
  "Greeting Guru",
  "Chatty Traveler",
  "Fluent Friend",
  "Confident Speaker",
  "Tigrinya Enthusiast",
  "Language Champion",
  "Habesha Master",
];

const XP_PER_LEVEL = 100;

export function getLevelInfo(xp) {
  const levelIndex = Math.min(RANKS.length - 1, Math.floor(xp / XP_PER_LEVEL));
  const xpIntoLevel = xp - levelIndex * XP_PER_LEVEL;
  const isMaxLevel = levelIndex === RANKS.length - 1;
  return {
    level: levelIndex + 1,
    rank: RANKS[levelIndex],
    xpIntoLevel,
    xpForNextLevel: isMaxLevel ? null : XP_PER_LEVEL,
  };
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db - da) / msPerDay);
}

export function defaultProgress() {
  return {
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    todayDate: todayStr(),
    todayXp: 0,
    todayLessons: 0,
    dailyGoalLessons: DEFAULT_DAILY_GOAL_LESSONS,
    streakFreezes: 0,
    unlockedBadges: [],
    completedLessons: {}, // { [lessonId]: { crown: true } }
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    const merged = { ...defaultProgress(), ...parsed };

    // Reset today's counters if the day has rolled over.
    if (merged.todayDate !== todayStr()) {
      merged.todayDate = todayStr();
      merged.todayXp = 0;
      merged.todayLessons = 0;
    }

    // Streak decays if more than a day passed without activity (unless a
    // streak freeze covers the gap — consumed on the next lesson completion).
    if (merged.lastActiveDate) {
      const gap = daysBetween(merged.lastActiveDate, todayStr());
      if (gap > 2 || (gap === 2 && merged.streakFreezes <= 0)) {
        merged.streak = 0;
      }
    }

    return merged;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isLessonUnlocked(progress, lessons, lessonId) {
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index <= 0) return true;
  const prevLesson = lessons[index - 1];
  return Boolean(progress.completedLessons[prevLesson.id]);
}

export function isLessonCompleted(progress, lessonId) {
  return Boolean(progress.completedLessons[lessonId]);
}

export function applyLessonComplete(progress, lessonId, xpEarned) {
  const today = todayStr();
  let streak = progress.streak;
  let streakFreezes = progress.streakFreezes;

  if (progress.lastActiveDate !== today) {
    const gap = progress.lastActiveDate
      ? daysBetween(progress.lastActiveDate, today)
      : null;
    if (gap === 1) {
      streak = streak + 1;
    } else if (gap === 2 && streakFreezes > 0) {
      streak = streak + 1;
      streakFreezes -= 1;
    } else {
      streak = 1;
    }
    if (streak > 0 && streak % STREAK_FREEZE_MILESTONE === 0 && streakFreezes < MAX_STREAK_FREEZES) {
      streakFreezes += 1;
    }
  } else if (streak === 0) {
    streak = 1;
  }

  const isNewDay = progress.todayDate !== today;
  const todayXp = isNewDay ? xpEarned : progress.todayXp + xpEarned;
  const todayLessons = isNewDay ? 1 : progress.todayLessons + 1;

  return {
    ...progress,
    xp: progress.xp + xpEarned,
    streak,
    streakFreezes,
    lastActiveDate: today,
    todayDate: today,
    todayXp,
    todayLessons,
    completedLessons: {
      ...progress.completedLessons,
      [lessonId]: { crown: true },
    },
  };
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("habesha-steps-word-stats");
  localStorage.removeItem("habesha-steps-settings");
}
