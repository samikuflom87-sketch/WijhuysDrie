import { motion } from "framer-motion";

export default function ProgressBar({ value }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-4 w-full rounded-full overflow-hidden"
      style={{ background: "var(--color-brand-line)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg, #2B8478, var(--color-brand-teal))" }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
