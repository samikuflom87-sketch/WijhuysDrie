import { useId } from "react";
import { motion } from "framer-motion";
import { useSettingsContext } from "../context/SettingsContext";

const BODY_ANIMATIONS = {
  happy: { scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] },
  excited: { y: [0, -16, 0], scale: [1, 1.08, 1] },
  sad: { rotate: [0, -3, 3, 0], y: [0, 2, 0] },
  neutral: { y: [0, -4, 0] },
};

function Accessory({ type, cx, cy, eyeGap }) {
  if (type === "hat") {
    return (
      <g>
        <path
          d={`M${cx - 15} ${cy - 28} L${cx} ${cy - 52} L${cx + 15} ${cy - 28} Z`}
          fill="#B8492F"
          stroke="#2A2019"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx={cx} cy={cy - 52} r="4.5" fill="#B9822C" />
        <rect x={cx - 17} y={cy - 30} width="34" height="6" rx="3" fill="#B9822C" stroke="#2A2019" strokeWidth="1" />
      </g>
    );
  }
  if (type === "glasses") {
    return (
      <g>
        <circle cx={cx - eyeGap} cy={cy} r="11" fill="none" stroke="#2A2019" strokeWidth="2.5" />
        <circle cx={cx + eyeGap} cy={cy} r="11" fill="none" stroke="#2A2019" strokeWidth="2.5" />
        <path d={`M${cx - eyeGap + 11} ${cy} L${cx + eyeGap - 11} ${cy}`} stroke="#2A2019" strokeWidth="2.5" />
      </g>
    );
  }
  if (type === "bandana") {
    return (
      <g>
        <path
          d={`M${cx - 24} ${cy - 26} Q${cx} ${cy - 40} ${cx + 24} ${cy - 26} L${cx + 22} ${cy - 16} Q${cx} ${cy - 28} ${cx - 22} ${cy - 16} Z`}
          fill="#1E6B60"
          stroke="#2A2019"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx={cx + 26} cy={cy - 20} r="4" fill="#B9822C" />
      </g>
    );
  }
  if (type === "medal") {
    return (
      <g>
        <path d={`M${cx - 6} ${cy + 32} L${cx - 2} ${cy + 20} L${cx + 2} ${cy + 20} L${cx + 6} ${cy + 32} Z`} fill="#8B3540" />
        <circle cx={cx} cy={cy + 38} r="9" fill="#B9822C" stroke="#8C611B" strokeWidth="1.5" />
        <path d={`M${cx - 4} ${cy + 38} L${cx + 4} ${cy + 38} M${cx} ${cy + 34} L${cx} ${cy + 42}`} stroke="#8C611B" strokeWidth="1.5" />
      </g>
    );
  }
  if (type === "crown") {
    return (
      <g>
        <path
          d={`M${cx - 18} ${cy - 24} L${cx - 18} ${cy - 40} L${cx - 9} ${cy - 30} L${cx} ${cy - 44} L${cx + 9} ${cy - 30} L${cx + 18} ${cy - 40} L${cx + 18} ${cy - 24} Z`}
          fill="#B9822C"
          stroke="#8C611B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx={cx} cy={cy - 44} r="3" fill="#8B3540" />
      </g>
    );
  }
  return null;
}

function Face({ mood, cx, cy, eyeGap = 13, eyeY = 0, accessories = [] }) {
  const isSad = mood === "sad";
  const isHappy = mood === "happy" || mood === "excited";
  const eyeR = isSad ? 5 : 6;

  return (
    <g>
      {isSad && (
        <>
          <path
            d={`M${cx - eyeGap - 8} ${cy + eyeY - 10} l10 4`}
            stroke="#2A2019"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M${cx + eyeGap + 8} ${cy + eyeY - 10} l-10 4`}
            stroke="#2A2019"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
      <circle cx={cx - eyeGap} cy={cy + eyeY} r={eyeR} fill="#2A2019" />
      <circle cx={cx + eyeGap} cy={cy + eyeY} r={eyeR} fill="#2A2019" />

      {isHappy ? (
        <path
          d={`M${cx - 12} ${cy + eyeY + 14} Q${cx} ${cy + eyeY + 26} ${cx + 12} ${cy + eyeY + 14}`}
          stroke="#2A2019"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      ) : isSad ? (
        <path
          d={`M${cx - 10} ${cy + eyeY + 22} Q${cx} ${cy + eyeY + 12} ${cx + 10} ${cy + eyeY + 22}`}
          stroke="#2A2019"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={`M${cx - 9} ${cy + eyeY + 18} Q${cx} ${cy + eyeY + 22} ${cx + 9} ${cy + eyeY + 18}`}
          stroke="#2A2019"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {accessories.map((type) => (
        <Accessory key={type} type={type} cx={cx} cy={cy + eyeY} eyeGap={eyeGap} />
      ))}
    </g>
  );
}

function ZakiShape({ mood, uid, reducedMotion, accessories }) {
  const isHappy = (mood === "happy" || mood === "excited") && !reducedMotion;
  const petals = [0, 60, 120, 180, 240, 300];
  const gradId = `zakiGrad-${uid}`;
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C25A3D" />
          <stop offset="1" stopColor="#B8492F" />
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
      <circle cx="60" cy="60" r="27" fill="#F6EEE3" />
      <Face mood={mood} cx={60} cy={60} accessories={accessories} />
    </>
  );
}

function NardosShape({ mood, uid, accessories }) {
  const gradId = `nardosGrad-${uid}`;
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B8478" />
          <stop offset="1" stopColor="#1E6B60" />
        </linearGradient>
      </defs>
      <path
        d="M60 12 C56 22 52 28 52 28 C74 30 96 48 96 76 A36 36 0 1 1 24 76 C24 48 46 30 60 12 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M60 12 C57 18 55 23 55 27"
        stroke="#123F38"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="60" cy="78" rx="30" ry="26" fill="#F6EEE3" opacity="0.94" />
      <Face mood={mood} cx={60} cy={80} eyeGap={12} accessories={accessories} />
    </>
  );
}

function BemnetShape({ mood, uid, reducedMotion, accessories }) {
  const isHappy = mood === "happy" || mood === "excited";
  const animateLoop = isHappy && !reducedMotion;
  const gradId = `bemnetGrad-${uid}`;
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CC9A48" />
          <stop offset="1" stopColor="#B9822C" />
        </linearGradient>
      </defs>
      <motion.line
        x1="45"
        y1="28"
        x2="38"
        y2="14"
        stroke="#8C611B"
        strokeWidth="3"
        strokeLinecap="round"
        animate={animateLoop ? { rotate: [-8, 8, -8] } : {}}
        style={{ transformOrigin: "45px 28px" }}
        transition={{ duration: 0.5, repeat: animateLoop ? Infinity : 0, repeatType: "mirror" }}
      />
      <circle cx="38" cy="12" r="5" fill="#B9822C" />
      <motion.line
        x1="75"
        y1="28"
        x2="82"
        y2="14"
        stroke="#8C611B"
        strokeWidth="3"
        strokeLinecap="round"
        animate={animateLoop ? { rotate: [8, -8, 8] } : {}}
        style={{ transformOrigin: "75px 28px" }}
        transition={{ duration: 0.5, repeat: animateLoop ? Infinity : 0, repeatType: "mirror" }}
      />
      <circle cx="82" cy="12" r="5" fill="#B9822C" />

      <circle cx="60" cy="66" r="34" fill={`url(#${gradId})`} />
      <circle cx="30" cy="60" r="18" fill={`url(#${gradId})`} />
      <circle cx="90" cy="60" r="18" fill={`url(#${gradId})`} />
      <circle cx="42" cy="42" r="14" fill={`url(#${gradId})`} />
      <circle cx="78" cy="42" r="14" fill={`url(#${gradId})`} />

      <ellipse cx="60" cy="70" rx="32" ry="28" fill="#F6EEE3" opacity="0.92" />
      <Face mood={mood} cx={60} cy={68} eyeGap={14} accessories={accessories} />
      {isHappy && (
        <ellipse cx="60" cy="94" rx="7" ry="5" fill="#B8492F" opacity="0.85" />
      )}
    </>
  );
}

function SabaShape({ mood, uid, accessories }) {
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
      <ellipse cx="53" cy="14" rx="7" ry="5" fill="#1E6B60" transform="rotate(-25 53 14)" />
      <ellipse cx="67" cy="14" rx="7" ry="5" fill="#2B8478" transform="rotate(25 67 14)" />

      <circle cx="60" cy={cy} r="34" fill={`url(#${gradId})`} />
      <circle cx="60" cy={cy - 26} r="8" fill={`url(#${gradId})`} />

      <Face mood={mood} cx={60} cy={cy} eyeGap={eyeGap} accessories={accessories} />

      {/* glasses */}
      <circle cx={60 - eyeGap} cy={cy} r="11" fill="none" stroke="#2A2019" strokeWidth="2.5" />
      <circle cx={60 + eyeGap} cy={cy} r="11" fill="none" stroke="#2A2019" strokeWidth="2.5" />
      <path d={`M${60 - eyeGap + 11} ${cy} L${60 + eyeGap - 11} ${cy}`} stroke="#2A2019" strokeWidth="2.5" />
      <path d={`M${60 - eyeGap - 11} ${cy - 2} L${60 - eyeGap - 18} ${cy - 6}`} stroke="#2A2019" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M${60 + eyeGap + 11} ${cy - 2} L${60 + eyeGap + 18} ${cy - 6}`} stroke="#2A2019" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

function TesfaShape({ mood, uid, reducedMotion, accessories }) {
  const isHappy = (mood === "happy" || mood === "excited") && !reducedMotion;
  const gradId = `tesfaGrad-${uid}`;
  return (
    <>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFA98F" />
          <stop offset="1" stopColor="#B8492F" />
        </linearGradient>
      </defs>
      <motion.ellipse
        cx="26"
        cy="52"
        rx="13"
        ry="20"
        fill="#F1DDD2"
        style={{ transformOrigin: "38px 46px" }}
        animate={isHappy ? { rotate: [-6, 6, -6] } : { rotate: -6 }}
        transition={{ duration: 0.7, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
      />
      <motion.ellipse
        cx="94"
        cy="52"
        rx="13"
        ry="20"
        fill="#F1DDD2"
        style={{ transformOrigin: "82px 46px" }}
        animate={isHappy ? { rotate: [6, -6, 6] } : { rotate: 6 }}
        transition={{ duration: 0.7, repeat: isHappy ? Infinity : 0, repeatType: "mirror" }}
      />
      <path
        d="M60 92 C18 64 22 28 46 22 C55 20 60 30 60 38 C60 30 65 20 74 22 C98 28 102 64 60 92 Z"
        fill={`url(#${gradId})`}
      />
      <ellipse cx="60" cy="56" rx="28" ry="24" fill="#F6EEE3" opacity="0.92" />
      <Face mood={mood} cx={60} cy={54} eyeGap={12} accessories={accessories} />
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

export default function Mascot({ mascotId = "zaki", mood = "neutral", size = 120, className = "", accessories = [] }) {
  const Shape = SHAPES[mascotId] || ZakiShape;
  const uid = useId();
  const { settings } = useSettingsContext();
  const reducedMotion = settings.reducedMotion;
  // Saba's design already includes glasses as part of her character —
  // stacking a second pair would just look like a rendering bug.
  const effectiveAccessories = mascotId === "saba" ? accessories.filter((a) => a !== "glasses") : accessories;

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, filter: "drop-shadow(0 6px 10px rgba(42, 32, 25, 0.18))" }}
      animate={reducedMotion ? {} : BODY_ANIMATIONS[mood] || BODY_ANIMATIONS.neutral}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <Shape mood={mood} uid={uid} reducedMotion={reducedMotion} accessories={effectiveAccessories} />
      </svg>
    </motion.div>
  );
}
