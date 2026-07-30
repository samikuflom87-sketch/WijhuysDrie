import { useMemo } from "react";
import { motion } from "framer-motion";
import Mascot from "./Mascot";
import { randomMascot } from "../data/mascots";

// Compact mascot+tip card for secondary screens that would otherwise have
// no mascot presence at all — keeps the cast feeling like they're around
// the whole app, not just on the home screen and inside lessons.
// Unlike `greetings`/`correct`/etc., `questsTip`/`practiceTip` are single
// strings rather than arrays, so read them directly instead of via randomLine.
export default function MascotTip({ tipKey, size = 44 }) {
  const mascot = useMemo(() => randomMascot(), []);
  const tip = mascot[tipKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-3 flex items-center gap-3 card-soft"
    >
      <Mascot mascotId={mascot.id} mood="happy" size={size} />
      <p className="text-sm font-bold" style={{ color: "var(--color-brand-ink)" }}>
        {tip}
      </p>
    </motion.div>
  );
}
