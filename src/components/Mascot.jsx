import { motion } from "framer-motion";

const MOOD_ANIMATIONS = {
  happy: { rotate: [0, -6, 6, -3, 0], scale: [1, 1.08, 1] },
  excited: { y: [0, -14, 0], scale: [1, 1.1, 1] },
  sad: { rotate: [0, -4, 4, 0], y: [0, 3, 0] },
  neutral: { y: [0, -3, 0] },
};

export default function Mascot({ mood = "neutral", size = 120, className = "" }) {
  const pupilY = mood === "sad" ? 32 : mood === "excited" ? 28 : 30;
  const isSad = mood === "sad";
  const isHappy = mood === "happy" || mood === "excited";

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={MOOD_ANIMATIONS[mood] || MOOD_ANIMATIONS.neutral}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 200" width={size} height={size}>
        {/* wings */}
        <motion.ellipse
          cx="38"
          cy="130"
          rx="20"
          ry="34"
          fill="#4CAF00"
          animate={
            isHappy
              ? { rotate: [-10, -35, -10] }
              : isSad
              ? { rotate: -5 }
              : { rotate: -10 }
          }
          style={{ transformOrigin: "40px 105px" }}
          transition={{ duration: 0.6, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
        />
        <motion.ellipse
          cx="162"
          cy="130"
          rx="20"
          ry="34"
          fill="#4CAF00"
          animate={
            isHappy
              ? { rotate: [10, 35, 10] }
              : isSad
              ? { rotate: 5 }
              : { rotate: 10 }
          }
          style={{ transformOrigin: "160px 105px" }}
          transition={{ duration: 0.6, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
        />

        {/* body */}
        <ellipse cx="100" cy="115" rx="70" ry="75" fill="#58CC02" />
        {/* belly */}
        <ellipse cx="100" cy="130" rx="46" ry="48" fill="#D7FFB8" />

        {/* feet */}
        <ellipse cx="80" cy="192" rx="12" ry="6" fill="#FFC800" />
        <ellipse cx="120" cy="192" rx="12" ry="6" fill="#FFC800" />

        {/* beak */}
        <path d="M90 108 L110 108 L100 122 Z" fill="#FF9600" />

        {/* eyes background */}
        <circle cx="72" cy="88" r="26" fill="white" />
        <circle cx="128" cy="88" r="26" fill="white" />

        {/* eyebrows for sad/encouraging look */}
        {isSad && (
          <>
            <path
              d="M52 62 L88 72"
              stroke="#4CAF00"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M148 62 L112 72"
              stroke="#4CAF00"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </>
        )}

        {/* pupils */}
        <motion.circle
          cx="72"
          cy={pupilY + 60}
          r={isSad ? 9 : 11}
          fill="#4B4B4B"
          animate={isHappy ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
        />
        <motion.circle
          cx="128"
          cy={pupilY + 60}
          r={isSad ? 9 : 11}
          fill="#4B4B4B"
          animate={isHappy ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
        />

        {/* mouth */}
        {isHappy ? (
          <path
            d="M85 148 Q100 165 115 148"
            stroke="#4B4B4B"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        ) : isSad ? (
          <path
            d="M85 155 Q100 142 115 155"
            stroke="#4B4B4B"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M88 150 L112 150"
            stroke="#4B4B4B"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        )}
      </svg>
    </motion.div>
  );
}
