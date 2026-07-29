// A compact contribution-graph style calendar of active days, built from
// progress.activeDates (a plain array of "YYYY-MM-DD" strings appended to
// on every lesson completion).
const TOTAL_DAYS = 70;

function buildDays(activeDates) {
  const activeSet = new Set(activeDates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = TOTAL_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ key, active: activeSet.has(key), isToday: i === 0 });
  }
  return days;
}

export default function StreakCalendar({ activeDates }) {
  const days = buildDays(activeDates || []);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="rounded-2xl p-4 card-soft" style={{ background: "var(--color-brand-surface)" }}>
      <p
        className="text-xs font-extrabold uppercase tracking-wide mb-3"
        style={{ color: "var(--color-brand-ink-light)" }}
      >
        Your streak calendar
      </p>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.key}
                title={day.key}
                className="rounded-sm"
                style={{
                  width: 10,
                  height: 10,
                  background: day.active ? "var(--color-brand-coral)" : "var(--color-brand-line)",
                  outline: day.isToday ? "1.5px solid var(--color-brand-teal)" : "none",
                  outlineOffset: 1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
