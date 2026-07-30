import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import lessonsData from "../data/lessons.json";
import { wordId, masteryStars } from "../lib/wordStats";
import Illustration from "../components/Illustration";
import SpeakerButton from "../components/SpeakerButton";
import { useSound } from "../hooks/useSound";
import { popIn } from "../lib/motion";

function Stars({ count }) {
  return (
    <span aria-label={`${count} of 3 mastery stars`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          style={{ color: n <= count ? "var(--color-brand-yellow-dark)" : "var(--color-brand-line)" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function WordCollection({ wordStats }) {
  const navigate = useNavigate();
  const sound = useSound();
  const lessons = lessonsData.lessons;

  const collected = [];
  for (const lesson of lessons) {
    for (const word of lesson.words) {
      const id = wordId(lesson.id, word.tigrinya);
      const stars = masteryStars(wordStats, id);
      if (stars === 0) continue;
      collected.push({ ...word, lessonTitle: lesson.title, stars });
    }
  }

  return (
    <div className="min-h-screen flex flex-col app-bg">
      <header
        className="sticky top-0 z-10"
        style={{ background: "linear-gradient(135deg, #C25A3D, var(--color-brand-coral))" }}
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
          <h1 className="font-display font-extrabold text-lg text-white">My Words</h1>
        </div>
      </header>

      <div className="max-w-md md:max-w-xl w-full mx-auto px-4 py-6">
        {collected.length === 0 ? (
          <p className="font-bold text-center mt-12" style={{ color: "var(--color-brand-ink-light)" }}>
            Learn your first words in a lesson and they'll show up here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {collected.map((word, i) => (
              <motion.div
                key={`${word.lessonTitle}-${word.tigrinya}`}
                initial={popIn.initial}
                animate={popIn.animate}
                transition={{ ...popIn.transition, delay: Math.min(i * 0.02, 0.4) }}
                className="rounded-2xl p-3 flex flex-col items-center gap-1.5 card-soft"
              >
                {word.image && (
                  <div
                    className="rounded-xl p-2 flex items-center justify-center"
                    style={{ background: "var(--color-brand-teal-light)" }}
                  >
                    <Illustration name={word.image} size={44} />
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <p className="font-extrabold text-sm text-center" style={{ color: "var(--color-brand-ink)" }}>
                    {word.tigrinya}
                  </p>
                  <SpeakerButton text={word.tigrinya} src={word.audio} size={14} className="text-brand-coral" />
                </div>
                <p className="text-xs font-bold text-center" style={{ color: "var(--color-brand-ink-light)" }}>
                  {word.english}
                </p>
                <Stars count={word.stars} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
