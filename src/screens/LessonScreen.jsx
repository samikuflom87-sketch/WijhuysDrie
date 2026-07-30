import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import lessonsData from "../data/lessons.json";
import {
  generateLessonExercises,
  splitIntroWords,
  buildTeachingSequence,
  normalizeAnswer,
  makeBonusRound,
  makeFocusedSession,
} from "../lib/exercises";
import { randomMascot, randomLine } from "../data/mascots";
import { lessonAccentColor } from "../lib/lessonTheme";
import { randomCompliment } from "../data/compliments";
import { SPRING_BOUNCY } from "../lib/motion";
import { applyLessonComplete, getLevelInfo, HEART_REFILL_COST } from "../lib/storage";
import { checkBadges } from "../data/badges";
import { checkAccessories } from "../data/accessories";
import { pickReviewWords, allIntroducedWords, wordId } from "../lib/wordStats";
import TopBar from "../components/TopBar";
import AnswerBanner from "../components/AnswerBanner";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Mascot from "../components/Mascot";
import Confetti, { randomConfettiVariant } from "../components/Confetti";
import CelebrationMoment from "../components/CelebrationMoment";
import Flashcard from "../components/Flashcard";
import HintReveal from "../components/HintReveal";
import ChoiceExercise from "../components/exercises/ChoiceExercise";
import BuildSentenceExercise from "../components/exercises/BuildSentenceExercise";
import TapPairsExercise from "../components/exercises/TapPairsExercise";
import TypeAnswerExercise from "../components/exercises/TypeAnswerExercise";
import SpeakAnswerExercise from "../components/exercises/SpeakAnswerExercise";
import XPCounter from "../components/XPCounter";
import { useSound } from "../hooks/useSound";
import { useSettingsContext } from "../context/SettingsContext";
import { startAmbient, stopAmbient } from "../lib/ambientMusic";

const XP_PER_CORRECT = 10;
const XP_PER_REVIEW_CORRECT = 5;
const XP_PER_TEACH_QUIZ = 5;
const XP_PER_BONUS_CORRECT = 8;
const GOLDEN_BONUS_XP = 15;
const MAX_HEARTS = 5;
const REVIEW_SESSION_SIZE = 8;
const COMBO_BONUS_XP = 5;
const STREAK_MILESTONES = [7, 14, 30, 60, 100, 365];

function comboMessageFor(streak) {
  if (streak === 3) return "🔥 3 in a row! You're on fire!";
  if (streak === 5) return "🔥 5 in a row! Amazing!";
  if (streak === 8) return "🔥 8 in a row! Unstoppable!";
  if (streak === 12) return "🔥 12 in a row! Incredible!";
  if (streak >= 16 && streak % 8 === 0) return `🔥 ${streak} in a row! Legendary!`;
  return null;
}

const CHOICE_TYPES = new Set([
  "multiple-choice",
  "reverse-choice",
  "picture-choice",
  "listening",
  "odd-one-out",
]);

const PRACTICE_TITLES = {
  listening: "Listening Practice",
  speaking: "Speaking Practice",
  vocabulary: "Vocabulary Practice",
};
const PRACTICE_SESSION_SIZE = 10;

export default function LessonScreen({
  progress,
  wordStats,
  onCompleteLesson,
  onIntroduceWord,
  onRecordAttempt,
  onUnlockBadges,
  onUnlockAccessories,
  onAddXp,
  onSpendGems,
  isReview = false,
  practiceMode = null,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const sound = useSound();
  const { settings } = useSettingsContext();

  useEffect(() => {
    if (settings.musicOn) startAmbient();
    return () => stopAmbient();
  }, [settings.musicOn]);
  const lessonId = isReview ? "review" : Number(id);
  const allLessons = lessonsData.lessons;

  const lesson = useMemo(() => {
    if (isReview) {
      const words = pickReviewWords(wordStats, allLessons, REVIEW_SESSION_SIZE);
      return { id: "review", title: "Review Session", theme: null, words, sentences: [] };
    }
    if (practiceMode) {
      const words = allIntroducedWords(wordStats, allLessons);
      return { id: `practice-${practiceMode}`, title: PRACTICE_TITLES[practiceMode] || "Practice", theme: null, words, sentences: [] };
    }
    return allLessons.find((l) => l.id === lessonId) || null;
    // Intentionally excludes wordStats: the review/practice word list is
    // frozen for the whole session so mid-session stat updates don't
    // reshuffle it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, isReview, practiceMode]);

  const introWords = useMemo(() => {
    if (!lesson) return [];
    if (isReview || practiceMode) return [];
    return splitIntroWords(lesson, wordStats);
    // Intentionally excludes wordStats: this list must stay frozen while
    // the teaching phase walks through it, or marking a word introduced
    // mid-phase would shrink the list under the sequence pointer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, isReview, practiceMode]);

  // Interleaved "teach a couple, quiz on them" sequence instead of front-
  // loading every flashcard before any exercise.
  const teachingSequence = useMemo(
    () => (lesson ? buildTeachingSequence(lesson, introWords) : []),
    [lesson, introWords],
  );

  const exercises = useMemo(() => {
    if (!lesson) return [];
    if (practiceMode) return makeFocusedSession(lesson.words, practiceMode, PRACTICE_SESSION_SIZE);
    return generateLessonExercises(lesson, allLessons);
  }, [lesson, allLessons, practiceMode]);

  const [phase, setPhase] = useState(teachingSequence.length > 0 ? "teaching" : "practice");
  const [teachIndex, setTeachIndex] = useState(0);
  const [mainQueue, setMainQueue] = useState(exercises);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [practiceStats, setPracticeStats] = useState({ attempts: 0, correct: 0 });

  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xp, setXp] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [buildAnswer, setBuildAnswer] = useState([]);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [typeRetryUsed, setTypeRetryUsed] = useState(false);
  const [speakResult, setSpeakResult] = useState(null); // { transcript, matched } | null
  const [checked, setChecked] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [bannerStatus, setBannerStatus] = useState(null); // null | 'correct' | 'wrong'
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerCompliment, setBannerCompliment] = useState(null);
  const [shake, setShake] = useState(false);
  const [companion] = useState(() => randomMascot());
  const [newBadges, setNewBadges] = useState([]);
  const [comboStreak, setComboStreak] = useState(0);
  const [comboBonus, setComboBonus] = useState(0);
  const [celebrationVariant] = useState(() => randomConfettiVariant());
  const [anyHintUsedInLesson, setAnyHintUsedInLesson] = useState(false);
  const [newAccessories, setNewAccessories] = useState([]);
  const [beatBestScore, setBeatBestScore] = useState(false);
  const [isPerfectLesson, setIsPerfectLesson] = useState(false);
  const [goldenHit, setGoldenHit] = useState(false);
  const [bonusQueue, setBonusQueue] = useState([]);
  const [bonusOffered, setBonusOffered] = useState(false);
  const [preFailPhase, setPreFailPhase] = useState("practice");
  const [celebrationQueue, setCelebrationQueue] = useState([]);

  const totalToResolve = exercises.length;
  const teachStep = phase === "teaching" ? teachingSequence[teachIndex] : null;
  const current =
    phase === "review"
      ? reviewQueue[0]
      : phase === "bonus"
      ? bonusQueue[0]
      : phase === "teaching"
      ? teachStep?.kind === "quiz"
        ? teachStep.exercise
        : null
      : mainQueue[0];

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bold">Lesson not found.</p>
      </div>
    );
  }

  if (isReview && lesson.words.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center app-bg">
        <Mascot mascotId="nardos" mood="neutral" size={130} />
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          Nothing to review yet
        </h1>
        <p className="font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
          Complete a lesson first, and words you've practiced will show up here for review.
        </p>
        <Button variant="coral" className="w-full max-w-xs uppercase tracking-wide" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  if (practiceMode && exercises.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center app-bg">
        <Mascot mascotId="tesfa" mood="neutral" size={130} />
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          Not enough words yet
        </h1>
        <p className="font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
          Learn a few words in a lesson first, and this practice mode will have something to work with.
        </p>
        <Button variant="coral" className="w-full max-w-xs uppercase tracking-wide" onClick={() => navigate("/practice")}>
          Back to Practice Hub
        </Button>
      </div>
    );
  }

  function resetPerExerciseState() {
    setSelectedId(null);
    setBuildAnswer([]);
    setTypedAnswer("");
    setTypeRetryUsed(false);
    setSpeakResult(null);
    setChecked(false);
    setHintOpen(false);
    setHintUsed(false);
    setBannerStatus(null);
    setBannerCompliment(null);
    setComboBonus(0);
    setGoldenHit(false);
  }

  function loseHeart() {
    setHearts((h) => {
      const next = Math.max(0, h - 1);
      if (next === 0) {
        setPreFailPhase(phase);
        setTimeout(() => setPhase("failed"), 900);
      }
      return next;
    });
  }

  function recordWords(isCorrect) {
    for (const id of current.wordIds) {
      onRecordAttempt(id, isCorrect);
    }
  }

  function finishLesson(finalXp) {
    // Practice Hub sessions are supplementary, heart-free practice — bank
    // the XP directly and skip streak/badge/accuracy bookkeeping, the same
    // lightweight path the bonus round already uses.
    if (practiceMode) {
      onAddXp(finalXp);
      setPhase("complete");
      return;
    }
    const accuracyPct = practiceStats.attempts > 0 ? practiceStats.correct / practiceStats.attempts : 1;
    const wasPerfect = accuracyPct === 1 && !anyHintUsedInLesson && practiceStats.attempts > 0;
    const prevBest = progress.bestAccuracyByLesson[lessonId] ?? 0;
    const predicted = applyLessonComplete(progress, lessonId, finalXp, accuracyPct, wasPerfect);
    const { newlyUnlocked } = checkBadges(predicted, wordStats, allLessons);
    const { newlyUnlocked: newlyUnlockedAccessories } = checkAccessories(predicted, wordStats);
    onCompleteLesson(lessonId, finalXp, accuracyPct, wasPerfect);
    if (newlyUnlocked.length > 0) onUnlockBadges(newlyUnlocked.map((b) => b.id));
    if (newlyUnlockedAccessories.length > 0) {
      onUnlockAccessories(newlyUnlockedAccessories.map((a) => a.id));
    }
    setNewBadges(newlyUnlocked);
    setNewAccessories(newlyUnlockedAccessories);
    setBeatBestScore(prevBest > 0 && accuracyPct > prevBest);
    setIsPerfectLesson(wasPerfect);

    // Streak milestones and level-ups get their own full-screen "directed
    // moment" instead of being folded quietly into the summary — queued so
    // both can play in sequence on the rare visit that earns both at once.
    const crossedMilestoneValue = STREAK_MILESTONES.find(
      (m) => progress.streak < m && predicted.streak >= m,
    );
    const prevLevel = getLevelInfo(progress.xp).level;
    const newLevelInfo = getLevelInfo(predicted.xp);
    const leveledUp = newLevelInfo.level > prevLevel;

    const celebrations = [];
    if (crossedMilestoneValue) celebrations.push({ type: "streak", value: crossedMilestoneValue });
    if (leveledUp) celebrations.push({ type: "level", value: newLevelInfo.level, rank: newLevelInfo.rank });
    if (celebrations.length > 0) sound.fanfare();
    setCelebrationQueue(celebrations);
    setPhase(celebrations.length > 0 ? "celebrate" : "complete");
  }

  function advanceCelebration() {
    sound.click();
    const next = celebrationQueue.slice(1);
    setCelebrationQueue(next);
    if (next.length === 0) setPhase("complete");
  }

  function advance(xpDelta, isCorrect) {
    setXp((x) => x + xpDelta);
    resetPerExerciseState();

    if (phase === "teaching") {
      if (teachIndex + 1 >= teachingSequence.length) {
        setPhase("practice");
      } else {
        setTeachIndex((i) => i + 1);
      }
      return;
    }

    if (phase === "practice") {
      setPracticeStats((s) => ({ attempts: s.attempts + 1, correct: s.correct + (isCorrect ? 1 : 0) }));
      if (isCorrect) {
        setResolvedCount((c) => c + 1);
        const nextMain = mainQueue.slice(1);
        setMainQueue(nextMain);
        if (nextMain.length === 0) {
          if (reviewQueue.length > 0) setPhase("review");
          else finishLesson(xp + xpDelta);
        }
      } else {
        const retry = { ...current, id: `${current.id}-retry-${Date.now()}` };
        setReviewQueue((q) => [...q, retry]);
        const nextMain = mainQueue.slice(1);
        setMainQueue(nextMain);
        if (nextMain.length === 0) {
          setPhase("review");
        }
      }
    } else if (phase === "review") {
      const nextReview = reviewQueue.slice(1);
      if (isCorrect) {
        setResolvedCount((c) => c + 1);
        setReviewQueue(nextReview);
        if (nextReview.length === 0) finishLesson(xp + xpDelta);
      } else {
        const retry = { ...current, id: `${current.id}-retry-${Date.now()}` };
        setReviewQueue([...nextReview, retry]);
      }
    } else if (phase === "bonus") {
      // Bonus-round XP was already banked at lesson completion, so it's
      // credited directly to progress here rather than folded into
      // finishLesson (which would otherwise re-run streak/badge logic).
      onAddXp(xpDelta);
      const nextBonus = bonusQueue.slice(1);
      setBonusQueue(nextBonus);
      if (nextBonus.length === 0) setPhase("complete");
    }
  }

  function showBanner(isCorrect) {
    let line =
      current.type === "speak-answer"
        ? speakResult?.matched
          ? "🎤 Sounds right! Nice pronunciation."
          : "🎤 Nice try! Keep practicing that one — pronunciation-checking here is only a rough guess."
        : randomLine(companion, isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      const nextStreak = comboStreak + 1;
      setComboStreak(nextStreak);
      const comboMsg = comboMessageFor(nextStreak);
      if (comboMsg) {
        line = comboMsg;
        setComboBonus(COMBO_BONUS_XP);
      }
    } else {
      setComboStreak(0);
    }
    setBannerMessage(line);
    setBannerCompliment(isCorrect && current.type !== "speak-answer" ? randomCompliment() : null);
    setBannerStatus(isCorrect ? "correct" : "wrong");
    setLastCorrect(isCorrect);
    if (isCorrect) {
      sound.correct();
    } else {
      sound.wrong();
      setShake(true);
      setTimeout(() => setShake(false), 400);
      // Teaching-phase mini quizzes, the optional bonus round, and Practice
      // Hub sessions are all low-stakes: no heart lost for a word you were
      // just taught, an extra-credit question, or supplementary practice.
      if (phase !== "teaching" && phase !== "bonus" && !practiceMode) loseHeart();
    }
  }

  function handleCheck() {
    if (checked || !current) return;
    let isCorrect = false;
    if (CHOICE_TYPES.has(current.type)) {
      const opt = current.options.find((o) => o.id === selectedId);
      isCorrect = Boolean(opt?.isCorrect);
      if (isCorrect && current.isGoldenQuestion) setGoldenHit(true);
    } else if (current.type === "build-sentence") {
      isCorrect = JSON.stringify(buildAnswer) === JSON.stringify(current.correctTokens);
    } else if (current.type === "type-answer") {
      isCorrect = normalizeAnswer(typedAnswer) === normalizeAnswer(current.correctAnswer);
      // A typo isn't the same as not knowing the word — give one gentle
      // free retry before it counts as a real miss.
      if (!isCorrect && !typeRetryUsed) {
        setTypeRetryUsed(true);
        sound.wrong();
        setShake(true);
        setTimeout(() => setShake(false), 400);
        return;
      }
    } else if (current.type === "speak-answer") {
      // No browser can truly judge Tigrinya pronunciation, so a "miss" here
      // is never trustworthy enough to cost a heart or send the word to
      // review — it only changes which encouraging message is shown.
      isCorrect = true;
    }
    setChecked(true);
    recordWords(isCorrect);
    showBanner(isCorrect);
  }

  function handleBannerContinue() {
    const baseXp =
      bannerStatus !== "correct"
        ? 0
        : phase === "teaching"
        ? XP_PER_TEACH_QUIZ
        : phase === "review"
        ? XP_PER_REVIEW_CORRECT
        : phase === "bonus"
        ? XP_PER_BONUS_CORRECT
        : XP_PER_CORRECT;
    const goldenBonus = goldenHit ? GOLDEN_BONUS_XP : 0;
    const xpDelta = hintUsed ? 0 : baseXp + comboBonus + goldenBonus;
    advance(xpDelta, bannerStatus === "correct");
  }

  function handlePairsWrong() {
    setComboStreak(0);
    loseHeart();
  }

  function handlePairsDone() {
    for (const id of current.wordIds) onRecordAttempt(id, true);
    const nextStreak = comboStreak + 1;
    setComboStreak(nextStreak);
    const bonus = comboMessageFor(nextStreak) ? COMBO_BONUS_XP : 0;
    const baseXp = phase === "review" ? XP_PER_REVIEW_CORRECT : XP_PER_CORRECT;
    advance(hintUsed ? 0 : baseXp + bonus, true);
  }

  const canCheck = !current
    ? false
    : current.type === "build-sentence"
    ? buildAnswer.length === current.correctTokens.length
    : current.type === "type-answer"
    ? typedAnswer.trim().length > 0
    : current.type === "speak-answer"
    ? Boolean(speakResult)
    : Boolean(selectedId);

  const progressPct =
    phase === "teaching"
      ? (teachIndex / teachingSequence.length) * 100
      : totalToResolve > 0
      ? (resolvedCount / totalToResolve) * 100
      : 100;

  // --- Teaching: flashcard step ---
  if (phase === "teaching" && teachStep?.kind === "teach") {
    const word = teachStep.word;
    const teachStepsSoFar = teachingSequence
      .slice(0, teachIndex)
      .filter((s) => s.kind === "teach").length;
    return (
      <div className="min-h-screen flex flex-col app-bg">
        <TopBar progressPct={progressPct} hearts={MAX_HEARTS} combo={comboStreak} onExit={() => navigate("/")} accentColor={lessonAccentColor(lesson.theme)} />
        <div className="flex-1 max-w-md md:max-w-xl w-full mx-auto px-4 py-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <Flashcard
              key={word.tigrinya}
              word={word}
              index={teachStepsSoFar}
              total={introWords.length}
              onGotIt={() => {
                onIntroduceWord(wordId(lesson.id, word.tigrinya));
                advance(0, true);
              }}
            />
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (phase === "failed") {
    const canRefill = onSpendGems && progress.gems >= HEART_REFILL_COST;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center app-bg">
        <Mascot mascotId={companion.id} mood="neutral" size={140} />
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          Let's try that again
        </h1>
        <p className="font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
          {randomLine(companion, "outOfHearts")}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {canRefill && (
            <Button
              variant="yellow"
              className="w-full uppercase tracking-wide flex items-center justify-center gap-2"
              onClick={() => {
                onSpendGems(HEART_REFILL_COST);
                setHearts(MAX_HEARTS);
                setPhase(preFailPhase);
              }}
            >
              <Icon name="gem" size={18} />
              Refill hearts ({HEART_REFILL_COST} gems)
            </Button>
          )}
          <Button variant="coral" className="w-full uppercase tracking-wide" onClick={() => navigate(0)}>
            Try Again
          </Button>
          <Button variant="white" className="w-full uppercase tracking-wide" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "celebrate" && celebrationQueue.length > 0) {
    const current = celebrationQueue[0];
    return (
      <CelebrationMoment
        type={current.type}
        value={current.value}
        rank={current.rank}
        companion={companion}
        onContinue={advanceCelebration}
      />
    );
  }

  if (phase === "complete") {
    const message = randomLine(companion, "complete");
    const accuracyPct =
      practiceStats.attempts > 0 ? Math.round((practiceStats.correct / practiceStats.attempts) * 100) : 100;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center app-bg">
        <div className="relative">
          <Confetti count={30} variant={celebrationVariant} />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
          >
            <Mascot mascotId={companion.id} mood="excited" size={140} />
          </motion.div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="text-3xl font-extrabold"
          style={{ color: "var(--color-brand-ink)" }}
        >
          {isReview ? "Review Complete!" : practiceMode ? "Practice Complete!" : "Lesson Complete!"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="font-bold text-lg"
          style={{ color: "var(--color-brand-ink-light)" }}
        >
          {message}
        </motion.p>

        {isPerfectLesson && (
          <motion.p
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING_BOUNCY, delay: 0.3 }}
            className="text-sm font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-full flex items-center gap-1.5"
            style={{ background: "var(--color-brand-yellow-light)", color: "var(--color-brand-yellow-dark)" }}
          >
            <Icon name="seal" size={16} />
            Perfect! No hints, no mistakes.
          </motion.p>
        )}
        {beatBestScore && !isPerfectLesson && (
          <motion.p
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING_BOUNCY, delay: 0.3 }}
            className="text-sm font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-full flex items-center gap-1.5"
            style={{ background: "var(--color-brand-teal-light)", color: "var(--color-brand-teal-dark)" }}
          >
            <Icon name="medal" size={16} />
            New personal best for this lesson!
          </motion.p>
        )}

        <div className="flex gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...SPRING_BOUNCY, delay: 0.4 }}
            className="rounded-2xl px-5 py-4 flex flex-col items-center card-soft"
          >
            <span className="text-2xl font-extrabold" style={{ color: "var(--color-brand-yellow-dark)" }}>
              +<XPCounter value={xp} />
            </span>
            <span className="text-xs font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
              XP
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...SPRING_BOUNCY, delay: 0.52 }}
            className="rounded-2xl px-5 py-4 flex flex-col items-center card-soft"
          >
            <span className="text-2xl font-extrabold" style={{ color: "var(--color-brand-teal-dark)" }}>
              {accuracyPct}%
            </span>
            <span className="text-xs font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
              Accuracy
            </span>
          </motion.div>
        </div>

        {!isReview && !practiceMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING_BOUNCY, delay: 0.66 }}
            className="flex items-center gap-2 font-bold"
            style={{ color: "var(--color-brand-yellow-dark)" }}
          >
            <Icon name="crown" size={20} />
            <span>Crown earned!</span>
          </motion.div>
        )}

        {(newBadges.length > 0 || newAccessories.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.3 }}
            className="flex flex-col items-center gap-1 rounded-2xl px-5 py-3 card-soft"
            style={{ background: "var(--color-brand-yellow-light)" }}
          >
            <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--color-brand-ink-light)" }}>
              {newBadges.length > 0 ? "New badge unlocked" : "New mascot accessory unlocked"}
            </p>
            {newBadges.map((b) => (
              <p key={b.id} className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
                {b.icon} {b.name}
              </p>
            ))}
            {newAccessories.map((a) => (
              <p key={a.id} className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
                {a.icon} {a.name}
              </p>
            ))}
          </motion.div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {!bonusOffered && !practiceMode && (
            <Button
              variant="yellow"
              className="w-full uppercase tracking-wide flex items-center justify-center gap-2"
              onClick={() => {
                setBonusOffered(true);
                setBonusQueue(makeBonusRound(lesson));
                setPhase("bonus");
              }}
            >
              <Icon name="gift" size={18} />
              Bonus round (+XP)
            </Button>
          )}
          <Button
            variant="coral"
            className="w-full uppercase tracking-wide"
            onClick={() => navigate(practiceMode ? "/practice" : "/")}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col app-bg">
      <TopBar progressPct={progressPct} hearts={hearts} combo={comboStreak} accentColor={lessonAccentColor(lesson.theme)} />

      {phase === "teaching" && (
        <div className="max-w-md md:max-w-xl w-full mx-auto px-4 pt-3">
          <p className="text-xs font-extrabold uppercase tracking-wide text-center" style={{ color: "var(--color-brand-teal-dark)" }}>
            Quick check — no hearts at risk
          </p>
        </div>
      )}

      {phase === "review" && (
        <div className="max-w-md md:max-w-xl w-full mx-auto px-4 pt-3">
          <p className="text-xs font-extrabold uppercase tracking-wide text-center" style={{ color: "var(--color-brand-coral-dark)" }}>
            Review — let's lock these in
          </p>
        </div>
      )}

      {phase === "bonus" && (
        <div className="max-w-md md:max-w-xl w-full mx-auto px-4 pt-3">
          <p className="text-xs font-extrabold uppercase tracking-wide text-center flex items-center justify-center gap-1.5" style={{ color: "var(--color-brand-yellow-dark)" }}>
            <Icon name="gift" size={14} />
            Bonus round — no hearts at risk
          </p>
        </div>
      )}

      <div className="flex-1 max-w-md md:max-w-xl w-full mx-auto px-4 py-6 pb-40">
        <div className="flex justify-end mb-2">
          <HintReveal
            word={current.hintWord}
            open={hintOpen}
            onToggle={() => {
              if (checked) return;
              setHintOpen((o) => !o);
              setHintUsed(true);
              setAnyHintUsedInLesson(true);
            }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={current.id}>
            {CHOICE_TYPES.has(current.type) && (
              <ChoiceExercise
                exercise={current}
                selectedId={selectedId}
                checked={checked}
                onSelect={(optId) => !checked && setSelectedId(optId)}
                shake={shake}
              />
            )}
            {current.type === "build-sentence" && (
              <BuildSentenceExercise
                exercise={current}
                checked={checked}
                onChange={setBuildAnswer}
                shake={shake}
              />
            )}
            {current.type === "type-answer" && (
              <TypeAnswerExercise
                exercise={current}
                checked={checked}
                isCorrect={lastCorrect}
                onChange={setTypedAnswer}
                shake={shake}
                showRetryHint={typeRetryUsed && !checked}
              />
            )}
            {current.type === "tap-pairs" && (
              <TapPairsExercise
                exercise={current}
                onWrong={handlePairsWrong}
                onDone={handlePairsDone}
              />
            )}
            {current.type === "speak-answer" && (
              <SpeakAnswerExercise
                exercise={current}
                checked={checked}
                onResult={setSpeakResult}
                shake={shake}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!bannerStatus && (
        <div className="fixed inset-x-0 z-20 pointer-events-none" style={{ bottom: current.type === "tap-pairs" ? 16 : 96 }}>
          <div className="max-w-md md:max-w-xl mx-auto relative h-0">
            <motion.div
              className="absolute right-4 bottom-0"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <Mascot mascotId={companion.id} mood="neutral" size={56} />
            </motion.div>
          </div>
        </div>
      )}

      {current.type !== "tap-pairs" && !bannerStatus && (
        <div className="fixed bottom-0 left-0 right-0 bg-brand-surface px-4 py-4 border-t-2" style={{ borderColor: "var(--color-brand-line)" }}>
          <div className="max-w-md md:max-w-xl mx-auto">
            <Button
              variant="coral"
              className="w-full uppercase tracking-wide"
              disabled={!canCheck}
              onClick={handleCheck}
            >
              Check
            </Button>
          </div>
        </div>
      )}

      <AnswerBanner
        status={bannerStatus}
        correctText={current.correctText}
        mascotId={companion.id}
        message={
          hintUsed && bannerStatus === "correct"
            ? `${bannerMessage} (no XP — hint used)`
            : goldenHit && bannerStatus === "correct"
            ? `${bannerMessage} ✨ +${GOLDEN_BONUS_XP} bonus XP!`
            : bannerMessage
        }
        compliment={bannerCompliment}
        onContinue={handleBannerContinue}
      />
    </div>
  );
}
