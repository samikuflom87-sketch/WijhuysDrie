// Illustrations for Habesha Steps, keyed by the `image` field in
// lessons.json. Concrete, real-world concepts (food, gestures, greetings,
// question words) render as custom solid-glyph icons from Icon.jsx — the
// same drawn icon system used for the rest of the app's chrome, instead of
// third-party Twemoji artwork. Family members and numbers keep separate
// custom illustrations: a handful of generic person icons can't distinguish
// "brother" from "boy" from "man" as clearly as the hair/prop system below
// can, and NumberDots shows an actual countable quantity rather than just a
// printed digit.
import Icon from "./Icon";

const INK = "#2A2019";
const CORAL = "#B8492F";
const CORAL_LIGHT = "#FFD9CC";
const TEAL = "#1E6B60";
const TEAL_LIGHT = "#BFEDEA";
const YELLOW = "#B9822C";

// Maps each lessons.json `image` key to a drawn Icon glyph + accent color.
const CONCEPT_ICONS = {
  wave: ["wave", CORAL],
  "ask-man": ["handQuestion", TEAL],
  "ask-woman": ["handQuestion", TEAL],
  thumbsup: ["thumbsUp", CORAL],
  heart: ["heart", CORAL],
  check: ["check", TEAL],
  cross: ["cross", CORAL],
  chat: ["chat", TEAL],
  smile: ["smile", YELLOW],
  "bye-man": ["wave", TEAL],
  water: ["water", TEAL],
  bread: ["bread", YELLOW],
  tea: ["tea", CORAL],
  coffee: ["coffee", INK],
  milk: ["milk", TEAL],
  meat: ["meat", CORAL],
  egg: ["egg", YELLOW],
  salt: ["salt", TEAL],
  sugar: ["sugar", YELLOW],
  food: ["food", CORAL],
  hands: ["hands", TEAL],
  sorry: ["sorry", YELLOW],
  offer: ["offer", CORAL],
  what: ["what", TEAL],
  pin: ["pin", CORAL],
  clock: ["clock", INK],
  price: ["price", TEAL],
  point: ["point", CORAL],
  shrug: ["shrug", YELLOW],
  star: ["star", YELLOW],
};

// Fixed-proportion figure drawn in a 100x100 box. Use <ScaledPerson> to
// resize/reposition without distorting the head/body proportions.
function Person({ hair, accessory, bodyColor, headColor = "#F0C892" }) {
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

const FAMILY_ILLUSTRATIONS = {
  father: <Person hair="short" accessory="mustache" bodyColor={TEAL} />,
  mother: <Person hair="bun" accessory="flower" bodyColor={CORAL} />,
  man: <Person hair="short" bodyColor={TEAL} />,
  woman: <Person hair="bun" bodyColor={CORAL} />,
  brother: <ScaledPerson scale={0.85} hair="short" bodyColor={YELLOW} />,
  sister: <ScaledPerson scale={0.85} hair="ponytail" bodyColor={YELLOW} />,
  boy: <ScaledPerson scale={0.68} hair="short" bodyColor={CORAL_LIGHT} />,
  girl: <ScaledPerson scale={0.68} hair="pigtails" bodyColor={TEAL_LIGHT} />,
  child: <ScaledPerson scale={0.6} hair="short" bodyColor={YELLOW} />,
  family: <Family />,
};

export default function Illustration({ name, size = 96, className = "" }) {
  if (!name) return null;

  if (name in CONCEPT_ICONS) {
    const [iconName, color] = CONCEPT_ICONS[name];
    return <Icon name={iconName} size={size} className={className} style={{ color }} />;
  }

  if (name in NUMBER_VALUES) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
        <NumberDots count={NUMBER_VALUES[name]} />
      </svg>
    );
  }

  const content = FAMILY_ILLUSTRATIONS[name];
  if (!content) return null;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      {content}
    </svg>
  );
}
