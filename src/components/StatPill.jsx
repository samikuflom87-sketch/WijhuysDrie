export default function StatPill({ icon, value, color = "#4B4B4B" }) {
  return (
    <div className="flex items-center gap-1 font-extrabold text-lg" style={{ color }}>
      <span className="text-xl leading-none">{icon}</span>
      <span>{value}</span>
    </div>
  );
}
