import { motion } from "framer-motion";

const OFFSET_PATTERN = [0, 64, 96, 64, 0, -64, -96, -64];

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
      <path d="M2 8l4 3 6-7 6 7 4-3-2 11H4L2 8zm2.5 12h15v2h-15v-2z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
      <path d="M12 2l2.9 6.9L22 9.6l-5.5 4.8L18.2 22 12 17.9 5.8 22l1.7-7.6L2 9.6l7.1-.7L12 2z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#B7B7B7">
      <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 5a3 3 0 016 0v3H9V7zm3 8a2 2 0 110 4 2 2 0 010-4z" />
    </svg>
  );
}

export default function LessonBubble({ lesson, status, index, onClick }) {
  const offset = OFFSET_PATTERN[index % OFFSET_PATTERN.length];
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isCurrent = status === "current";

  const bg = isCompleted
    ? "#FFC800"
    : isCurrent
    ? "#58CC02"
    : "#E5E5E5";
  const shadow = isCompleted
    ? "#E6B400"
    : isCurrent
    ? "#58A700"
    : "#B7B7B7";

  return (
    <div className="flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      <motion.button
        onClick={() => !isLocked && onClick(lesson)}
        disabled={isLocked}
        className="btn-3d rounded-full flex items-center justify-center"
        style={{
          width: 84,
          height: 84,
          background: bg,
          boxShadow: `0 6px 0 ${shadow}`,
        }}
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        animate={isCurrent ? { y: [0, -6, 0] } : {}}
        transition={isCurrent ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        {isCompleted ? <CrownIcon /> : isLocked ? <LockIcon /> : <StarIcon />}
      </motion.button>
      <span className="mt-2 text-xs font-bold text-duo-text-light" style={{ color: "var(--color-duo-text-light)" }}>
        {lesson.title}
      </span>
    </div>
  );
}
