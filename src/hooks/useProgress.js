import { useCallback, useEffect, useState } from "react";
import lessonsData from "../data/lessons.json";
import {
  loadProgress,
  saveProgress,
  applyLessonComplete,
  applyStreakRepair,
  dismissStreakRepair,
  applyPlacementResult,
  resetAllProgress,
  defaultProgress,
} from "../lib/storage";
import { questsForScope, claimedListKey } from "../data/quests";

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeLesson = useCallback((lessonId, xpEarned, accuracyPct = 1, wasPerfect = false) => {
    setProgress((prev) => applyLessonComplete(prev, lessonId, xpEarned, accuracyPct, wasPerfect));
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
  // completion flow (a bonus round or Practice Hub session) — skips
  // streak/badge/accuracy recalculation, which finishLesson already ran
  // once for this visit (or never needs to, for a practice-only session).
  const addXp = useCallback((amount) => {
    if (!amount) return;
    setProgress((prev) => ({ ...prev, xp: prev.xp + amount, todayXp: prev.todayXp + amount }));
  }, []);

  // Callers are expected to check `progress.gems >= amount` themselves
  // before calling this — it unconditionally subtracts, same convention
  // already used for streak freezes elsewhere in the app.
  const spendGems = useCallback((amount) => {
    if (!amount) return;
    setProgress((prev) => ({ ...prev, gems: Math.max(0, prev.gems - amount) }));
  }, []);

  const addGems = useCallback((amount) => {
    if (!amount) return;
    setProgress((prev) => ({ ...prev, gems: prev.gems + amount }));
  }, []);

  const repairStreak = useCallback(() => {
    setProgress((prev) => applyStreakRepair(prev));
  }, []);

  const dismissStreakRepairBanner = useCallback(() => {
    setProgress((prev) => dismissStreakRepair(prev));
  }, []);

  const claimQuest = useCallback((questId, scope) => {
    setProgress((prev) => {
      const key = claimedListKey(scope);
      if (prev[key].includes(questId)) return prev;
      const quest = questsForScope(scope).find((q) => q.id === questId);
      if (!quest || quest.progress(prev) < quest.target) return prev;
      return { ...prev, gems: prev.gems + quest.reward, [key]: [...prev[key], questId] };
    });
  }, []);

  // Caller (the Shop screen) already checks cost/ownership against the
  // current `progress` prop before calling this, same convention as
  // spendGems.
  const purchaseAccessory = useCallback((accessoryId, cost) => {
    setProgress((prev) => ({
      ...prev,
      gems: prev.gems - cost,
      unlockedAccessories: [...new Set([...prev.unlockedAccessories, accessoryId])],
    }));
  }, []);

  const applyPlacement = useCallback((unlockCount) => {
    setProgress((prev) => applyPlacementResult(prev, lessonsData.lessons, unlockCount));
  }, []);

  const updateSetting = useCallback((key, value) => {
    setProgress((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetProgress = useCallback(() => {
    resetAllProgress();
    setProgress(defaultProgress());
  }, []);

  return {
    progress,
    completeLesson,
    unlockBadges,
    unlockAccessories,
    addXp,
    spendGems,
    addGems,
    repairStreak,
    dismissStreakRepairBanner,
    claimQuest,
    purchaseAccessory,
    applyPlacement,
    updateSetting,
    resetProgress,
    setProgress,
  };
}
