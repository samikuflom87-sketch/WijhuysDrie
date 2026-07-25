import { motion } from "framer-motion";

export default function ProgressBar({ value }) {
  return (
    <div className="h-4 w-full rounded-full overflow-hidden" style={{ background: "var(--color-duo-gray)" }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: "var(--color-duo-green)" }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
