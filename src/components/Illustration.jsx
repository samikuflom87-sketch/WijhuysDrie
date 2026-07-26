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

function SymbolBadge({ bg, children }) {
  return (
    <g>
      <circle cx="50" cy="50" r="38" fill={bg} />
      {children}
    </g>
  );
}

function SpeechBubble({ symbol = "?", bg = TEAL }) {
  return (
    <g>
      <path
        d="M14 40 A34 26 0 0 1 48 14 A34 26 0 0 1 82 40 A34 26 0 0 1 52 66 L36 78 L40 62 A34 26 0 0 1 14 40 Z"
        fill={bg}
      />
      <text x="46" y="50" fontSize="30" fontWeight="800" fill={CREAM} textAnchor="middle" fontFamily="Baloo 2, sans-serif">
        {symbol}
      </text>
    </g>
  );
}

function WaveHand({ color = TAN }) {
  return (
    <g transform="rotate(-8 50 50)">
      <rect x="34" y="60" width="30" height="24" rx="12" fill={CORAL} />
      <path
        d="M36 62 L36 26 a6 6 0 0 1 12 0 L48 20 a6 6 0 0 1 12 0 L60 24 a6 6 0 0 1 12 0 L72 40 L72 62 Z"
        fill={color}
      />
      <path d="M14 30 Q10 22 16 16" stroke={CORAL} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M20 22 Q16 12 24 6" stroke={CORAL} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

function ThumbsUp() {
  return (
    <g>
      <rect x="34" y="52" width="32" height="34" rx="8" fill={CORAL} />
      <path
        d="M40 52 L40 34 Q40 22 50 18 Q56 16 54 26 L52 38 L70 38 Q78 38 76 46 L72 68 Q70 78 60 78 L40 78 Z"
        fill={TAN}
      />
    </g>
  );
}

function PointingHand() {
  return (
    <g transform="rotate(-20 50 50)">
      <rect x="30" y="58" width="26" height="22" rx="10" fill={CORAL} />
      <path
        d="M32 60 L32 28 a6 6 0 0 1 12 0 L44 60 Z"
        fill={TAN}
      />
      <rect x="30" y="52" width="14" height="14" rx="6" fill={TAN} />
      <rect x="26" y="46" width="12" height="14" rx="6" fill={TAN} />
    </g>
  );
}

function HeartIllustration() {
  return (
    <path
      d="M50 74 C24 56 18 36 32 26 C42 19 50 28 50 34 C50 28 58 19 68 26 C82 36 76 56 50 74 Z"
      fill={CORAL}
    />
  );
}

function SmileyFace({ worried = false }) {
  return (
    <g>
      <circle cx="38" cy="46" r="4" fill={INK} />
      <circle cx="62" cy="46" r="4" fill={INK} />
      {worried ? (
        <>
          <path d="M30 36 l10 5 M70 36 l-10 5" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M38 62 Q50 54 62 62" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <path d="M36 58 Q50 72 64 58" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      )}
    </g>
  );
}

function FoldedHands() {
  return (
    <g>
      <path
        d="M50 30 L28 46 a8 8 0 0 0 -2 10 L26 78 a6 6 0 0 0 10 4 L50 66 Z"
        fill={TAN}
      />
      <path
        d="M50 30 L72 46 a8 8 0 0 1 2 10 L74 78 a6 6 0 0 1 -10 4 L50 66 Z"
        fill="#E8B778"
      />
      <circle cx="50" cy="26" r="6" fill={YELLOW} />
    </g>
  );
}

function OfferHand() {
  return (
    <g>
      <rect x="24" y="64" width="52" height="16" rx="8" fill={TAN} />
      <path d="M24 64 Q50 50 76 64" fill={TAN} />
      <rect x="40" y="30" width="20" height="20" rx="4" fill={CORAL} />
      <path d="M40 38 L60 38" stroke={CREAM} strokeWidth="2.5" />
      <path d="M50 30 L50 50" stroke={CREAM} strokeWidth="2.5" />
    </g>
  );
}

function MapPin() {
  return (
    <g>
      <path
        d="M50 12 C32 12 20 26 20 42 C20 64 50 88 50 88 C50 88 80 64 80 42 C80 26 68 12 50 12 Z"
        fill={CORAL}
      />
      <circle cx="50" cy="42" r="14" fill={CREAM} />
    </g>
  );
}

function ClockIllustration() {
  return (
    <g>
      <circle cx="50" cy="52" r="34" fill={CREAM} stroke={INK} strokeWidth="3" />
      <circle cx="50" cy="52" r="3" fill={INK} />
      <path d="M50 52 L50 30" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M50 52 L66 58" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <rect x="42" y="10" width="16" height="8" rx="3" fill={TEAL} />
    </g>
  );
}

function PriceTag() {
  return (
    <g transform="rotate(-25 50 50)">
      <path
        d="M26 26 L58 26 L80 48 Q84 52 80 56 L60 76 Q56 80 52 76 L26 50 Z"
        fill={YELLOW}
        stroke={INK}
        strokeWidth="2.5"
      />
      <circle cx="38" cy="38" r="5" fill={CREAM} />
    </g>
  );
}

function Shrug() {
  return (
    <g>
      <circle cx="50" cy="38" r="18" fill={TAN} />
      <path d="M32 28 a18 16 0 0 1 36 0 v-3 a18 14 0 0 0 -36 0 Z" fill={INK} />
      <circle cx="44" cy="40" r="2.2" fill={INK} />
      <circle cx="56" cy="40" r="2.2" fill={INK} />
      <path d="M42 48 L58 48" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <text x="18" y="66" fontSize="20" fontWeight="800" fill={TEAL} fontFamily="Baloo 2, sans-serif">
        ?
      </text>
      <text x="72" y="30" fontSize="16" fontWeight="800" fill={CORAL} fontFamily="Baloo 2, sans-serif">
        ?
      </text>
    </g>
  );
}

function StarBadgeIllustration() {
  return (
    <path
      d="M50 16 L60 40 L86 42 L66 58 L72 84 L50 70 L28 84 L34 58 L14 42 L40 40 Z"
      fill={YELLOW}
    />
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
      case "wave":
        content = <WaveHand />;
        break;
      case "bye-man":
        content = (
          <g>
            <ScaledPerson scale={0.8} dx={-6} hair="short" bodyColor={TEAL} />
            <g transform="translate(30 -6) scale(0.55)">
              <WaveHand />
            </g>
          </g>
        );
        break;
      case "ask-man":
        content = (
          <g>
            <ScaledPerson scale={0.78} dx={-8} hair="short" bodyColor={TEAL} />
            <g transform="translate(24 4) scale(0.55)">
              <SpeechBubble symbol="?" bg={CORAL} />
            </g>
          </g>
        );
        break;
      case "ask-woman":
        content = (
          <g>
            <ScaledPerson scale={0.78} dx={-8} hair="bun" bodyColor={CORAL} />
            <g transform="translate(24 4) scale(0.55)">
              <SpeechBubble symbol="?" bg={TEAL} />
            </g>
          </g>
        );
        break;
      case "thumbsup":
        content = <ThumbsUp />;
        break;
      case "heart":
        content = <HeartIllustration />;
        break;
      case "check":
        content = (
          <SymbolBadge bg={TEAL}>
            <path d="M32 52 L44 64 L70 36" stroke={CREAM} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </SymbolBadge>
        );
        break;
      case "cross":
        content = (
          <SymbolBadge bg={CORAL}>
            <path d="M36 36 L64 64 M64 36 L36 64" stroke={CREAM} strokeWidth="8" strokeLinecap="round" />
          </SymbolBadge>
        );
        break;
      case "chat":
        content = <SpeechBubble symbol="…" bg={CORAL} />;
        break;
      case "what":
        content = <SpeechBubble symbol="?" bg={TEAL} />;
        break;
      case "smile":
        content = (
          <SymbolBadge bg={YELLOW}>
            <SmileyFace />
          </SymbolBadge>
        );
        break;
      case "sorry":
        content = (
          <SymbolBadge bg={TEAL_LIGHT}>
            <SmileyFace worried />
          </SymbolBadge>
        );
        break;
      case "hands":
        content = <FoldedHands />;
        break;
      case "offer":
        content = <OfferHand />;
        break;
      case "pin":
        content = <MapPin />;
        break;
      case "clock":
        content = <ClockIllustration />;
        break;
      case "price":
        content = <PriceTag />;
        break;
      case "point":
        content = <PointingHand />;
        break;
      case "shrug":
        content = <Shrug />;
        break;
      case "star":
        content = <StarBadgeIllustration />;
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
