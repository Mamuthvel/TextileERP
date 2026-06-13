import type { ReactNode } from 'react';

export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-ink-700 pb-5">
      <div>
        <p className="label-tag">{subtitle}</p>
        <h1 className="mt-1 font-mono text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
