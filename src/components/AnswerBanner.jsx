import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPRING_SNAPPY } from "../lib/motion";
import Button from "./Button";
import Mascot from "./Mascot";
import Confetti, { randomConfettiVariant } from "./Confetti";

export default function AnswerBanner({ status, correctText, mascotId, message, compliment, onContinue }) {
  const isCorrect = status === "correct";
  // Re-rolled each time a new compliment appears (i.e. each new correct
  // answer), so the celebration doesn't look identical every single time.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- re-roll on each new compliment, not because its value is read here
  const confettiVariant = useMemo(() => randomConfettiVariant(), [compliment]);

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          exit={{ y: 200 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-30 px-4 pt-4 pb-6 sm:pb-8"
          style={{
            background: isCorrect
              ? "linear-gradient(180deg, var(--color-brand-teal-light), var(--color-brand-surface))"
              : "linear-gradient(180deg, var(--color-brand-red-light), var(--color-brand-surface))",
            borderTop: `3px solid ${isCorrect ? "var(--color-brand-teal)" : "var(--color-brand-red)"}`,
            boxShadow: "0 -8px 24px rgba(20, 48, 43, 0.12)",
          }}
        >
          <div className="max-w-md mx-auto flex flex-col gap-3">
            <div className="relative flex items-center gap-3">
              {isCorrect && <Confetti variant={confettiVariant} />}
              <Mascot mascotId={mascotId} mood={isCorrect ? "happy" : "sad"} size={56} />
              <div>
                {isCorrect && compliment && (
                  <motion.p
                    key={compliment}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={SPRING_SNAPPY}
                    className="font-extrabold text-2xl leading-none mb-0.5"
                    style={{ color: "var(--color-brand-teal-dark)", fontFamily: "var(--font-display)" }}
                  >
                    {compliment}
                  </motion.p>
                )}
                <p
                  className="font-bold text-base"
                  style={{ color: isCorrect ? "var(--color-brand-teal-dark)" : "var(--color-brand-red-dark)" }}
                >
                  {message}
                </p>
                {!isCorrect && (
                  <p className="text-sm font-bold" style={{ color: "var(--color-brand-red-dark)" }}>
                    Correct answer: <span className="underline">{correctText}</span>
                  </p>
                )}
              </div>
            </div>
            <Button
              variant={isCorrect ? "teal" : "red"}
              className="w-full uppercase tracking-wide"
              onClick={onContinue}
            >
              Continue
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
