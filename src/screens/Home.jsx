import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import lessonsData from "../data/lessons.json";
import { isLessonCompleted, isLessonUnlocked, getLevelInfo } from "../lib/storage";
import { lessonAccuracy, pickReviewWords } from "../lib/wordStats";
import { randomMascot, randomLine } from "../data/mascots";
import LessonBubble from "../components/LessonBubble";
import LessonPath from "../components/LessonPath";
import StatPill from "../components/StatPill";
import StreakFlame from "../components/StreakFlame";
import Mascot from "../components/Mascot";
import ProgressBar from "../components/ProgressBar";
import XPCounter from "../components/XPCounter";
import { useSound } from "../hooks/useSound";
import { useSettingsContext } from "../context/SettingsContext";

export default function Home({ progress, wordStats }) {
  const navigate = useNavigate();
  const sound = useSound();
  const { settings } = useSettingsContext();
  const { scrollY } = useScroll();
  const mascotParallaxY = useTransform(scrollY, [0, 260], [0, -22]);
  const lessons = lessonsData.lessons;
  const greeter = useMemo(() => randomMascot(), []);
  const greeting = useMemo(() => randomLine(greeter, "greetings"), [greeter]);
  const levelInfo = getLevelInfo(progress.xp);
  const hasReviewWords = useMemo(
    () => pickReviewWords(wordStats, lessons, 1).length > 0,
    [wordStats, lessons],
  );

  function statusFor(lesson) {
    if (isLessonCompleted(progress, lesson.id)) return "completed";
    if (isLessonUnlocked(progress, lessons, lesson.id)) return "current";
    return "locked";
  }

  const goalPct = Math.min(100, (progress.todayLessons / progress.dailyGoalLessons) * 100);

  return (
    <div className="min-h-screen flex flex-col app-bg">
      <header
        className="sticky top-0 z-10"
        style={{ background: "linear-gradient(135deg, #FF8163, var(--color-brand-coral))" }}
      >
        <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="font-display font-extrabold text-lg text-white tracking-tight">
            Habesha Steps
          </h1>
          <div className="flex items-center gap-3">
            <StreakFlame streak={progress.streak} color="white" />
            {progress.streakFreezes > 0 && <StatPill icon="🧊" value={progress.streakFreezes} color="white" />}
            <StatPill icon="⭐" value={<XPCounter value={progress.xp} />} color="white" />
            <button
              onClick={() => {
                sound.click();
                navigate("/achievements");
              }}
              aria-label="Achievements"
              className="text-xl"
            >
              🏆
            </button>
            <button
              onClick={() => {
                sound.click();
                navigate("/settings");
              }}
              aria-label="Settings"
              className="text-xl"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md w-full mx-auto px-4 pt-4 flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl p-4 flex items-center gap-3 card-soft"
          style={{ background: "var(--color-brand-surface)" }}
        >
          <motion.div style={{ y: settings.reducedMotion ? 0 : mascotParallaxY }}>
            <Mascot
              mascotId={greeter.id}
              mood="happy"
              size={56}
              accessories={progress.unlockedAccessories || []}
            />
          </motion.div>
          <div>
            <p className="font-extrabold text-sm" style={{ color: "var(--color-brand-coral-dark)" }}>
              {greeter.name}
            </p>
            <p className="text-sm font-bold" style={{ color: "var(--color-brand-ink)" }}>
              {greeting}
            </p>
          </div>
        </motion.div>

        <div className="rounded-2xl p-4 flex items-center justify-between card-soft">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--color-brand-ink-light)" }}>
              Level {levelInfo.level}
            </p>
            <p className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
              {levelInfo.rank}
            </p>
          </div>
          {levelInfo.xpForNextLevel && (
            <p className="text-xs font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
              {levelInfo.xpIntoLevel} / {levelInfo.xpForNextLevel} XP
            </p>
          )}
        </div>

        <div className="rounded-2xl p-4 card-soft">
          <div className="flex justify-between items-center mb-2">
            <span className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
              Daily Goal
            </span>
            <span className="text-sm font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
              {Math.min(progress.todayLessons, progress.dailyGoalLessons)} / {progress.dailyGoalLessons} lessons
            </span>
          </div>
          <ProgressBar value={goalPct} />
        </div>

        {hasReviewWords && (
          <button
            onClick={() => {
              sound.click();
              navigate("/review");
            }}
            className="btn-3d btn-teal rounded-2xl px-4 py-3.5 font-extrabold uppercase tracking-wide"
          >
            🔁 Review words you've missed
          </button>
        )}

        <button
          onClick={() => {
            sound.click();
            navigate("/words");
          }}
          className="btn-3d btn-white rounded-2xl px-4 py-3.5 font-extrabold uppercase tracking-wide"
        >
          📖 My Words
        </button>
      </div>

      <motion.div
        className="relative max-w-md w-full mx-auto flex flex-col items-center gap-10 px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <LessonPath count={lessons.length} />
        {lessons.map((lesson, i) => (
          <LessonBubble
            key={lesson.id}
            lesson={lesson}
            index={i}
            status={statusFor(lesson)}
            accuracy={lessonAccuracy(wordStats, lesson)}
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
