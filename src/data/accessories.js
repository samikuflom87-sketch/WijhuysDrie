import { totalWordsIntroduced } from "../lib/wordStats";

// Purely cosmetic mascot accessories, unlocked at milestones. Same
// never-re-locks pattern as badges.js.
export const ACCESSORIES = [
  {
    id: "hat",
    name: "Party Hat",
    icon: "🎉",
    description: "Reach a 7-day streak.",
    check: (progress) => progress.streak >= 7,
  },
  {
    id: "glasses",
    name: "Smart Glasses",
    icon: "🤓",
    description: "Get taught 50 words.",
    check: (progress, wordStats) => totalWordsIntroduced(wordStats) >= 50,
  },
];

// Returns { progress: updated-if-needed, newlyUnlocked: [accessory, ...] }
export function checkAccessories(progress, wordStats) {
  const unlocked = progress.unlockedAccessories || [];
  const newlyUnlocked = [];
  for (const accessory of ACCESSORIES) {
    if (unlocked.includes(accessory.id)) continue;
    if (accessory.check(progress, wordStats)) newlyUnlocked.push(accessory);
  }
  if (newlyUnlocked.length === 0) {
    return { progress, newlyUnlocked };
  }
  return {
    progress: {
      ...progress,
      unlockedAccessories: [...unlocked, ...newlyUnlocked.map((a) => a.id)],
    },
    newlyUnlocked,
  };
}
