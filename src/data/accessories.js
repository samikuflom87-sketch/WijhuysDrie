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

// Cosmetic accessories bought with gems in the Shop, instead of earned from
// a milestone. Same visual system (Mascot.jsx renders them), different
// unlock path.
export const SHOP_ACCESSORIES = [
  { id: "bandana", name: "Bandana", icon: "🧣", cost: 40 },
  { id: "medal", name: "Champion Medal", icon: "🥇", cost: 60 },
  { id: "crown", name: "Golden Crown", icon: "👑", cost: 100 },
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
