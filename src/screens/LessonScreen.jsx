import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import lessonsData from "../data/lessons.json";
import { generateLessonExercises } from "../lib/exercises";
import { randomMascot, randomLine } from "../data/mascots";
import TopBar from "../components/TopBar";
import AnswerBanner from "../components/AnswerBanner";
import Button from "../components/Button";
import Mascot from "../components/Mascot";
import Confetti from "../components/Confetti";
import ChoiceExercise from "../components/exercises/ChoiceExercise";
import BuildSentenceExercise from "../components/exercises/BuildSentenceExercise";
import TapPairsExercise from "../components/exercises/TapPairsExercise";
import XPCounter from "../components/XPCounter";

const XP_PER_CORRECT = 10;
const MAX_HEARTS = 5;

const CHOICE_TYPES = new Set(["multiple-choice", "reverse-choice", "picture-choice"]);

export default function LessonScreen({ onCompleteLesson }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const lessonId = Number(id);
  const lesson = lessonsData.lessons.find((l) => l.id === lessonId);

  const exercises = useMemo(
    () => (lesson ? generateLessonExercises(lesson) : []),
    [lesson],
  );

  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xp, setXp] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [buildAnswer, setBuildAnswer] = useState([]);
  const [checked, setChecked] = useState(false);
  const [bannerStatus, setBannerStatus] = useState(null); // null | 'correct' | 'wrong'
  const [bannerMessage, setBannerMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [phase, setPhase] = useState("playing"); // playing | failed | complete
  const [companion] = useState(() => randomMascot());

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bold">Lesson not found.</p>
      </div>
    );
  }

  const current = exercises[index];
  const progressPct = (index / exercises.length) * 100;

  function loseHeart() {
    setHearts((h) => {
      const next = Math.max(0, h - 1);
      if (next === 0) {
        setTimeout(() => setPhase("failed"), 900);
      }
      return next;
    });
  }

  function finishLesson(finalXp) {
    onCompleteLesson(lessonId, finalXp);
    setPhase("complete");
  }

  function advance(xpDelta) {
    const newXp = xp + xpDelta;
    setXp(newXp);
    setSelectedId(null);
    setBuildAnswer([]);
    setChecked(false);
    setBannerStatus(null);

    if (index + 1 >= exercises.length) {
      finishLesson(newXp);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function showBanner(isCorrect) {
    const line = randomLine(companion, isCorrect ? "correct" : "wrong");
    setBannerMessage(line);
    setBannerStatus(isCorrect ? "correct" : "wrong");
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      loseHeart();
    }
  }

  function handleCheck() {
    if (checked) return;
    let isCorrect = false;
    if (CHOICE_TYPES.has(current.type)) {
      const opt = current.options.find((o) => o.id === selectedId);
      isCorrect = Boolean(opt?.isCorrect);
    } else if (current.type === "build-sentence") {
      isCorrect = JSON.stringify(buildAnswer) === JSON.stringify(current.correctTokens);
    }
    setChecked(true);
    showBanner(isCorrect);
  }

  function handleBannerContinue() {
    advance(bannerStatus === "correct" ? XP_PER_CORRECT : 0);
  }

  function handlePairsWrong() {
    loseHeart();
  }

  function handlePairsDone() {
    advance(XP_PER_CORRECT);
  }

  const canCheck =
    current?.type === "build-sentence"
      ? buildAnswer.length === current.correctTokens.length
      : Boolean(selectedId);

  if (phase === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ background: "var(--color-brand-cream)" }}>
        <Mascot mascotId={companion.id} mood="sad" size={140} />
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          Out of hearts!
        </h1>
        <p className="font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
          {randomLine(companion, "wrong")}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
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

  if (phase === "complete") {
    const message = randomLine(companion, "complete");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ background: "var(--color-brand-cream)" }}>
        <div className="relative">
          <Confetti count={30} />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
          >
            <Mascot mascotId={companion.id} mood="excited" size={150} />
          </motion.div>
        </div>
        <h1 className="text-3xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          Lesson Complete!
        </h1>
        <p className="font-bold text-lg" style={{ color: "var(--color-brand-ink-light)" }}>
          {message}
        </p>
        <div className="bg-white rounded-2xl border-2 px-8 py-5 flex items-center gap-3" style={{ borderColor: "var(--color-brand-line)" }}>
          <span className="text-2xl">⭐</span>
          <span className="text-3xl font-extrabold" style={{ color: "var(--color-brand-yellow-dark)" }}>
            +<XPCounter value={xp} />
          </span>
          <span className="font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
            XP
          </span>
        </div>
        <div className="flex items-center gap-2 font-bold" style={{ color: "var(--color-brand-yellow-dark)" }}>
          <span>👑</span>
          <span>Crown earned!</span>
        </div>
        <Button variant="coral" className="w-full max-w-xs uppercase tracking-wide" onClick={() => navigate("/")}>
          Continue
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-brand-cream)" }}>
      <TopBar progressPct={progressPct} hearts={hearts} />

      <div className="flex-1 max-w-md w-full mx-auto px-4 py-8 pb-40">
        <AnimatePresence mode="wait">
          <motion.div key={current.id}>
            {CHOICE_TYPES.has(current.type) && (
              <ChoiceExercise
                exercise={current}
                selectedId={selectedId}
                checked={checked}
                onSelect={(id) => !checked && setSelectedId(id)}
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
            {current.type === "tap-pairs" && (
              <TapPairsExercise
                exercise={current}
                onWrong={handlePairsWrong}
                onDone={handlePairsDone}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!bannerStatus && (
        <div className="fixed inset-x-0 z-20 pointer-events-none" style={{ bottom: current.type === "tap-pairs" ? 16 : 96 }}>
          <div className="max-w-md mx-auto relative h-0">
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
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 border-t-2" style={{ borderColor: "var(--color-brand-line)" }}>
          <div className="max-w-md mx-auto">
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
        message={bannerMessage}
        onContinue={handleBannerContinue}
      />
    </div>
  );
}
