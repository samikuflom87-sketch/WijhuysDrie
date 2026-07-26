import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import lessonsData from "../data/lessons.json";
import { isLessonCompleted, isLessonUnlocked, DAILY_GOAL_XP } from "../lib/storage";
import { randomMascot, randomLine } from "../data/mascots";
import LessonBubble from "../components/LessonBubble";
import StatPill from "../components/StatPill";
import Mascot from "../components/Mascot";
import ProgressBar from "../components/ProgressBar";
import XPCounter from "../components/XPCounter";

export default function Home({ progress }) {
  const navigate = useNavigate();
  const lessons = lessonsData.lessons;
  const greeter = useMemo(() => randomMascot(), []);
  const greeting = useMemo(() => randomLine(greeter, "greetings"), [greeter]);

  function statusFor(lesson) {
    if (isLessonCompleted(progress, lesson.id)) return "completed";
    if (isLessonUnlocked(progress, lessons, lesson.id)) return "current";
    return "locked";
  }

  const goalPct = Math.min(100, (progress.todayXp / progress.dailyGoal) * 100);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-brand-cream)" }}>
      <header
        className="sticky top-0 z-10"
        style={{ background: "linear-gradient(135deg, #FF8163, var(--color-brand-coral))" }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="font-display font-extrabold text-lg text-white tracking-tight">
            Habesha Steps
          </h1>
          <div className="flex items-center gap-4">
            <StatPill icon="🔥" value={progress.streak} color="white" />
            <StatPill icon="⭐" value={<XPCounter value={progress.xp} />} color="white" />
          </div>
        </div>
      </header>

      <div className="max-w-md w-full mx-auto px-4 pt-4 flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "white", border: "2px solid var(--color-brand-line)" }}
        >
          <Mascot mascotId={greeter.id} mood="happy" size={56} />
          <div>
            <p className="font-extrabold text-sm" style={{ color: "var(--color-brand-coral-dark)" }}>
              {greeter.name}
            </p>
            <p className="text-sm font-bold" style={{ color: "var(--color-brand-ink)" }}>
              {greeting}
            </p>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl p-4" style={{ border: "2px solid var(--color-brand-line)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
              Daily Goal
            </span>
            <span className="text-sm font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
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
          <Mascot mascotId="nardos" mood="neutral" size={100} />
          <p className="font-bold text-center" style={{ color: "var(--color-brand-ink-light)" }}>
            More lessons coming soon!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
