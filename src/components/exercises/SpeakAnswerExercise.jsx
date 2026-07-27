import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { createRecognizer, roughMatch, speechRecognitionSupported } from "../../lib/speech";
import { useSound } from "../../hooks/useSound";

export default function SpeakAnswerExercise({ exercise, checked, onResult, shake }) {
  const sound = useSound();
  const [status, setStatus] = useState("idle"); // idle | recording | no-support | error | done
  const [transcript, setTranscript] = useState("");
  const recognizerRef = useRef(null);

  function startRecording() {
    if (checked || status === "recording") return;
    if (!speechRecognitionSupported()) {
      setStatus("no-support");
      return;
    }
    const recognizer = createRecognizer();
    recognizerRef.current = recognizer;
    setTranscript("");
    setStatus("recording");

    recognizer.onresult = (event) => {
      const heard = event.results[0][0].transcript;
      setTranscript(heard);
      setStatus("done");
      onResult({ transcript: heard, matched: roughMatch(heard, exercise.correctAnswer) });
    };
    recognizer.onerror = () => setStatus("error");
    recognizer.onend = () => setStatus((s) => (s === "recording" ? "idle" : s));

    try {
      recognizer.start();
      sound.click();
    } catch {
      setStatus("error");
    }
  }

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
        <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
          '{exercise.promptText}'
        </h2>
      </div>

      <p
        className="text-xs font-bold rounded-xl px-3 py-2"
        style={{ background: "var(--color-brand-yellow-light)", color: "var(--color-brand-ink-light)" }}
      >
        🎤 Speaking practice (beta) — no browser can truly check Tigrinya pronunciation yet, so this is
        just a rough guess, never a real grade.
      </p>

      <div className="flex flex-col items-center gap-3 py-2">
        <button
          type="button"
          onClick={startRecording}
          disabled={checked || status === "recording"}
          aria-label="Record yourself saying the word"
          className="btn-3d rounded-full flex items-center justify-center font-extrabold"
          style={{
            width: 84,
            height: 84,
            background: status === "recording" ? "var(--color-brand-red-light)" : "var(--color-brand-coral-light)",
            boxShadow: `0 4px 0 ${status === "recording" ? "var(--color-brand-red)" : "var(--color-brand-coral)"}`,
            color: status === "recording" ? "var(--color-brand-red-dark)" : "var(--color-brand-coral-dark)",
            fontSize: 32,
          }}
        >
          🎤
        </button>
        <p className="text-sm font-bold" style={{ color: "var(--color-brand-ink-light)" }}>
          {status === "recording" ? "Listening..." : status === "done" ? "Tap to try again" : "Tap and say the word"}
        </p>
      </div>

      {status === "no-support" && (
        <p className="text-sm font-bold text-center" style={{ color: "var(--color-brand-red-dark)" }}>
          This browser doesn't support speech recognition — try Google Chrome instead.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm font-bold text-center" style={{ color: "var(--color-brand-red-dark)" }}>
          Didn't catch that — check your microphone permission and try again.
        </p>
      )}
      {transcript && (
        <p className="text-sm font-bold text-center" style={{ color: "var(--color-brand-ink-light)" }}>
          We heard: "{transcript}"
        </p>
      )}
    </motion.div>
  );
}
