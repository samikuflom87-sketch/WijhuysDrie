import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DAILY_QUESTS, WEEKLY_QUESTS } from "../data/quests";
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";
import { useSound } from "../hooks/useSound";

function QuestRow({ quest, progress, onClaim, i }) {
  const claimedKey = quest.scope === "daily" ? "dailyQuestClaimed" : "weeklyQuestClaimed";
  const claimed = progress[claimedKey].includes(quest.id);
  const value = quest.progress(progress);
  const done = value >= quest.target;
  const pct = Math.min(100, (value / quest.target) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: i * 0.03 }}
      className="rounded-2xl p-4 flex flex-col gap-2 card-soft"
      style={{ opacity: claimed ? 0.6 : 1 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{quest.icon}</span>
          <p className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
            {quest.name}
          </p>
        </div>
        <span className="text-xs font-bold shrink-0" style={{ color: "var(--color-brand-ink-light)" }}>
          {Math.min(value, quest.target)} / {quest.target}
        </span>
      </div>
      <ProgressBar value={pct} />
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold" style={{ color: "var(--color-brand-yellow-dark)" }}>
          💎 {quest.reward} gems
        </span>
        {claimed ? (
          <span className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--color-brand-teal-dark)" }}>
            Claimed ✓
          </span>
        ) : (
          <Button
            variant={done ? "yellow" : "white"}
            className="!py-2 !px-4 text-xs uppercase tracking-wide"
            disabled={!done}
            onClick={() => onClaim(quest.id, quest.scope)}
          >
            Claim
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default function Quests({ progress, onClaimQuest }) {
  const navigate = useNavigate();
  const sound = useSound();

  return (
    <div className="min-h-screen flex flex-col app-bg">
      <header
        className="sticky top-0 z-10"
        style={{ background: "linear-gradient(135deg, #FF8163, var(--color-brand-coral))" }}
      >
        <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
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
            <h1 className="font-display font-extrabold text-lg text-white">Quests</h1>
          </div>
          <span className="text-white font-extrabold text-sm">💎 {progress.gems}</span>
        </div>
      </header>

      <div className="max-w-md md:max-w-xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: "var(--color-brand-ink-light)" }}>
            Daily
          </h2>
          {DAILY_QUESTS.map((quest, i) => (
            <QuestRow key={quest.id} quest={quest} progress={progress} onClaim={onClaimQuest} i={i} />
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: "var(--color-brand-ink-light)" }}>
            Weekly
          </h2>
          {WEEKLY_QUESTS.map((quest, i) => (
            <QuestRow key={quest.id} quest={quest} progress={progress} onClaim={onClaimQuest} i={i} />
          ))}
        </section>
      </div>
    </div>
  );
}
