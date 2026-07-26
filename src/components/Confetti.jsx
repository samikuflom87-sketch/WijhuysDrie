import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#FF6B4A", "#FFC93C", "#00A19D", "#FF8163", "#1FC0BC"];

export default function Confetti({ count = 22 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
        const distance = 60 + Math.random() * 70;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 20,
          rotate: Math.random() * 360,
          color: COLORS[i % COLORS.length],
          isCircle: i % 3 === 0,
          delay: Math.random() * 0.08,
        };
      }),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-40">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate, scale: 1 }}
          transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
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
