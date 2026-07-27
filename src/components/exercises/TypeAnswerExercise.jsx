import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SpeakerButton from "../SpeakerButton";

export default function TypeAnswerExercise({ exercise, checked, isCorrect, onChange, shake }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
  }, [exercise.id]);

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const isListen = exercise.mode === "listen";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={shake ? { opacity: 1, x: [0, -10, 10, -6, 6, 0] } : { opacity: 1, x: 0 }}
      transition={{ duration: shake ? 0.4 : 0.35 }}
      className="flex flex-col gap-6"
    >
      <div>
        <p className="text-sm font-bold mb-2" style={{ color: "var(--color-brand-ink-light)" }}>
          {exercise.promptLabel}
        </p>
        {isListen ? (
          <div className="flex justify-center py-2">
            <SpeakerButton
              src={exercise.promptAudio}
              size={48}
              className="bg-brand-coral-light text-brand-coral"
              label="Play the word"
            />
          </div>
        ) : (
          <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
            '{exercise.promptText}'
          </h2>
        )}
      </div>

      <input
        type="text"
        value={value}
        disabled={checked}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type in Tigrinya..."
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        className="w-full rounded-2xl border-2 px-4 py-3.5 font-bold text-lg outline-none"
        style={{
          borderColor: checked
            ? isCorrect
              ? "var(--color-brand-teal)"
              : "var(--color-brand-red)"
            : "var(--color-brand-line)",
          background: checked
            ? isCorrect
              ? "var(--color-brand-teal-light)"
              : "var(--color-brand-red-light)"
            : "white",
          color: "var(--color-brand-ink)",
        }}
      />
    </motion.div>
  );
}
