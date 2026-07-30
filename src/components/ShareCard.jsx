import { useState } from "react";
import Button from "./Button";
import Icon from "./Icon";
import { getLevelInfo } from "../lib/storage";

// Same flame silhouette as the Icon component's "flame" glyph, drawn as a
// Path2D instead of an emoji character — emoji glyphs render wildly
// differently across OS/browser font stacks, which would make a shared
// image look inconsistent (or broken) for whoever receives it.
const FLAME_PATH = new Path2D(
  "M12 2c.6 2.4-.4 3.7-1.6 5-1.3 1.4-2.9 3-2.9 5.6a4.5 4.5 0 0 0 9 0c0-1.2-.4-2-1-2.8-.1 1.4-.8 2.3-1.7 2.3-1.2 0-1.7-1-1.3-2.1.6-1.7 1.5-2.9 1.5-4.9C14 3.7 13.1 2.7 12 2Zm0 15.6a2.1 2.1 0 0 1-2.1-2.1c0-1 .5-1.7 1.1-2.4.2.9.8 1.5 1.6 1.5.5 0 1-.2 1.3-.6.1.4.2.8.2 1.2A2.1 2.1 0 0 1 12 17.6Z",
);

// Renders a shareable streak/level summary onto an off-screen canvas —
// no DOM node needed, just a PNG blob to hand to the Web Share API (or a
// plain download link where sharing files isn't supported).
async function drawCard(progress) {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");
  const levelInfo = getLevelInfo(progress.xp);

  const gradient = ctx.createLinearGradient(0, 0, 800, 800);
  gradient.addColorStop(0, "#B8492F");
  gradient.addColorStop(1, "#1E6B60");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 800);

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.arc(680, 120, 220, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFCF7";
  ctx.font = "600 38px Fraunces, serif";
  ctx.fillText("Habesha Steps", 400, 108);

  ctx.save();
  ctx.translate(400 - 60, 220);
  ctx.scale(5, 5);
  ctx.fillStyle = "#F0CE94";
  ctx.fill(FLAME_PATH);
  ctx.restore();

  ctx.font = "700 90px 'Work Sans', sans-serif";
  ctx.fillText(`${progress.streak}`, 400, 430);
  ctx.font = "700 26px 'Work Sans', sans-serif";
  ctx.fillStyle = "rgba(255,252,247,0.85)";
  ctx.fillText("DAY STREAK", 400, 466);

  ctx.font = "600 32px Fraunces, serif";
  ctx.fillStyle = "#FFFCF7";
  ctx.fillText(`Level ${levelInfo.level} · ${levelInfo.rank}`, 400, 556);
  ctx.font = "500 24px 'Work Sans', sans-serif";
  ctx.fillText(`${progress.xp} XP earned`, 400, 600);

  ctx.font = "500 20px 'Work Sans', sans-serif";
  ctx.fillStyle = "rgba(255,252,247,0.8)";
  ctx.fillText("Learning Tigrinya on Habesha Steps", 400, 740);

  return canvas;
}

export default function ShareCardButton({ progress }) {
  const [busy, setBusy] = useState(false);

  async function handleShare() {
    setBusy(true);
    const canvas = await drawCard(progress);
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
    <Button
      variant="teal"
      className="w-full uppercase tracking-wide flex items-center justify-center gap-2"
      disabled={busy}
      onClick={handleShare}
    >
      <Icon name="share" size={18} />
      Share your progress
    </Button>
  );
}
