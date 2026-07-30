import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { useSound } from "../hooks/useSound";
import { popIn } from "../lib/motion";

const MODES = [
  { id: "listening", icon: "headphones", label: "Listening", blurb: "Hear a word, pick what it means." },
  { id: "speaking", icon: "mic", label: "Speaking", blurb: "Say taught words out loud (beta)." },
  { id: "vocabulary", icon: "brain", label: "Vocabulary", blurb: "Quick-fire meaning drills." },
];

export default function PracticeHub({ hasReviewWords }) {
  const navigate = useNavigate();
  const sound = useSound();

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
          <h1 className="font-display font-extrabold text-lg text-white">Practice Hub</h1>
        </div>
      </header>

      <div className="max-w-md md:max-w-xl w-full mx-auto px-4 py-6 flex flex-col gap-3">
        <p className="text-sm font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
          Targeted practice on words you've already been taught — no hearts at risk.
        </p>

        {hasReviewWords && (
          <button
            onClick={() => {
              sound.click();
              navigate("/review");
            }}
            className="btn-3d btn-teal rounded-2xl px-4 py-3.5 font-extrabold uppercase tracking-wide text-left flex items-center gap-2"
          >
            <Icon name="refresh" size={18} />
            Quick Review — your weakest words
          </button>
        )}

        {MODES.map((mode, i) => (
          <motion.button
            key={mode.id}
            initial={popIn.initial}
            animate={popIn.animate}
            transition={{ ...popIn.transition, delay: i * 0.05 }}
            onClick={() => {
              sound.click();
              navigate(`/practice/${mode.id}`);
            }}
            className="rounded-2xl p-4 flex items-center gap-4 card-soft text-left"
          >
            <span
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 48, height: 48, background: "var(--color-brand-teal-light)", color: "var(--color-brand-teal-dark)" }}
            >
              <Icon name={mode.icon} size={24} />
            </span>
            <div>
              <p className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
                {mode.label}
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
                {mode.blurb}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
