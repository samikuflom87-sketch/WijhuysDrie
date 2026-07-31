import { motion, AnimatePresence } from "framer-motion";

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill={filled ? "#B8492F" : "#E6D8C6"}>
      <path d="M12 21s-6.7-4.35-9.6-8.2C.6 10.2 1 6.8 3.7 5.1c2.2-1.4 4.9-.8 6.3 1.1.6.8 2 .8 2.6 0 1.4-1.9 4.1-2.5 6.3-1.1 2.7 1.7 3.1 5.1 1.3 7.7C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

export default function Hearts({ count, max = 5 }) {
  return (
    <div className="flex items-center gap-1" role="status" aria-label={`${count} of ${max} hearts remaining`}>
      <AnimatePresence initial={false}>
        {Array.from({ length: max }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 1 }}
            animate={i < count ? { scale: [1.4, 1] } : { scale: [1.3, 0.9, 1], rotate: [0, -15, 15, 0] }}
            transition={{ duration: 0.4 }}
          >
            <HeartIcon filled={i < count} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
