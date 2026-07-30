import { motion } from "framer-motion";
import Mascot from "./Mascot";
import Icon from "./Icon";
import Confetti from "./Confetti";
import Button from "./Button";
import XPCounter from "./XPCounter";
import { SPRING_BOUNCY } from "../lib/motion";

const THEMES = {
  streak: {
    icon: "flame",
    gradient: "linear-gradient(160deg, #C25A3D, #8A371F)",
    title: (value) => `${value}-day streak!`,
    subtitle: "You're building a real habit — keep the flame going.",
  },
  level: {
    icon: "star",
    gradient: "linear-gradient(160deg, #2B8478, #123F38)",
    title: (value) => `Level ${value}!`,
    subtitle: null, // filled in from `rank` prop instead
  },
};

// A full-screen "directed moment" — the app deliberately interrupts the
// normal flow for a streak milestone or a level-up, the same way Duolingo
// stops to make a big deal out of these instead of folding them quietly
// into the regular lesson-complete summary.
export default function CelebrationMoment({ type, value, rank, companion, onContinue }) {
  const theme = THEMES[type];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ background: theme.gradient }}
    >
      <Confetti count={40} variant="burst" />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING_BOUNCY}
      >
        <Mascot mascotId={companion.id} mood="excited" size={140} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...SPRING_BOUNCY, delay: 0.15 }}
        className="flex items-center justify-center rounded-full"
        style={{ width: 56, height: 56, background: "rgba(255,255,255,0.18)", color: "#fffcf7" }}
      >
        <Icon name={theme.icon} size={30} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="font-display font-extrabold text-3xl"
        style={{ color: "#fffcf7" }}
      >
        {type === "streak" ? (
          <>
            <XPCounter value={value} duration={0.8} />
            -day streak!
          </>
        ) : (
          theme.title(value)
        )}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="font-bold text-lg"
        style={{ color: "rgba(255,252,247,0.85)" }}
      >
        {type === "level" ? rank : theme.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="w-full max-w-xs"
      >
        <Button variant="white" className="w-full uppercase tracking-wide" onClick={onContinue}>
          Nice!
        </Button>
      </motion.div>
    </div>
  );
}
