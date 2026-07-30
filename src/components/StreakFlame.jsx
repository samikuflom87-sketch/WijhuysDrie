import { motion } from "framer-motion";
import { useSettingsContext } from "../context/SettingsContext";
import Icon from "./Icon";

// The streak counter gets its own flicker + glow instead of being a plain
// StatPill — the one number in the app worth making feel alive, since it's
// the thing that brings a learner back tomorrow.
export default function StreakFlame({ streak, color = "white" }) {
  const { settings } = useSettingsContext();
  const lit = streak > 0;
  const reduced = settings.reducedMotion;

  return (
    <div className="flex items-center gap-1 font-extrabold text-lg" style={{ color }}>
      <motion.span
        className="inline-flex leading-none"
        style={{ filter: lit ? "drop-shadow(0 0 6px rgba(217, 168, 87, 0.7))" : "none" }}
        animate={
          lit && !reduced
            ? { scale: [1, 1.14, 1, 1.08, 1], rotate: [0, -4, 3, -2, 0] }
            : {}
        }
        transition={lit && !reduced ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <Icon name="flame" size={20} />
      </motion.span>
      <span>{streak}</span>
    </div>
  );
}
