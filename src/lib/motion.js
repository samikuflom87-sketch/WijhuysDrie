// Shared Framer Motion presets so animation timing/easing feels like one
// consistent system instead of scattered ad hoc values across components.
export const SPRING_BOUNCY = { type: "spring", stiffness: 300, damping: 14 };
export const SPRING_SNAPPY = { type: "spring", stiffness: 400, damping: 22 };
export const SPRING_GENTLE = { type: "spring", stiffness: 200, damping: 20 };

export const EASE_OUT_FAST = { duration: 0.18, ease: "easeOut" };
export const EASE_OUT_NORMAL = { duration: 0.3, ease: "easeOut" };

// A card/tile popping into view (badges, stat cards, unlocks).
export const popIn = {
  initial: { opacity: 0, scale: 0.7, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: SPRING_BOUNCY,
};

// A row/line rising into place (headings, list rows).
export const riseIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: EASE_OUT_NORMAL,
};
