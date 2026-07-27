import { motion } from "framer-motion";
import Button from "../Button";
import SpeakerButton from "../SpeakerButton";
import Illustration from "../Illustration";

export default function ChoiceExercise({ exercise, selectedId, checked, onSelect, shake }) {
  const isPicture = exercise.type === "picture-choice";
  const isReverse = exercise.type === "reverse-choice";
  const isListening = exercise.type === "listening";
  const isOddOneOut = exercise.type === "odd-one-out";
  const hasTextPrompt = !isPicture && !isListening && !isOddOneOut;

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
        {isPicture ? (
          <div className="flex justify-center py-2">
            <div
              className="rounded-3xl p-4 flex items-center justify-center"
              style={{ background: "var(--color-brand-teal-light)" }}
            >
              <Illustration name={exercise.promptImage} size={120} />
            </div>
          </div>
        ) : isListening ? (
          <div className="flex justify-center py-2">
            <SpeakerButton
              src={exercise.promptAudio}
              text={exercise.correctText}
              size={48}
              className="bg-brand-coral-light text-brand-coral"
              label="Play the word"
            />
          </div>
        ) : hasTextPrompt ? (
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
              {isReverse ? `"${exercise.promptText}"` : `'${exercise.promptText}'`}
            </h2>
            {isReverse && (
              <SpeakerButton src={exercise.promptAudio} text={exercise.promptText} className="text-brand-coral" />
            )}
          </div>
        ) : null}
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
            <div key={opt.id} className="relative">
              <Button
                variant="outline"
                state={state}
                disabled={checked}
                onClick={() => onSelect(opt.id)}
                className="w-full text-left font-bold text-base"
              >
                <span className={opt.audio ? "pr-7 block" : "block"}>{opt.text}</span>
              </Button>
              {opt.audio && (
                <SpeakerButton
                  src={opt.audio}
                  text={opt.text}
                  size={16}
                  className="text-brand-coral absolute right-2 top-1/2 -translate-y-1/2"
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
