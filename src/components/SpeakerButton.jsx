function playAudio(path) {
  if (!path) return;
  try {
    const audio = new Audio(path);
    audio.play().catch(() => {});
  } catch {
    // Missing or unplayable audio fails silently — recordings are added later.
  }
}

export default function SpeakerButton({ src, size = 20, className = "", label = "Play audio" }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        playAudio(src);
      }}
      className={`inline-flex items-center justify-center rounded-full shrink-0 hover:opacity-75 active:scale-90 transition ${className}`}
      style={{ width: size + 12, height: size + 12 }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M4 9v6h4l5 5V4L8 9H4z" />
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
      </svg>
    </button>
  );
}
