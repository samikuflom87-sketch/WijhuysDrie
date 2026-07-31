import { motion } from "framer-motion";
import { useSound } from "../hooks/useSound";
import { popIn } from "../lib/motion";
import Icon from "./Icon";

export const GOALS = [
  { id: "travel", icon: "plane", label: "Travel & culture", blurb: "Perfect for your next trip." },
  { id: "family", icon: "family", label: "Family & roots", blurb: "Great for staying close to family." },
  { id: "fun", icon: "smile", label: "Just for fun", blurb: "Learning should be enjoyable." },
  { id: "explore", icon: "compass", label: "Just exploring", blurb: "Take your time, no pressure." },
];

export function goalBlurb(goalId) {
  return GOALS.find((g) => g.id === goalId)?.blurb || "";
}

export default function OnboardingGoal({ onChoose }) {
  const sound = useSound();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Why are you learning Tigrinya?"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(20, 12, 8, 0.5)" }}
    >
      <motion.div
        initial={popIn.initial}
        animate={popIn.animate}
        transition={popIn.transition}
        className="rounded-3xl p-6 max-w-xs w-full card-soft"
        style={{ background: "var(--color-brand-surface)" }}
      >
        <h2 className="text-lg font-extrabold text-center mb-1" style={{ color: "var(--color-brand-ink)" }}>
          Why are you learning Tigrinya?
        </h2>
        <p className="text-sm font-bold text-center mb-4" style={{ color: "var(--color-brand-ink-light)" }}>
          This just helps us tailor a few messages for you.
        </p>
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                sound.click();
                onChoose(g.id);
              }}
              className="btn-3d btn-white rounded-2xl px-4 py-3 flex items-center gap-3 text-left font-extrabold"
              style={{ color: "var(--color-brand-ink)" }}
            >
              <span
                className="icon-badge flex items-center justify-center rounded-full shrink-0"
                style={{ width: 36, height: 36, "--badge-tint": "var(--color-brand-coral-light)", color: "var(--color-brand-coral-dark)" }}
              >
                <Icon name={g.icon} size={18} />
              </span>
              {g.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
