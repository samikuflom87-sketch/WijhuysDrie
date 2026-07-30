import { AnimatePresence, motion } from "framer-motion";
import SpeakerButton from "./SpeakerButton";
import { useSound } from "../hooks/useSound";

export default function HintReveal({ word, open, onToggle }) {
  const sound = useSound();
  if (!word) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => {
          sound.click();
          onToggle();
        }}
        aria-label="Show hint"
        className="btn-3d rounded-full flex items-center justify-center font-extrabold"
        style={{
          width: 36,
          height: 36,
          background: "var(--color-brand-yellow)",
          boxShadow: "0 2px 6px var(--color-brand-shadow)",
          color: "#2A2019",
        }}
      >
        ?
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="rounded-2xl px-4 py-3 flex items-center gap-2"
            style={{ background: "var(--color-brand-yellow-light)" }}
          >
            <div>
              <p className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
                {word.tigrinya}
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
                {word.english}
              </p>
            </div>
            <SpeakerButton src={word.audio} text={word.tigrinya} size={18} className="text-brand-coral" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
