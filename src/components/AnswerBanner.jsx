import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import Mascot from "./Mascot";
import Confetti from "./Confetti";

export default function AnswerBanner({ status, correctText, mascotId, message, onContinue }) {
  const isCorrect = status === "correct";

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
            background: isCorrect ? "var(--color-brand-teal-light)" : "var(--color-brand-red-light)",
            borderTop: `3px solid ${isCorrect ? "var(--color-brand-teal)" : "var(--color-brand-red)"}`,
          }}
        >
          <div className="max-w-md mx-auto flex flex-col gap-3">
            <div className="relative flex items-center gap-3">
              {isCorrect && <Confetti />}
              <Mascot mascotId={mascotId} mood={isCorrect ? "happy" : "sad"} size={56} />
              <div>
                <p
                  className="font-extrabold text-lg"
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
