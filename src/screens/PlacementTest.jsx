import { useState } from "react";
import { useNavigate } from "react-router-dom";
import lessonsData from "../data/lessons.json";
import { makePlacementQuestions } from "../lib/exercises";
import ChoiceExercise from "../components/exercises/ChoiceExercise";
import Button from "../components/Button";
import Mascot from "../components/Mascot";
import { useSound } from "../hooks/useSound";

const QUESTION_COUNT = 8;

export default function PlacementTest({ onFinish }) {
  const navigate = useNavigate();
  const sound = useSound();
  const lessons = lessonsData.lessons;
  const [questions] = useState(() => makePlacementQuestions(lessons, QUESTION_COUNT));
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];

  function handleCheck() {
    if (checked || !current) return;
    const opt = current.options.find((o) => o.id === selectedId);
    const isCorrect = Boolean(opt?.isCorrect);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      sound.correct();
    } else {
      sound.wrong();
    }
    setChecked(true);
  }

  function handleNext() {
    setSelectedId(null);
    setChecked(false);
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center app-bg">
        <p className="font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
          Not enough content yet for a placement test.
        </p>
        <Button variant="coral" className="w-full max-w-xs uppercase tracking-wide" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </div>
    );
  }

  if (done) {
    const pct = correctCount / questions.length;
    const unlockCount = Math.round(pct * lessons.length);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center app-bg">
        <Mascot mascotId="zaki" mood="excited" size={130} />
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          Nice work!
        </h1>
        <p className="font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
          You got {correctCount} of {questions.length} right.{" "}
          {unlockCount > 0
            ? `We'll unlock the first ${unlockCount} lesson${unlockCount === 1 ? "" : "s"} for you — you can always revisit them any time.`
            : "Let's start from the very beginning — that's the best way to build a solid base."}
        </p>
        <Button
          variant="coral"
          className="w-full max-w-xs uppercase tracking-wide"
          onClick={() => {
            onFinish(unlockCount);
            navigate("/");
          }}
        >
          Start learning
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col app-bg">
      <div className="max-w-md md:max-w-xl w-full mx-auto px-4 pt-6 pb-2">
        <p
          className="text-xs font-extrabold uppercase tracking-wide text-center"
          style={{ color: "var(--color-brand-teal-dark)" }}
        >
          Placement test — question {index + 1} of {questions.length}
        </p>
      </div>
      <div className="flex-1 max-w-md md:max-w-xl w-full mx-auto px-4 py-6">
        <ChoiceExercise
          exercise={current}
          selectedId={selectedId}
          checked={checked}
          onSelect={(id) => !checked && setSelectedId(id)}
          shake={false}
        />
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 bg-brand-surface px-4 py-4 border-t-2"
        style={{ borderColor: "var(--color-brand-line)" }}
      >
        <div className="max-w-md md:max-w-xl mx-auto">
          <Button
            variant="coral"
            className="w-full uppercase tracking-wide"
            disabled={!checked && !selectedId}
            onClick={checked ? handleNext : handleCheck}
          >
            {checked ? (index + 1 >= questions.length ? "See results" : "Continue") : "Check"}
          </Button>
        </div>
      </div>
    </div>
  );
}
