import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import lessonsData from "../data/lessons.json";
import { isLessonCompleted, isLessonUnlocked, DAILY_GOAL_XP } from "../lib/storage";
import LessonBubble from "../components/LessonBubble";
import StatPill from "../components/StatPill";
import Mascot from "../components/Mascot";
import ProgressBar from "../components/ProgressBar";
import XPCounter from "../components/XPCounter";

export default function Home({ progress }) {
  const navigate = useNavigate();
  const lessons = lessonsData.lessons;

  function statusFor(lesson) {
    if (isLessonCompleted(progress, lesson.id)) return "completed";
    if (isLessonUnlocked(progress, lessons, lesson.id)) return "current";
    return "locked";
  }

  const goalPct = Math.min(100, (progress.todayXp / progress.dailyGoal) * 100);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-duo-bg)" }}>
      <header className="sticky top-0 z-10 bg-white border-b-2 border-duo-gray" style={{ borderColor: "var(--color-duo-gray)" }}>
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          <StatPill icon="🔥" value={progress.streak} color="#FF9600" />
          <StatPill icon="⭐" value={<XPCounter value={progress.xp} />} color="#FFC800" />
        </div>
      </header>

      <div className="max-w-md w-full mx-auto px-4 pt-4">
        <div className="bg-white rounded-2xl p-4 border-2" style={{ borderColor: "var(--color-duo-gray)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-extrabold" style={{ color: "var(--color-duo-text)" }}>
              Daily Goal
            </span>
            <span className="text-sm font-bold" style={{ color: "var(--color-duo-text-light)" }}>
              {Math.min(progress.todayXp, progress.dailyGoal)} / {DAILY_GOAL_XP} XP
            </span>
          </div>
          <ProgressBar value={goalPct} />
        </div>
      </div>

      <motion.div
        className="max-w-md w-full mx-auto flex flex-col items-center gap-10 px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {lessons.map((lesson, i) => (
          <LessonBubble
            key={lesson.id}
            lesson={lesson}
            index={i}
            status={statusFor(lesson)}
            onClick={(l) => navigate(`/lesson/${l.id}`)}
          />
        ))}

        <div className="flex flex-col items-center gap-2 pt-4">
          <Mascot mood="excited" size={110} />
          <p className="font-bold text-center" style={{ color: "var(--color-duo-text-light)" }}>
            More lessons coming soon!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
