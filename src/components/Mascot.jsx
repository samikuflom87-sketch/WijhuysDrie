import { useId } from "react";
import { motion } from "framer-motion";

const BODY_ANIMATIONS = {
  happy: { scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] },
  excited: { y: [0, -16, 0], scale: [1, 1.08, 1] },
  sad: { rotate: [0, -3, 3, 0], y: [0, 2, 0] },
  neutral: { y: [0, -4, 0] },
};

function Face({ mood, cx, cy, eyeGap = 13, eyeY = 0 }) {
  const isSad = mood === "sad";
  const isHappy = mood === "happy" || mood === "excited";
  const eyeR = isSad ? 5 : 6;

  return (
    <g>
      {isSad && (
        <>
          <path
            d={`M${cx - eyeGap - 8} ${cy + eyeY - 10} l10 4`}
            stroke="#4A3527"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M${cx + eyeGap + 8} ${cy + eyeY - 10} l-10 4`}
            stroke="#4A3527"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
      <circle cx={cx - eyeGap} cy={cy + eyeY} r={eyeR} fill="#4A3527" />
      <circle cx={cx + eyeGap} cy={cy + eyeY} r={eyeR} fill="#4A3527" />

      {isHappy ? (
        <path
          d={`M${cx - 12} ${cy + eyeY + 14} Q${cx} ${cy + eyeY + 26} ${cx + 12} ${cy + eyeY + 14}`}
          stroke="#4A3527"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      ) : isSad ? (
        <path
          d={`M${cx - 10} ${cy + eyeY + 22} Q${cx} ${cy + eyeY + 12} ${cx + 10} ${cy + eyeY + 22}`}
          stroke="#4A3527"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={`M${cx - 9} ${cy + eyeY + 18} Q${cx} ${cy + eyeY + 22} ${cx + 9} ${cy + eyeY + 18}`}
          stroke="#4A3527"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

function ZakiShape({ mood, uid }) {
  const isHappy = mood === "happy" || mood === "excited";
  const petals = [0, 60, 120, 180, 240, 300];
  const gradId = `zakiGrad-${uid}`;
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8163" />
          <stop offset="1" stopColor="#FF6B4A" />
        </linearGradient>
      </defs>
      {petals.map((deg) => (
        <motion.ellipse
          key={deg}
          cx="60"
          cy="60"
          rx="11"
          ry="26"
          fill={`url(#${gradId})`}
          style={{ transformOrigin: "60px 60px" }}
          transform={`rotate(${deg} 60 60) translate(0 -26)`}
          animate={isHappy ? { scaleY: [1, 1.12, 1] } : {}}
          transition={{ duration: 0.5, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
        />
      ))}
      <circle cx="60" cy="60" r="27" fill="#FFF6EC" />
      <Face mood={mood} cx={60} cy={60} />
    </>
  );
}

function NardosShape({ mood, uid }) {
  const gradId = `nardosGrad-${uid}`;
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1FC0BC" />
          <stop offset="1" stopColor="#00A19D" />
        </linearGradient>
      </defs>
      <path
        d="M60 12 C56 22 52 28 52 28 C74 30 96 48 96 76 A36 36 0 1 1 24 76 C24 48 46 30 60 12 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M60 12 C57 18 55 23 55 27"
        stroke="#007B78"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="60" cy="78" rx="30" ry="26" fill="#FFF6EC" opacity="0.94" />
      <Face mood={mood} cx={60} cy={80} eyeGap={12} />
    </>
  );
}

function BemnetShape({ mood, uid }) {
  const isHappy = mood === "happy" || mood === "excited";
  const gradId = `bemnetGrad-${uid}`;
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD766" />
          <stop offset="1" stopColor="#FFC93C" />
        </linearGradient>
      </defs>
      <motion.line
        x1="45"
        y1="28"
        x2="38"
        y2="14"
        stroke="#E0A800"
        strokeWidth="3"
        strokeLinecap="round"
        animate={isHappy ? { rotate: [-8, 8, -8] } : {}}
        style={{ transformOrigin: "45px 28px" }}
        transition={{ duration: 0.5, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
      />
      <circle cx="38" cy="12" r="5" fill="#FFC93C" />
      <motion.line
        x1="75"
        y1="28"
        x2="82"
        y2="14"
        stroke="#E0A800"
        strokeWidth="3"
        strokeLinecap="round"
        animate={isHappy ? { rotate: [8, -8, 8] } : {}}
        style={{ transformOrigin: "75px 28px" }}
        transition={{ duration: 0.5, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
      />
      <circle cx="82" cy="12" r="5" fill="#FFC93C" />

      <circle cx="60" cy="66" r="34" fill={`url(#${gradId})`} />
      <circle cx="30" cy="60" r="18" fill={`url(#${gradId})`} />
      <circle cx="90" cy="60" r="18" fill={`url(#${gradId})`} />
      <circle cx="42" cy="42" r="14" fill={`url(#${gradId})`} />
      <circle cx="78" cy="42" r="14" fill={`url(#${gradId})`} />

      <ellipse cx="60" cy="70" rx="32" ry="28" fill="#FFF6EC" opacity="0.92" />
      <Face mood={mood} cx={60} cy={68} eyeGap={14} />
      {isHappy && (
        <ellipse cx="60" cy="94" rx="7" ry="5" fill="#FF6B4A" opacity="0.85" />
      )}
    </>
  );
}

function SabaShape({ mood, uid }) {
  const gradId = `sabaGrad-${uid}`;
  const eyeGap = 13;
  const cy = 64;
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0C892" />
          <stop offset="1" stopColor="#D8A968" />
        </linearGradient>
      </defs>
      <path
        d="M60 8 C58 8 57 12 57 16 M60 8 C62 8 63 12 63 16"
        stroke="#8A6A3F"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="53" cy="14" rx="7" ry="5" fill="#00A19D" transform="rotate(-25 53 14)" />
      <ellipse cx="67" cy="14" rx="7" ry="5" fill="#1FC0BC" transform="rotate(25 67 14)" />

      <circle cx="60" cy={cy} r="34" fill={`url(#${gradId})`} />
      <circle cx="60" cy={cy - 26} r="8" fill={`url(#${gradId})`} />

      <Face mood={mood} cx={60} cy={cy} eyeGap={eyeGap} />

      {/* glasses */}
      <circle cx={60 - eyeGap} cy={cy} r="11" fill="none" stroke="#4A3527" strokeWidth="2.5" />
      <circle cx={60 + eyeGap} cy={cy} r="11" fill="none" stroke="#4A3527" strokeWidth="2.5" />
      <path d={`M${60 - eyeGap + 11} ${cy} L${60 + eyeGap - 11} ${cy}`} stroke="#4A3527" strokeWidth="2.5" />
      <path d={`M${60 - eyeGap - 11} ${cy - 2} L${60 - eyeGap - 18} ${cy - 6}`} stroke="#4A3527" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M${60 + eyeGap + 11} ${cy - 2} L${60 + eyeGap + 18} ${cy - 6}`} stroke="#4A3527" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

function TesfaShape({ mood, uid }) {
  const isHappy = mood === "happy" || mood === "excited";
  const gradId = `tesfaGrad-${uid}`;
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFA98F" />
          <stop offset="1" stopColor="#FF6B4A" />
        </linearGradient>
      </defs>
      <motion.ellipse
        cx="26"
        cy="52"
        rx="13"
        ry="20"
        fill="#FFE4DA"
        style={{ transformOrigin: "38px 46px" }}
        animate={isHappy ? { rotate: [-6, 6, -6] } : { rotate: -6 }}
        transition={{ duration: 0.7, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
      />
      <motion.ellipse
        cx="94"
        cy="52"
        rx="13"
        ry="20"
        fill="#FFE4DA"
        style={{ transformOrigin: "82px 46px" }}
        animate={isHappy ? { rotate: [6, -6, 6] } : { rotate: 6 }}
        transition={{ duration: 0.7, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
      />
      <path
        d="M60 92 C18 64 22 28 46 22 C55 20 60 30 60 38 C60 30 65 20 74 22 C98 28 102 64 60 92 Z"
        fill={`url(#${gradId})`}
      />
      <ellipse cx="60" cy="56" rx="28" ry="24" fill="#FFF6EC" opacity="0.92" />
      <Face mood={mood} cx={60} cy={54} eyeGap={12} />
    </>
  );
}

const SHAPES = {
  zaki: ZakiShape,
  nardos: NardosShape,
  bemnet: BemnetShape,
  saba: SabaShape,
  tesfa: TesfaShape,
};

export default function Mascot({ mascotId = "zaki", mood = "neutral", size = 120, className = "" }) {
  const Shape = SHAPES[mascotId] || ZakiShape;
  const uid = useId();

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={BODY_ANIMATIONS[mood] || BODY_ANIMATIONS.neutral}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <Shape mood={mood} uid={uid} />
      </svg>
    </motion.div>
  );
}
