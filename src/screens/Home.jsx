import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import lessonsData from "../data/lessons.json";
import { isLessonCompleted, isLessonUnlocked, getLevelInfo, STREAK_REPAIR_COST } from "../lib/storage";
import { lessonAccuracy, pickReviewWords, totalWordsIntroduced, estimatedCefrLevel } from "../lib/wordStats";
import { randomMascot, randomLine } from "../data/mascots";
import LessonBubble from "../components/LessonBubble";
import LessonPath from "../components/LessonPath";
import StatPill from "../components/StatPill";
import StreakFlame from "../components/StreakFlame";
import Mascot from "../components/Mascot";
import ProgressBar from "../components/ProgressBar";
import XPCounter from "../components/XPCounter";
import Button from "../components/Button";
import Icon from "../components/Icon";
import OnboardingGoal, { goalBlurb } from "../components/OnboardingGoal";
import { useSound } from "../hooks/useSound";
import { useSettingsContext } from "../context/SettingsContext";

export default function Home({ progress, wordStats, onSetGoal, onRepairStreak, onDismissStreakRepair }) {
  const navigate = useNavigate();
  const sound = useSound();
  const { settings } = useSettingsContext();
  const { scrollY } = useScroll();
  const mascotParallaxY = useTransform(scrollY, [0, 260], [0, -22]);
  const lessons = lessonsData.lessons;
  const greeter = useMemo(() => randomMascot(), []);
  const greeting = useMemo(() => randomLine(greeter, "greetings"), [greeter]);
  const levelInfo = getLevelInfo(progress.xp);
  const cefrLevel = estimatedCefrLevel(totalWordsIntroduced(wordStats));
  const hasReviewWords = useMemo(
    () => pickReviewWords(wordStats, lessons, 1).length > 0,
    [wordStats, lessons],
  );
  const isBrandNew = Object.keys(progress.completedLessons).length === 0;
  const canRepairStreak = progress.previousStreak > 0;

  function statusFor(lesson) {
    if (isLessonCompleted(progress, lesson.id)) return "completed";
    if (isLessonUnlocked(progress, lessons, lesson.id)) return "current";
    return "locked";
  }

  const goalPct = Math.min(100, (progress.todayLessons / progress.dailyGoalLessons) * 100);

  return (
    <div className="min-h-screen flex flex-col app-bg">
      <header className="header-premium sticky top-0 z-10">
        <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="font-display font-bold text-lg text-white tracking-tight">
            Habesha Steps
          </h1>
          <div className="flex items-center gap-3">
            <StreakFlame streak={progress.streak} color="white" />
            {progress.streakFreezes > 0 && (
              <StatPill icon={<Icon name="freeze" size={18} />} value={progress.streakFreezes} color="white" />
            )}
            <StatPill icon={<Icon name="star" size={18} />} value={<XPCounter value={progress.xp} />} color="white" />
            <StatPill icon={<Icon name="gem" size={18} />} value={progress.gems} color="white" />
            <button
              onClick={() => {
                sound.click();
                navigate("/quests");
              }}
              aria-label="Quests"
              className="text-white"
            >
              <Icon name="target" size={22} />
            </button>
            <button
              onClick={() => {
                sound.click();
                navigate("/achievements");
              }}
              aria-label="Achievements"
              className="text-white"
            >
              <Icon name="trophy" size={22} />
            </button>
            <button
              onClick={() => {
                sound.click();
                navigate("/settings");
              }}
              aria-label="Settings"
              className="text-white"
            >
              <Icon name="gear" size={22} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md md:max-w-xl w-full mx-auto px-4 pt-4 flex flex-col gap-4">
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
            {progress.goal && (
              <p className="text-xs font-bold mt-0.5" style={{ color: "var(--color-brand-ink-light)" }}>
                {goalBlurb(progress.goal)}
              </p>
            )}
          </div>
        </motion.div>

        {canRepairStreak && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 flex items-center gap-3 card-soft"
            style={{ border: "2px solid var(--color-brand-coral)" }}
          >
            <span style={{ color: "var(--color-brand-coral)" }}>
              <Icon name="heartCrack" size={26} />
            </span>
            <div className="flex-1">
              <p className="font-extrabold text-sm" style={{ color: "var(--color-brand-ink)" }}>
                Your {progress.previousStreak}-day streak broke
              </p>
              <p className="text-xs font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
                Restore it for {STREAK_REPAIR_COST} gems
              </p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <Button
                variant="yellow"
                className="!py-1.5 !px-3 text-xs uppercase tracking-wide"
                disabled={progress.gems < STREAK_REPAIR_COST}
                onClick={onRepairStreak}
              >
                Restore
              </Button>
              <button
                onClick={onDismissStreakRepair}
                className="text-xs font-bold underline"
                style={{ color: "var(--color-brand-ink-light)" }}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        <div className="rounded-2xl p-4 flex items-center justify-between card-soft">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--color-brand-ink-light)" }}>
              Level {levelInfo.level} · Est. {cefrLevel}
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

        {isBrandNew && (
          <button
            onClick={() => {
              sound.click();
              navigate("/placement");
            }}
            className="btn-3d btn-teal rounded-2xl px-4 py-3.5 font-extrabold uppercase tracking-wide flex items-center justify-center gap-2"
          >
            <Icon name="target" size={18} />
            Already know some Tigrinya? Take a placement test
          </button>
        )}

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
            className="btn-3d btn-teal rounded-2xl px-4 py-3.5 font-extrabold uppercase tracking-wide flex items-center justify-center gap-2"
          >
            <Icon name="refresh" size={18} />
            Review words you've missed
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              sound.click();
              navigate("/words");
            }}
            className="btn-3d btn-white rounded-2xl px-4 py-3.5 font-extrabold uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          >
            <Icon name="book" size={16} />
            My Words
          </button>
          <button
            onClick={() => {
              sound.click();
              navigate("/mistakes");
            }}
            className="btn-3d btn-white rounded-2xl px-4 py-3.5 font-extrabold uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          >
            <Icon name="notebook" size={16} />
            Mistakes
          </button>
          <button
            onClick={() => {
              sound.click();
              navigate("/practice");
            }}
            className="btn-3d btn-white rounded-2xl px-4 py-3.5 font-extrabold uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          >
            <Icon name="brain" size={16} />
            Practice Hub
          </button>
          <button
            onClick={() => {
              sound.click();
              navigate("/shop");
            }}
            className="btn-3d btn-white rounded-2xl px-4 py-3.5 font-extrabold uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          >
            <Icon name="bag" size={16} />
            Shop
          </button>
        </div>
      </div>

      <motion.div
        className="relative max-w-md md:max-w-xl w-full mx-auto flex flex-col items-center gap-10 px-4 py-12"
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

      {!progress.goal && <OnboardingGoal onChoose={onSetGoal} />}
    </div>
  );
}
