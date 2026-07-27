import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BADGES } from "../data/badges";

export default function Achievements({ progress }) {
  const navigate = useNavigate();
  const unlockedCount = progress.unlockedBadges.length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-brand-cream)" }}>
      <header
        className="sticky top-0 z-10"
        style={{ background: "linear-gradient(135deg, #FF8163, var(--color-brand-coral))" }}
      >
        <div className="max-w-md mx-auto flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => navigate("/")}
            aria-label="Back"
            className="text-2xl font-bold text-white"
          >
            ✕
          </button>
          <h1 className="font-display font-extrabold text-lg text-white">Achievements</h1>
        </div>
      </header>

      <div className="max-w-md w-full mx-auto px-4 py-6 flex flex-col gap-3">
        <p className="text-sm font-bold text-center" style={{ color: "var(--color-brand-ink-light)" }}>
          {unlockedCount} of {BADGES.length} unlocked
        </p>

        {BADGES.map((badge, i) => {
          const unlocked = progress.unlockedBadges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: unlocked ? "white" : "#F3E9DA",
                border: `2px solid ${unlocked ? "var(--color-brand-yellow)" : "var(--color-brand-line)"}`,
                opacity: unlocked ? 1 : 0.65,
              }}
            >
              <span className="text-3xl">{unlocked ? badge.icon : "🔒"}</span>
              <div>
                <p className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
                  {badge.name}
                </p>
                <p className="text-sm font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
                  {badge.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
