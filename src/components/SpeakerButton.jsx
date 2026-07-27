import { useSettingsContext } from "../context/SettingsContext";
import { speakText } from "../lib/tts";

// Plays a real recording if one exists at `src`; otherwise (or if it fails
// to load, e.g. the file hasn't been recorded yet) reads `text` aloud with
// the browser's built-in text-to-speech so the button always makes sound.
function playAudio(src, text) {
  if (!src) {
    speakText(text);
    return;
  }
  try {
    const audio = new Audio(src);
    let fellBack = false;
    const fallback = () => {
      if (fellBack) return;
      fellBack = true;
      speakText(text);
    };
    audio.addEventListener("error", fallback);
    audio.play().catch(fallback);
  } catch {
    speakText(text);
  }
}

export default function SpeakerButton({ src, text, size = 20, className = "", label = "Play audio" }) {
  const { settings } = useSettingsContext();

  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        if (settings.soundOn) playAudio(src, text);
      }}
      className={`inline-flex items-center justify-center rounded-full shrink-0 hover:opacity-75 active:scale-90 transition ${className}`}
      style={{ width: size + 12, height: size + 12 }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M4 9v6h4l5 5V4L8 9H4z" />
        {settings.soundOn ? (
          <>
            <path
              d="M16.5 8.5a5 5 0 0 1 0 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M18.8 6.2a8.5 8.5 0 0 1 0 11.6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </>
        ) : (
          <path d="M15 8 L20 15 M20 8 L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
