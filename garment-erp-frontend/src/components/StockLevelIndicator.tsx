export default function StockLevelIndicator({ current, min }: { current: number; min: number }) {
  const ratio = min > 0 ? current / min : current > 0 ? 2 : 0;
  let color = 'bg-emerald-500';
  let text = 'text-emerald-400';
  if (ratio <= 1) {
    color = 'bg-rose-500';
    text = 'text-rose-400';
  } else if (ratio <= 1.5) {
    color = 'bg-amber-500';
    text = 'text-amber-400';
  }
  const pct = Math.min(100, Math.round(ratio * 50));
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`font-mono text-xs ${text}`}>{current}</span>
    </div>
  );
}
