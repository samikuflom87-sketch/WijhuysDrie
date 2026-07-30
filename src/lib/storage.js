const STORAGE_KEY = "habesha-steps-progress";

export const DAILY_GOAL_OPTIONS = { casual: 1, regular: 3, serious: 5 };
export const DEFAULT_DAILY_GOAL_LESSONS = DAILY_GOAL_OPTIONS.regular;
export const MAX_STREAK_FREEZES = 3;
export const STREAK_FREEZE_MILESTONE = 7;

// Gems: a lightweight currency earned from lessons and quests, spent on
// streak repair, mid-lesson heart refills, and cosmetic shop items.
export const GEMS_PER_LESSON = 5;
export const GEMS_PERFECT_BONUS = 5;
export const STREAK_REPAIR_COST = 30;
export const HEART_REFILL_COST = 20;

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

// How many days of history the streak calendar keeps around.
const ACTIVE_DATES_HISTORY_DAYS = 180;

// Monday of the current week, as an ISO date string — the reset point for
// weekly quest counters.
function weekStartStr() {
  const now = new Date();
  const diffToMonday = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  return monday.toISOString().slice(0, 10);
}

export function defaultProgress() {
  return {
    xp: 0,
    gems: 0,
    streak: 0,
    previousStreak: 0, // last streak count before it broke — repairable with gems
    streakLostDate: null,
    lastActiveDate: null,
    todayDate: todayStr(),
    todayXp: 0,
    todayLessons: 0,
    todayPerfectLessons: 0,
    weekStartDate: weekStartStr(),
    weeklyXp: 0,
    weeklyLessons: 0,
    dailyQuestClaimed: [],
    weeklyQuestClaimed: [],
    dailyGoalLessons: DEFAULT_DAILY_GOAL_LESSONS,
    streakFreezes: 0,
    unlockedBadges: [],
    unlockedAccessories: [],
    completedLessons: {}, // { [lessonId]: { crown: true } }
    bestAccuracyByLesson: {}, // { [lessonId]: 0..1 }
    activeDates: [], // ["2026-07-29", ...] — for the streak calendar
    goal: null, // onboarding "why are you learning" choice
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
    // The broken streak is kept around as `previousStreak` so it can be
    // bought back with gems (see applyStreakRepair) — only captured the
    // first time it breaks, since `merged.streak` is already 0 afterwards.
    if (merged.lastActiveDate) {
      const gap = daysBetween(merged.lastActiveDate, todayStr());
      const willBreak = gap > 2 || (gap === 2 && merged.streakFreezes <= 0);
      if (willBreak && merged.streak > 0) {
        merged.previousStreak = merged.streak;
        merged.streakLostDate = todayStr();
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

export function applyLessonComplete(progress, lessonId, xpEarned, accuracyPct = 1, wasPerfect = false) {
  const today = todayStr();
  const weekStart = weekStartStr();
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
  const todayPerfectLessons = isNewDay
    ? (wasPerfect ? 1 : 0)
    : progress.todayPerfectLessons + (wasPerfect ? 1 : 0);

  const isNewWeek = progress.weekStartDate !== weekStart;
  const weeklyXp = isNewWeek ? xpEarned : progress.weeklyXp + xpEarned;
  const weeklyLessons = isNewWeek ? 1 : progress.weeklyLessons + 1;
  const dailyQuestClaimed = isNewDay ? [] : progress.dailyQuestClaimed;
  const weeklyQuestClaimed = isNewWeek ? [] : progress.weeklyQuestClaimed;

  const activeDates = progress.activeDates.includes(today)
    ? progress.activeDates
    : [...progress.activeDates, today].slice(-ACTIVE_DATES_HISTORY_DAYS);

  const prevBest = progress.bestAccuracyByLesson[lessonId] ?? 0;
  const bestAccuracyByLesson = {
    ...progress.bestAccuracyByLesson,
    [lessonId]: Math.max(prevBest, accuracyPct),
  };

  const gemsEarned = GEMS_PER_LESSON + (wasPerfect ? GEMS_PERFECT_BONUS : 0);

  return {
    ...progress,
    xp: progress.xp + xpEarned,
    gems: progress.gems + gemsEarned,
    streak,
    streakFreezes,
    lastActiveDate: today,
    todayDate: today,
    todayXp,
    todayLessons,
    todayPerfectLessons,
    weekStartDate: weekStart,
    weeklyXp,
    weeklyLessons,
    dailyQuestClaimed,
    weeklyQuestClaimed,
    activeDates,
    bestAccuracyByLesson,
    completedLessons: {
      ...progress.completedLessons,
      [lessonId]: { crown: true },
    },
  };
}

// Buys back a broken streak with gems, within the window before
// `previousStreak` gets cleared (repair or dismiss).
export function applyStreakRepair(progress) {
  if (progress.previousStreak <= 0 || progress.gems < STREAK_REPAIR_COST) return progress;
  return {
    ...progress,
    streak: progress.previousStreak,
    gems: progress.gems - STREAK_REPAIR_COST,
    previousStreak: 0,
    streakLostDate: null,
  };
}

export function dismissStreakRepair(progress) {
  return { ...progress, previousStreak: 0, streakLostDate: null };
}

// Marks the first `unlockCount` lessons as completed (without touching
// per-word stats), so a placement test can skip a learner ahead. Lessons
// already completed are left untouched; a small starter XP bonus is given
// for each newly-skipped lesson.
export function applyPlacementResult(progress, lessons, unlockCount) {
  if (unlockCount <= 0) return progress;
  const completedLessons = { ...progress.completedLessons };
  let bonusXp = 0;
  for (let i = 0; i < Math.min(unlockCount, lessons.length); i++) {
    const lid = lessons[i].id;
    if (!completedLessons[lid]) {
      completedLessons[lid] = { crown: true, placement: true };
      bonusXp += 20;
    }
  }
  return { ...progress, completedLessons, xp: progress.xp + bonusXp };
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("habesha-steps-word-stats");
  localStorage.removeItem("habesha-steps-settings");
}
