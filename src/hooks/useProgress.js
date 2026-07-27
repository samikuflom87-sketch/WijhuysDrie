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

  const completeLesson = useCallback((lessonId, xpEarned) => {
    setProgress((prev) => applyLessonComplete(prev, lessonId, xpEarned));
  }, []);

  const unlockBadges = useCallback((badgeIds) => {
    if (badgeIds.length === 0) return;
    setProgress((prev) => ({
      ...prev,
      unlockedBadges: [...new Set([...prev.unlockedBadges, ...badgeIds])],
    }));
  }, []);

  const updateSetting = useCallback((key, value) => {
    setProgress((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetProgress = useCallback(() => {
    resetAllProgress();
    setProgress(defaultProgress());
  }, []);

  return { progress, completeLesson, unlockBadges, updateSetting, resetProgress, setProgress };
}
