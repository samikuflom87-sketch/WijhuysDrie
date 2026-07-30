import { useState } from "react";
import Button from "./Button";
import { getLevelInfo } from "../lib/storage";

// Renders a shareable streak/level summary onto an off-screen canvas —
// no DOM node needed, just a PNG blob to hand to the Web Share API (or a
// plain download link where sharing files isn't supported).
function drawCard(progress) {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");
  const levelInfo = getLevelInfo(progress.xp);

  const gradient = ctx.createLinearGradient(0, 0, 800, 800);
  gradient.addColorStop(0, "#FF8163");
  gradient.addColorStop(1, "#00A19D");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 800);

  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.arc(680, 120, 220, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("Habesha Steps", 400, 110);

  ctx.font = "bold 140px sans-serif";
  ctx.fillText("🔥", 400, 340);
  ctx.font = "bold 90px sans-serif";
  ctx.fillText(`${progress.streak}`, 400, 430);
  ctx.font = "bold 30px sans-serif";
  ctx.fillText("DAY STREAK", 400, 470);

  ctx.font = "bold 34px sans-serif";
  ctx.fillText(`Level ${levelInfo.level} · ${levelInfo.rank}`, 400, 560);
  ctx.font = "bold 28px sans-serif";
  ctx.fillText(`${progress.xp} XP earned`, 400, 610);

  ctx.font = "22px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText("Learning Tigrinya on Habesha Steps", 400, 740);

  return canvas;
}

export default function ShareCardButton({ progress }) {
  const [busy, setBusy] = useState(false);

  function handleShare() {
    setBusy(true);
    const canvas = drawCard(progress);
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setBusy(false);
        return;
      }
      const file = new File([blob], "habesha-steps-streak.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "My Habesha Steps progress" });
        } catch {
          // Share sheet dismissed — nothing else to do.
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "habesha-steps-streak.png";
        a.click();
        URL.revokeObjectURL(url);
      }
      setBusy(false);
    }, "image/png");
  }

  return (
    <Button variant="teal" className="w-full uppercase tracking-wide" disabled={busy} onClick={handleShare}>
      📤 Share your progress
    </Button>
  );
}
