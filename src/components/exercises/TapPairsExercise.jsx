import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TapPairsExercise({ exercise, onWrong, onDone }) {
  const [matchedPairIds, setMatchedPairIds] = useState(new Set());
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [wrongIds, setWrongIds] = useState(new Set());

  useEffect(() => {
    setMatchedPairIds(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
    setWrongIds(new Set());
  }, [exercise.id]);

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;
    if (selectedLeft.pairId === selectedRight.pairId) {
      const nextMatched = new Set(matchedPairIds);
      nextMatched.add(selectedLeft.pairId);
      setMatchedPairIds(nextMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (nextMatched.size === exercise.pairs.length) {
        setTimeout(() => onDone(), 500);
      }
    } else {
      setWrongIds(new Set([selectedLeft.id, selectedRight.id]));
      onWrong();
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongIds(new Set());
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeft, selectedRight]);

  function tileClass(tile, isSelected) {
    if (wrongIds.has(tile.id)) return "bg-brand-red-light border-brand-red text-brand-red-dark";
    if (isSelected) return "bg-brand-coral-light border-brand-coral text-brand-coral-dark";
    return "bg-white border-brand-line text-brand-ink";
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      <div>
        <p className="text-sm font-bold mb-2" style={{ color: "var(--color-brand-ink-light)" }}>
          Tap the matching pairs
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {exercise.left
              .filter((tile) => !matchedPairIds.has(tile.pairId))
              .map((tile) => {
                const isSelected = selectedLeft?.id === tile.id;
                return (
                  <motion.button
                    key={tile.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setSelectedLeft(tile)}
                    className={`btn-3d rounded-xl border-2 py-3 px-3 font-bold text-sm sm:text-base transition-colors ${tileClass(
                      tile,
                      isSelected,
                    )}`}
                    style={{ boxShadow: "0 3px 0 var(--color-brand-line)" }}
                  >
                    {tile.text}
                  </motion.button>
                );
              })}
          </AnimatePresence>
        </div>
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {exercise.right
              .filter((tile) => !matchedPairIds.has(tile.pairId))
              .map((tile) => {
                const isSelected = selectedRight?.id === tile.id;
                return (
                  <motion.button
                    key={tile.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setSelectedRight(tile)}
                    className={`btn-3d rounded-xl border-2 py-3 px-3 font-bold text-sm sm:text-base transition-colors ${tileClass(
                      tile,
                      isSelected,
                    )}`}
                    style={{ boxShadow: "0 3px 0 var(--color-brand-line)" }}
                  >
                    {tile.text}
                  </motion.button>
                );
              })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
