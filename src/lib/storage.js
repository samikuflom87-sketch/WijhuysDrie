const STORAGE_KEY = "habesha-steps-progress";

export const DAILY_GOAL_XP = 20;

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
    dailyGoal: DAILY_GOAL_XP,
    completedLessons: {}, // { [lessonId]: { crown: true } }
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    const merged = { ...defaultProgress(), ...parsed };

    // Reset today's XP counter if the day has rolled over.
    if (merged.todayDate !== todayStr()) {
      merged.todayDate = todayStr();
      merged.todayXp = 0;
    }

    // Streak decays if more than a day passed without activity.
    if (merged.lastActiveDate) {
      const gap = daysBetween(merged.lastActiveDate, todayStr());
      if (gap > 1) merged.streak = 0;
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

  if (progress.lastActiveDate !== today) {
    const gap = progress.lastActiveDate
      ? daysBetween(progress.lastActiveDate, today)
      : null;
    if (gap === 1) {
      streak = streak + 1;
    } else {
      streak = 1;
    }
  } else if (streak === 0) {
    streak = 1;
  }

  const todayXp =
    progress.todayDate === today ? progress.todayXp + xpEarned : xpEarned;

  return {
    ...progress,
    xp: progress.xp + xpEarned,
    streak,
    lastActiveDate: today,
    todayDate: today,
    todayXp,
    completedLessons: {
      ...progress.completedLessons,
      [lessonId]: { crown: true },
    },
  };
}
