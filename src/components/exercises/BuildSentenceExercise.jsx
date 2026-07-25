import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BuildSentenceExercise({ exercise, checked, onChange }) {
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
    setSelected((prev) => [...prev, tile]);
  }

  function removeTile(tile) {
    if (checked) return;
    setSelected((prev) => prev.filter((t) => t.id !== tile.id));
  }

  const isCorrect =
    checked &&
    JSON.stringify(selected.map((t) => t.text)) === JSON.stringify(exercise.correctTokens);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      <div>
        <p className="text-sm font-bold mb-2" style={{ color: "var(--color-duo-text-light)" }}>
          Translate this sentence
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--color-duo-text)" }}>
          {exercise.englishPrompt}
        </h2>
      </div>

      <div
        className="min-h-16 border-b-2 flex flex-wrap gap-2 pb-3"
        style={{ borderColor: "var(--color-duo-gray)" }}
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
              className="btn-3d rounded-xl px-4 py-2 font-bold"
              style={{
                background: checked ? (isCorrect ? "#D7FFB8" : "#FFDFE0") : "white",
                border: `2px solid ${checked ? (isCorrect ? "#58CC02" : "#FF4B4B") : "var(--color-duo-blue)"}`,
                color: "var(--color-duo-text)",
                boxShadow: `0 3px 0 ${checked ? (isCorrect ? "#58CC02" : "#FF4B4B") : "var(--color-duo-blue)"}`,
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
