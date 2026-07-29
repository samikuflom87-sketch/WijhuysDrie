import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "./ProgressBar";
import Hearts from "./Hearts";
import { useSound } from "../hooks/useSound";

export default function TopBar({ progressPct, hearts, combo = 0, onExit, accentColor }) {
  const navigate = useNavigate();
  const sound = useSound();

  return (
    <div
      className="sticky top-0 z-20 bg-brand-surface px-4 py-3"
      style={accentColor ? { borderBottom: `3px solid ${accentColor}` } : undefined}
    >
      <div className="max-w-md mx-auto flex items-center gap-4">
        <button
          onClick={() => {
            sound.click();
            (onExit || (() => navigate("/")))();
          }}
          aria-label="Exit lesson"
          className="text-2xl font-bold"
          style={{ color: "var(--color-brand-line-dark)" }}
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar value={progressPct} />
        </div>
        <AnimatePresence>
          {combo >= 2 && (
            <motion.div
              key={combo}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center gap-0.5 font-extrabold text-sm shrink-0"
              style={{ color: "var(--color-brand-coral-dark)" }}
            >
              🔥{combo}
            </motion.div>
          )}
        </AnimatePresence>
        <Hearts count={hearts} />
      </div>
    </div>
  );
}
