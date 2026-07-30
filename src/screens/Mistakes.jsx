import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import lessonsData from "../data/lessons.json";
import { wordId } from "../lib/wordStats";
import Illustration from "../components/Illustration";
import SpeakerButton from "../components/SpeakerButton";
import Mascot from "../components/Mascot";
import { useSound } from "../hooks/useSound";
import { riseIn } from "../lib/motion";

// Every word ever practiced, worst accuracy first — a persistent, browsable
// version of the data that also feeds the "Review words you've missed"
// session, so a learner can see exactly what's shaky without starting a
// review round.
function collectMistakes(wordStats, lessons) {
  const rows = [];
  for (const lesson of lessons) {
    for (const word of lesson.words) {
      const id = wordId(lesson.id, word.tigrinya);
      const entry = wordStats[id];
      if (!entry || !entry.introduced || entry.seen === 0) continue;
      rows.push({ ...word, lessonTitle: lesson.title, seen: entry.seen, correct: entry.correct, accuracy: entry.correct / entry.seen });
    }
  }
  rows.sort((a, b) => a.accuracy - b.accuracy);
  return rows;
}

export default function Mistakes({ wordStats }) {
  const navigate = useNavigate();
  const sound = useSound();
  const rows = collectMistakes(wordStats, lessonsData.lessons);

  return (
    <div className="min-h-screen flex flex-col app-bg">
      <header
        className="sticky top-0 z-10"
        style={{ background: "linear-gradient(135deg, #FF8163, var(--color-brand-coral))" }}
      >
        <div className="max-w-md md:max-w-xl mx-auto flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => {
              sound.click();
              navigate("/");
            }}
            aria-label="Back"
            className="text-2xl font-bold text-white"
          >
            ✕
          </button>
          <h1 className="font-display font-extrabold text-lg text-white">Mistakes Notebook</h1>
        </div>
      </header>

      <div className="max-w-md md:max-w-xl w-full mx-auto px-4 py-6 flex flex-col gap-3">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 mt-12 text-center">
            <Mascot mascotId="bemnet" mood="neutral" size={110} />
            <p className="font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
              Nothing tracked yet — practice a lesson and any word you've been quizzed on shows up
              here, worst accuracy first.
            </p>
          </div>
        ) : (
          rows.map((word, i) => {
            const pct = Math.round(word.accuracy * 100);
            const color =
              pct >= 85 ? "var(--color-brand-teal-dark)" : pct >= 60 ? "var(--color-brand-yellow-dark)" : "var(--color-brand-coral-dark)";
            return (
              <motion.div
                key={`${word.lessonTitle}-${word.tigrinya}`}
                initial={riseIn.initial}
                animate={riseIn.animate}
                transition={{ ...riseIn.transition, delay: Math.min(i * 0.02, 0.4) }}
                className="rounded-2xl p-3 flex items-center gap-3 card-soft"
              >
                {word.image && (
                  <div
                    className="rounded-xl p-2 flex items-center justify-center shrink-0"
                    style={{ background: "var(--color-brand-teal-light)" }}
                  >
                    <Illustration name={word.image} size={36} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-extrabold text-sm truncate" style={{ color: "var(--color-brand-ink)" }}>
                      {word.tigrinya}
                    </p>
                    <SpeakerButton text={word.tigrinya} src={word.audio} size={14} className="text-brand-coral" />
                  </div>
                  <p className="text-xs font-bold truncate" style={{ color: "var(--color-brand-ink-light)" }}>
                    {word.english} · {word.lessonTitle}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-sm" style={{ color }}>
                    {pct}%
                  </p>
                  <p className="text-xs font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
                    {word.correct}/{word.seen}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
