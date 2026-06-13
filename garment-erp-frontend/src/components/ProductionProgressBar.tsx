interface Props {
  value: number;
  planned: number;
  actual: number;
}

export default function ProductionProgressBar({ value, planned, actual }: Props) {
  const color = value >= 100 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-500' : 'bg-teal-500';
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-[11px] font-mono text-slate-400">
        <span>{actual.toLocaleString()} / {planned.toLocaleString()}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-800">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}
