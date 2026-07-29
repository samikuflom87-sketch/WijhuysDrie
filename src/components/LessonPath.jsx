const OFFSET_PATTERN = [0, 64, 96, 64, 0, -64, -96, -64];
const BUBBLE_SIZE = 96;
const LABEL_BLOCK = 28;
const GAP = 40;
const PITCH = BUBBLE_SIZE + LABEL_BLOCK + GAP;
const HALF_WIDTH = 140;

// A soft dashed line snaking behind the lesson bubbles above — the single
// most recognizable piece of Duolingo's visual language. Positioned as an
// absolute-fill background layer; the bubbles render on top of it.
export default function LessonPath({ count }) {
  if (count < 2) return null;

  const points = Array.from({ length: count }, (_, i) => ({
    x: HALF_WIDTH + OFFSET_PATTERN[i % OFFSET_PATTERN.length],
    y: BUBBLE_SIZE / 2 + i * PITCH,
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const midY = (prev.y + cur.y) / 2;
    d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
  }

  const height = BUBBLE_SIZE / 2 + (count - 1) * PITCH + BUBBLE_SIZE / 2;

  return (
    <svg
      className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
      width={HALF_WIDTH * 2}
      height={height}
      viewBox={`0 0 ${HALF_WIDTH * 2} ${height}`}
      style={{ zIndex: 0 }}
    >
      <path
        d={d}
        fill="none"
        stroke="var(--color-brand-line-dark)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="2 22"
        opacity="0.7"
      />
    </svg>
  );
}
