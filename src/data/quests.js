// Daily and weekly quests, each with a target and a gems reward. `progress`
// reads the current value straight off the progress object — no separate
// quest-state machine needed, since useProgress already tracks the
// underlying counters (todayXp, weeklyLessons, streak, ...).
export const DAILY_QUESTS = [
  {
    id: "daily-lesson",
    scope: "daily",
    name: "Finish 1 lesson",
    icon: "📘",
    target: 1,
    reward: 10,
    progress: (p) => p.todayLessons,
  },
  {
    id: "daily-xp",
    scope: "daily",
    name: "Earn 20 XP",
    icon: "⭐",
    target: 20,
    reward: 10,
    progress: (p) => p.todayXp,
  },
  {
    id: "daily-perfect",
    scope: "daily",
    name: "Get a perfect lesson",
    icon: "💯",
    target: 1,
    reward: 15,
    progress: (p) => p.todayPerfectLessons,
  },
];

export const WEEKLY_QUESTS = [
  {
    id: "weekly-lessons",
    scope: "weekly",
    name: "Complete 5 lessons",
    icon: "📗",
    target: 5,
    reward: 40,
    progress: (p) => p.weeklyLessons,
  },
  {
    id: "weekly-xp",
    scope: "weekly",
    name: "Earn 150 XP",
    icon: "🌟",
    target: 150,
    reward: 40,
    progress: (p) => p.weeklyXp,
  },
  {
    id: "weekly-streak",
    scope: "weekly",
    name: "Reach a 3-day streak",
    icon: "🔥",
    target: 3,
    reward: 30,
    progress: (p) => p.streak,
  },
];

export function questsForScope(scope) {
  return scope === "daily" ? DAILY_QUESTS : WEEKLY_QUESTS;
}

export function claimedListKey(scope) {
  return scope === "daily" ? "dailyQuestClaimed" : "weeklyQuestClaimed";
}
