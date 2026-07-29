import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSettingsContext } from "../context/SettingsContext";

const COLORS = ["#FF6B4A", "#FFC93C", "#00A19D", "#FF8163", "#1FC0BC"];
const VARIANTS = ["burst", "rain", "fountain"];

export function randomConfettiVariant() {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

function buildParticles(count, variant) {
  return Array.from({ length: count }, (_, i) => {
    const color = COLORS[i % COLORS.length];
    const isCircle = i % 3 === 0;
    const delay = Math.random() * 0.1;

    if (variant === "rain") {
      const startX = (Math.random() - 0.5) * 220;
      return {
        id: i, color, isCircle, delay,
        initial: { x: startX, y: -90 - Math.random() * 40, opacity: 1, rotate: 0, scale: 0.7 },
        animate: { x: startX + (Math.random() - 0.5) * 40, y: 90 + Math.random() * 30, opacity: 0, rotate: Math.random() * 360, scale: 1 },
        duration: 1.1 + Math.random() * 0.3,
      };
    }
    if (variant === "fountain") {
      const spread = (Math.random() - 0.5) * 160;
      return {
        id: i, color, isCircle, delay,
        initial: { x: 0, y: 10, opacity: 1, rotate: 0, scale: 0.6 },
        animate: { x: spread, y: [10, -90 - Math.random() * 30, 40], opacity: [1, 1, 0], rotate: Math.random() * 360, scale: 1 },
        duration: 1.0 + Math.random() * 0.2,
      };
    }
    // "burst" — original radial pattern
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
    const distance = 60 + Math.random() * 70;
    return {
      id: i, color, isCircle, delay,
      initial: { x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 },
      animate: { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 20, opacity: 0, rotate: Math.random() * 360, scale: 1 },
      duration: 0.9,
    };
  });
}

export default function Confetti({ count = 22, variant = "burst" }) {
  const { settings } = useSettingsContext();
  const particles = useMemo(() => buildParticles(count, variant), [count, variant]);

  if (settings.reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-40">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={p.initial}
          animate={p.animate}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            background: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
