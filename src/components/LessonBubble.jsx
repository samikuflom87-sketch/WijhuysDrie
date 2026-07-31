import { motion } from "framer-motion";
import { useSettingsContext } from "../context/SettingsContext";
import { useSound } from "../hooks/useSound";
import ProgressRing from "./ProgressRing";
import Icon from "./Icon";

const OFFSET_PATTERN = [0, 64, 96, 64, 0, -64, -96, -64];

export default function LessonBubble({ lesson, status, index, accuracy, onClick }) {
  const { settings } = useSettingsContext();
  const sound = useSound();
  const offset = OFFSET_PATTERN[index % OFFSET_PATTERN.length];
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isCurrent = status === "current";

  const bg = isCompleted
    ? "linear-gradient(160deg, #CC9A48, #B9822C)"
    : isCurrent
    ? "linear-gradient(160deg, #C25A3D, #B8492F)"
    : "#EFE3D3";
  const shadow = isCompleted
    ? "#8C611B"
    : isCurrent
    ? "#8A371F"
    : "#CBB595";

  const showRing = accuracy !== null && accuracy !== undefined;
  const ringColor = accuracy >= 0.8 ? "var(--color-brand-teal)" : accuracy >= 0.5 ? "var(--color-brand-yellow-dark)" : "var(--color-brand-coral)";

  return (
    <div className="relative z-10 flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      <div className="relative" style={{ width: 96, height: 96 }}>
        {showRing && <ProgressRing pct={accuracy} size={96} color={ringColor} />}
        <motion.button
          onClick={() => {
            if (isLocked) return;
            sound.click();
            onClick(lesson);
          }}
          disabled={isLocked}
          className="btn-3d rounded-[28px] flex items-center justify-center absolute"
          style={{
            width: 84,
            height: 84,
            top: 6,
            left: 6,
            background: bg,
            boxShadow: `0 6px 0 ${shadow}`,
          }}
          whileHover={!isLocked ? { scale: 1.05 } : {}}
          animate={isCurrent && !settings.reducedMotion ? { y: [0, -6, 0] } : {}}
          transition={isCurrent && !settings.reducedMotion ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : {}}
        >
          <Icon name={isCompleted ? "crown" : isLocked ? "lock" : "star"} size={30} style={{ color: isLocked ? "#CBB595" : "white" }} />
        </motion.button>
      </div>
      <span className="mt-2 text-xs font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
        {lesson.title}
      </span>
    </div>
  );
}
