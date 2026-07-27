import { motion } from "framer-motion";
import Illustration from "./Illustration";
import SpeakerButton from "./SpeakerButton";
import Button from "./Button";

export default function Flashcard({ word, index, total, onGotIt }) {
  return (
    <motion.div
      key={word.tigrinya}
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <p className="text-sm font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
        New word {index + 1} of {total}
      </p>

      {word.image && (
        <div
          className="rounded-3xl p-5 flex items-center justify-center"
          style={{ background: "var(--color-brand-teal-light)" }}
        >
          <Illustration name={word.image} size={110} />
        </div>
      )}

      <div className="flex items-center gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          {word.tigrinya}
        </h1>
        {word.audio && <SpeakerButton src={word.audio} size={26} className="text-brand-coral" />}
      </div>

      <p className="text-lg font-bold" style={{ color: "var(--color-brand-teal-dark)" }}>
        {word.english}
      </p>

      {word.note && (
        <p
          className="text-sm font-bold max-w-xs rounded-2xl px-4 py-3"
          style={{ background: "var(--color-brand-yellow-light)", color: "var(--color-brand-ink)" }}
        >
          💡 {word.note}
        </p>
      )}

      <Button variant="coral" className="w-full max-w-xs uppercase tracking-wide" onClick={onGotIt}>
        Got it
      </Button>
    </motion.div>
  );
}
