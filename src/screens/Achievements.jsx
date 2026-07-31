import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BADGES } from "../data/badges";
import { useSound } from "../hooks/useSound";
import StreakCalendar from "../components/StreakCalendar";
import ShareCardButton from "../components/ShareCard";
import Icon from "../components/Icon";

export default function Achievements({ progress }) {
  const navigate = useNavigate();
  const sound = useSound();
  const unlockedCount = progress.unlockedBadges.length;

  return (
    <div className="min-h-screen flex flex-col app-bg">
      <header className="header-premium sticky top-0 z-10">
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
          <h1 className="font-display font-extrabold text-lg text-white">Achievements</h1>
        </div>
      </header>

      <div className="max-w-md md:max-w-xl w-full mx-auto px-4 py-6 flex flex-col gap-3">
        <StreakCalendar activeDates={progress.activeDates} />

        <ShareCardButton progress={progress} />

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
                background: "var(--color-brand-surface)",
                border: `2px solid ${unlocked ? "var(--color-brand-yellow)" : "var(--color-brand-line)"}`,
                boxShadow: unlocked ? "0 2px 10px rgba(140, 97, 27, 0.18)" : "none",
                opacity: unlocked ? 1 : 0.65,
              }}
            >
              <span
                className="flex items-center justify-center rounded-full shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  background: unlocked ? "var(--color-brand-yellow-light)" : "var(--color-brand-line)",
                  color: unlocked ? "var(--color-brand-yellow-dark)" : "var(--color-brand-ink-light)",
                }}
              >
                <Icon name={unlocked ? badge.icon : "lock"} size={22} />
              </span>
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
