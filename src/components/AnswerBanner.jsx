import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import Mascot from "./Mascot";

export default function AnswerBanner({ status, correctText, onContinue }) {
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
            background: isCorrect ? "#D7FFB8" : "#FFDFE0",
            borderTop: `3px solid ${isCorrect ? "#58CC02" : "#FF4B4B"}`,
          }}
        >
          <div className="max-w-md mx-auto flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Mascot mood={isCorrect ? "happy" : "sad"} size={56} />
              <div>
                <p
                  className="font-extrabold text-lg"
                  style={{ color: isCorrect ? "#58A700" : "#EA2B2B" }}
                >
                  {isCorrect ? "Correct!" : "Not quite!"}
                </p>
                {!isCorrect && (
                  <p className="text-sm font-bold" style={{ color: "#EA2B2B" }}>
                    Correct answer: <span className="underline">{correctText}</span>
                  </p>
                )}
              </div>
            </div>
            <Button
              variant={isCorrect ? "green" : "red"}
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
