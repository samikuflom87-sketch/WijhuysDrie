import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "../../hooks/useSound";

export default function BuildSentenceExercise({ exercise, checked, onChange, shake }) {
  const sound = useSound();
  const [selected, setSelected] = useState([]); // array of tile objects in chosen order

  useEffect(() => {
    setSelected([]);
  }, [exercise.id]);

  useEffect(() => {
    onChange(selected.map((t) => t.text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const usedIds = new Set(selected.map((t) => t.id));
  const bank = exercise.tiles.filter((t) => !usedIds.has(t.id));

  function addTile(tile) {
    if (checked) return;
    sound.click();
    setSelected((prev) => [...prev, tile]);
  }

  function removeTile(tile) {
    if (checked) return;
    sound.click();
    setSelected((prev) => prev.filter((t) => t.id !== tile.id));
  }

  const isCorrect =
    checked &&
    JSON.stringify(selected.map((t) => t.text)) === JSON.stringify(exercise.correctTokens);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={shake ? { opacity: 1, x: [0, -10, 10, -6, 6, 0] } : { opacity: 1, x: 0 }}
      transition={{ duration: shake ? 0.4 : 0.35 }}
      className="flex flex-col gap-6"
    >
      <div>
        <p className="text-sm font-bold mb-2" style={{ color: "var(--color-brand-ink-light)" }}>
          Translate this sentence
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          {exercise.englishPrompt}
        </h2>
      </div>

      <div
        className="min-h-16 border-b-2 flex flex-wrap gap-2 pb-3"
        style={{ borderColor: "var(--color-brand-line)" }}
      >
        <AnimatePresence>
          {selected.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              onClick={() => removeTile(tile)}
              aria-label={`Remove "${tile.text}" from your sentence`}
              className="btn-3d rounded-xl px-4 py-2 font-bold"
              style={{
                background: checked
                  ? isCorrect
                    ? "var(--color-brand-teal-light)"
                    : "var(--color-brand-red-light)"
                  : "var(--color-brand-surface)",
                border: `2px solid ${
                  checked
                    ? isCorrect
                      ? "var(--color-brand-teal)"
                      : "var(--color-brand-red)"
                    : "var(--color-brand-coral)"
                }`,
                color: "var(--color-brand-ink)",
                boxShadow: `0 3px 0 ${
                  checked
                    ? isCorrect
                      ? "var(--color-brand-teal)"
                      : "var(--color-brand-red)"
                    : "var(--color-brand-coral)"
                }`,
              }}
            >
              {tile.text}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {bank.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              onClick={() => addTile(tile)}
              disabled={checked}
              aria-label={`Add "${tile.text}" to your sentence`}
              className="btn-outline btn-3d rounded-xl px-4 py-2 font-bold"
            >
              {tile.text}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
