import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import Hearts from "./Hearts";
import { useSound } from "../hooks/useSound";

export default function TopBar({ progressPct, hearts, onExit }) {
  const navigate = useNavigate();
  const sound = useSound();

  return (
    <div className="sticky top-0 z-20 bg-white px-4 py-3">
      <div className="max-w-md mx-auto flex items-center gap-4">
        <button
          onClick={() => {
            sound.click();
            (onExit || (() => navigate("/")))();
          }}
          aria-label="Exit lesson"
          className="text-2xl font-bold"
          style={{ color: "var(--color-brand-line-dark)" }}
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar value={progressPct} />
        </div>
        <Hearts count={hearts} />
      </div>
    </div>
  );
}
