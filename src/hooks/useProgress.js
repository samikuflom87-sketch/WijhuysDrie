import { useCallback, useEffect, useState } from "react";
import {
  loadProgress,
  saveProgress,
  applyLessonComplete,
  resetAllProgress,
  defaultProgress,
} from "../lib/storage";

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeLesson = useCallback((lessonId, xpEarned, accuracyPct = 1) => {
    setProgress((prev) => applyLessonComplete(prev, lessonId, xpEarned, accuracyPct));
  }, []);

  const unlockBadges = useCallback((badgeIds) => {
    if (badgeIds.length === 0) return;
    setProgress((prev) => ({
      ...prev,
      unlockedBadges: [...new Set([...prev.unlockedBadges, ...badgeIds])],
    }));
  }, []);

  const unlockAccessories = useCallback((accessoryIds) => {
    if (accessoryIds.length === 0) return;
    setProgress((prev) => ({
      ...prev,
      unlockedAccessories: [...new Set([...prev.unlockedAccessories, ...accessoryIds])],
    }));
  }, []);

  // Direct XP credit for things that happen outside the normal lesson-
  // completion flow (a bonus round played after a lesson already ended) —
  // skips streak/badge/accuracy recalculation, which finishLesson already
  // ran once for this visit.
  const addXp = useCallback((amount) => {
    if (!amount) return;
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount, todayXp: prev.todayXp + amount }));
  }, []);

  const updateSetting = useCallback((key, value) => {
    setProgress((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetProgress = useCallback(() => {
    resetAllProgress();
    setProgress(defaultProgress());
  }, []);

  return { progress, completeLesson, unlockBadges, unlockAccessories, addXp, updateSetting, resetProgress, setProgress };
}
