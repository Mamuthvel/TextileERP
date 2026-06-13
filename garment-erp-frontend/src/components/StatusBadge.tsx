const STYLES: Record<string, string> = {
  enquiry: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 ring-1 ring-slate-500/30',
  quotation: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/30',
  confirmed: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/30',
  inProduction: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30',
  dispatched: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/30',
  invoiced: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30',
  closed: 'bg-slate-700/10 dark:bg-slate-700/40 text-slate-600 dark:text-slate-400 ring-1 ring-slate-500/30',
  // shared with PO / dispatch / invoice statuses
  draft: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 ring-1 ring-slate-500/30',
  sent: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/30',
  acknowledged: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/30',
  partiallyReceived: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30',
  fullyReceived: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30',
  paid: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30',
  overdue: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30',
  pending: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 ring-1 ring-slate-500/30',
  packed: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30',
  shipped: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/30',
  delivered: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30',
  pass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30',
  fail: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30',
  conditional: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30',
  planned: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 ring-1 ring-slate-500/30',
  inProgress: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30',
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30',
  onHold: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/30',
};

const LABELS: Record<string, string> = {
  inProduction: 'In Production',
  partiallyReceived: 'Partial Recv.',
  fullyReceived: 'Fully Recv.',
  onHold: 'On Hold',
  inProgress: 'In Progress',
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = STYLES[status] || 'bg-slate-500/15 text-slate-600 dark:text-slate-300 ring-1 ring-slate-500/30';
  const label = LABELS[status] || status;
  return <span className={`badge ${cls}`}>{label}</span>;
}
