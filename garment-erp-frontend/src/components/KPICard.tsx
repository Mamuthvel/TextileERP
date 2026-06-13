import type { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: string; positive?: boolean };
  accent?: 'amber' | 'teal' | 'rose' | 'emerald';
}

const ACCENTS: Record<string, string> = {
  amber: 'text-amber-400 bg-amber-500/10 ring-amber-500/20',
  teal: 'text-teal-400 bg-teal-500/10 ring-teal-500/20',
  rose: 'text-rose-400 bg-rose-500/10 ring-rose-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/20',
};

export default function KPICard({ label, value, icon, trend, accent = 'amber' }: KPICardProps) {
  return (
    <div className="panel relative overflow-hidden p-5">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/5" />
      <div className="flex items-start justify-between">
        <div>
          <p className="label-tag">{label}</p>
          <p className="mt-2 font-mono text-3xl font-bold text-slate-900 dark:text-slate-50">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${ACCENTS[accent]}`}>{icon}</div>
      </div>
      {trend && (
        <p className={`mt-3 text-xs font-medium ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>{trend.value}</p>
      )}
    </div>
  );
}
