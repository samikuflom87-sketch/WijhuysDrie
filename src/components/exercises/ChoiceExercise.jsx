import { motion } from "framer-motion";
import Button from "../Button";

export default function ChoiceExercise({ exercise, selectedId, checked, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      <div>
        <p className="text-sm font-bold mb-2" style={{ color: "var(--color-duo-text-light)" }}>
          {exercise.promptLabel}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--color-duo-text)" }}>
          {exercise.type === "reverse-choice" ? `"${exercise.promptText}"` : `'${exercise.promptText}'`}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {exercise.options.map((opt) => {
          let state;
          if (checked) {
            if (opt.isCorrect) state = "correct";
            else if (opt.id === selectedId) state = "wrong";
          } else if (opt.id === selectedId) {
            state = "selected";
          }
          return (
            <Button
              key={opt.id}
              variant="outline"
              state={state}
              disabled={checked}
              onClick={() => onSelect(opt.id)}
              className="w-full text-left font-bold text-base"
            >
              {opt.text}
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}
