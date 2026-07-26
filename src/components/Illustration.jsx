// Original flat-pictogram illustrations for Habesha Steps, keyed by the
// `image` field in lessons.json. No photos, no borrowed icon sets.

const INK = "#4A3527";
const CORAL = "#FF6B4A";
const CORAL_LIGHT = "#FFD9CC";
const TEAL = "#00A19D";
const TEAL_LIGHT = "#BFEDEA";
const YELLOW = "#FFC93C";
const CREAM = "#FFF6EC";
const TAN = "#F0C892";

// Fixed-proportion figure drawn in a 100x100 box. Use <ScaledPerson> to
// resize/reposition without distorting the head/body proportions.
function Person({ hair, accessory, bodyColor, headColor = TAN }) {
  return (
    <g>
      {/* body */}
      <path d="M50 46 C36 46 30 66 28 100 L72 100 C70 66 64 46 50 46 Z" fill={bodyColor} />
      {/* head */}
      <circle cx="50" cy="32" r="18" fill={headColor} />
      {/* hair */}
      {hair === "short" && <path d="M32 28 a18 16 0 0 1 36 0 v-3 a18 14 0 0 0 -36 0 Z" fill={INK} />}
      {hair === "bun" && (
        <>
          <path d="M32 28 a18 16 0 0 1 36 0 v-3 a18 14 0 0 0 -36 0 Z" fill={INK} />
          <circle cx="50" cy="12" r="7" fill={INK} />
        </>
      )}
      {hair === "pigtails" && (
        <>
          <path d="M34 26 a16 14 0 0 1 32 0 v-3 a16 12 0 0 0 -32 0 Z" fill={INK} />
          <circle cx="28" cy="32" r="5" fill={INK} />
          <circle cx="72" cy="32" r="5" fill={INK} />
        </>
      )}
      {hair === "ponytail" && (
        <>
          <path d="M34 26 a16 14 0 0 1 32 0 v-3 a16 12 0 0 0 -32 0 Z" fill={INK} />
          <path d="M70 30 q10 6 4 22" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      )}
      {accessory === "mustache" && (
        <path d="M42 40 q8 5 16 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      {accessory === "flower" && (
        <circle cx="68" cy="22" r="5" fill={YELLOW} stroke={INK} strokeWidth="1" />
      )}
      {/* face */}
      <circle cx="44" cy="34" r="2.4" fill={INK} />
      <circle cx="56" cy="34" r="2.4" fill={INK} />
      <path d="M45 42 q5 4 10 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  );
}

// Scales a Person around its horizontal center while keeping its feet
// anchored to the bottom of the 100x100 box (so smaller figures don't clip).
function ScaledPerson({ scale = 1, dx = 0, ...personProps }) {
  const tx = (1 - scale) * 50 + dx;
  const ty = (1 - scale) * 100;
  return (
    <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
      <Person {...personProps} />
    </g>
  );
}

function Family() {
  return (
    <g>
      <ScaledPerson scale={0.62} dx={-22} hair="short" accessory="mustache" bodyColor={TEAL} />
      <ScaledPerson scale={0.62} dx={22} hair="bun" bodyColor={CORAL} />
      <ScaledPerson scale={0.42} dx={0} hair="short" bodyColor={YELLOW} />
    </g>
  );
}

function Droplet({ color = TEAL }) {
  return (
    <path
      d="M50 14 C64 34 78 52 78 68 A28 28 0 1 1 22 68 C22 52 36 34 50 14 Z"
      fill={color}
    />
  );
}

function Bread() {
  return (
    <g>
      <ellipse cx="50" cy="60" rx="34" ry="22" fill="#E8B778" />
      <ellipse cx="50" cy="55" rx="34" ry="20" fill="#F3CE94" />
      <path d="M30 48 Q35 40 40 48" stroke="#D89A55" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M45 46 Q50 38 55 46" stroke="#D89A55" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M60 48 Q65 40 70 48" stroke="#D89A55" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Cup({ withTag = false, liquid = TEAL }) {
  return (
    <g>
      <path d="M28 12 Q22 22 30 30" stroke={CORAL} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M50 8 Q44 20 50 28" stroke={CORAL} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M72 12 Q78 22 70 30" stroke={CORAL} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M26 38 L74 38 L68 76 A18 18 0 0 1 32 76 Z" fill={CREAM} stroke={INK} strokeWidth="2" />
      <path d="M32 44 L68 44 L64 72 A14 14 0 0 1 36 72 Z" fill={liquid} />
      <path d="M72 44 Q90 44 90 58 Q90 70 74 68" fill="none" stroke={INK} strokeWidth="3" />
      {withTag && <rect x="46" y="20" width="10" height="14" rx="2" fill={YELLOW} stroke={INK} strokeWidth="1.5" />}
      <ellipse cx="50" cy="80" rx="26" ry="5" fill="#E5D3BC" />
    </g>
  );
}

function Glass({ liquid = CREAM }) {
  return (
    <g>
      <path d="M34 24 L66 24 L60 80 L40 80 Z" fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <path d="M37 40 L63 40 L58.5 78 L41.5 78 Z" fill={liquid} />
    </g>
  );
}

function Meat() {
  return (
    <g>
      <circle cx="46" cy="42" r="26" fill="#E8916B" />
      <circle cx="46" cy="42" r="26" fill="none" stroke="#C46A44" strokeWidth="2" />
      <path
        d="M64 56 Q88 62 82 82 Q76 92 64 84 Q56 78 60 66 Z"
        fill="#F0DCC0"
        stroke="#C9AE86"
        strokeWidth="2"
      />
    </g>
  );
}

function Egg() {
  return (
    <g>
      <ellipse cx="50" cy="54" rx="26" ry="32" fill={CREAM} stroke="#E5D3BC" strokeWidth="2" />
      <ellipse cx="50" cy="56" rx="12" ry="12" fill={YELLOW} />
    </g>
  );
}

function Salt() {
  return (
    <g>
      <path d="M38 30 L62 30 L58 82 A8 8 0 0 1 42 82 Z" fill={CREAM} stroke={INK} strokeWidth="2.5" />
      <rect x="36" y="20" width="28" height="12" rx="4" fill={TEAL} />
      <circle cx="44" cy="26" r="1.6" fill={CREAM} />
      <circle cx="50" cy="24" r="1.6" fill={CREAM} />
      <circle cx="56" cy="26" r="1.6" fill={CREAM} />
    </g>
  );
}

function Sugar() {
  return (
    <g>
      <rect x="28" y="52" width="26" height="26" rx="5" fill={CREAM} stroke="#E5D3BC" strokeWidth="2" />
      <rect x="48" y="36" width="26" height="26" rx="5" fill={CREAM} stroke="#E5D3BC" strokeWidth="2" />
      <g fill={YELLOW}>
        <circle cx="63" cy="20" r="2" />
        <circle cx="70" cy="26" r="1.6" />
        <circle cx="58" cy="26" r="1.6" />
      </g>
    </g>
  );
}

function FoodPlate() {
  return (
    <g>
      <circle cx="50" cy="54" r="30" fill={CREAM} stroke="#E5D3BC" strokeWidth="3" />
      <circle cx="50" cy="54" r="20" fill="none" stroke="#E5D3BC" strokeWidth="2" />
      <ellipse cx="44" cy="50" rx="10" ry="8" fill={CORAL} />
      <circle cx="58" cy="56" r="7" fill={YELLOW} />
      <path d="M18 30 L18 50 M14 30 L14 42 M22 30 L22 42" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M82 30 Q86 40 82 50" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </g>
  );
}

function NumberDots({ count }) {
  const rows = count > 5 ? 2 : 1;
  const dots = [];
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const rowCount = row === rows - 1 ? count - row * 5 : 5;
    const startX = 50 - (rowCount - 1) * 9;
    dots.push({ x: startX + col * 18, y: rows === 1 ? 50 : 32 + row * 34 });
  }
  return (
    <g>
      <rect x="8" y="8" width="84" height="84" rx="20" fill={TEAL_LIGHT} />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="8" fill={CORAL} />
      ))}
    </g>
  );
}

const NUMBER_VALUES = {
  num1: 1, num2: 2, num3: 3, num4: 4, num5: 5,
  num6: 6, num7: 7, num8: 8, num9: 9, num10: 10,
};

export default function Illustration({ name, size = 96, className = "" }) {
  if (!name) return null;

  let content = null;

  if (name in NUMBER_VALUES) {
    content = <NumberDots count={NUMBER_VALUES[name]} />;
  } else {
    switch (name) {
      case "father":
        content = <Person hair="short" accessory="mustache" bodyColor={TEAL} />;
        break;
      case "mother":
        content = <Person hair="bun" accessory="flower" bodyColor={CORAL} />;
        break;
      case "man":
        content = <Person hair="short" bodyColor={TEAL} />;
        break;
      case "woman":
        content = <Person hair="bun" bodyColor={CORAL} />;
        break;
      case "brother":
        content = <ScaledPerson scale={0.85} hair="short" bodyColor={YELLOW} />;
        break;
      case "sister":
        content = <ScaledPerson scale={0.85} hair="ponytail" bodyColor={YELLOW} />;
        break;
      case "boy":
        content = <ScaledPerson scale={0.68} hair="short" bodyColor={CORAL_LIGHT} />;
        break;
      case "girl":
        content = <ScaledPerson scale={0.68} hair="pigtails" bodyColor={TEAL_LIGHT} />;
        break;
      case "child":
        content = <ScaledPerson scale={0.6} hair="short" bodyColor={YELLOW} />;
        break;
      case "family":
        content = <Family />;
        break;
      case "water":
        content = <Droplet color={TEAL} />;
        break;
      case "bread":
        content = <Bread />;
        break;
      case "tea":
        content = <Cup withTag liquid="#B5443A" />;
        break;
      case "coffee":
        content = <Cup liquid="#5B3A29" />;
        break;
      case "milk":
        content = <Glass liquid="#FFFDF7" />;
        break;
      case "meat":
        content = <Meat />;
        break;
      case "egg":
        content = <Egg />;
        break;
      case "salt":
        content = <Salt />;
        break;
      case "sugar":
        content = <Sugar />;
        break;
      case "food":
        content = <FoodPlate />;
        break;
      default:
        content = null;
    }
  }

  if (!content) return null;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      {content}
    </svg>
  );
}
