import { useGetDashboardSummaryQuery } from '../api/dashboardApi';
import KPICard from '../components/KPICard';
import PageHeader from '../components/PageHeader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const STAGE_LABELS: Record<string, string> = {
  knitting: 'Knitting',
  yarnDyeing: 'Yarn Dyeing',
  greyFabricReceipt: 'Grey Fabric',
  fabricDyeing: 'Fabric Dyeing',
  finishing: 'Finishing',
  fabricCutting: 'Cutting',
  sewing: 'Sewing',
  ironing: 'Ironing',
  packing: 'Packing',
  finalInspection: 'Final QC',
};

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardSummaryQuery();
  const kpis = data?.data.kpis;
  const pnl = data?.data.pnl;
  const chartData = (data?.data.productionByStage || []).map((s) => ({
    stage: STAGE_LABELS[s._id] || s._id,
    Planned: s.planned,
    Actual: s.actual,
  }));

  return (
    <div>
      <PageHeader title="Production Control Center" subtitle="Overview" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total Orders" value={kpis?.totalOrders ?? '—'} icon={<span>▤</span>} accent="teal" />
        <KPICard label="In Production" value={kpis?.inProduction ?? '—'} icon={<span>⚙</span>} accent="amber" />
        <KPICard label="Dispatched" value={kpis?.dispatched ?? '—'} icon={<span>▶</span>} accent="emerald" />
        <KPICard label="Low Stock Alerts" value={kpis?.lowStockCount ?? '—'} icon={<span>⚠</span>} accent="rose" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <p className="label-tag mb-4">Production Pipeline — Planned vs Actual</p>
          {isLoading ? (
            <div className="flex h-72 items-center justify-center text-slate-500">Loading…</div>
          ) : chartData.length === 0 ? (
            <div className="flex h-72 items-center justify-center text-slate-500">No production data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2c3f" />
                <XAxis dataKey="stage" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" height={70} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#16202f', border: '1px solid #2c3c54', borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="Planned" fill="#2c3c54" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#f0a020" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="panel p-5">
          <p className="label-tag mb-4">Profit &amp; Loss Snapshot</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-700 pb-3">
              <span className="text-sm text-slate-400">Total Revenue (selling price)</span>
              <span className="font-mono text-lg font-semibold text-teal-300">
                {(pnl?.totalRevenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-ink-700 pb-3">
              <span className="text-sm text-slate-400">Total Cost</span>
              <span className="font-mono text-lg font-semibold text-amber-300">
                {(pnl?.totalCost ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Net Profit</span>
              <span className={`font-mono text-2xl font-bold ${((pnl?.profit ?? 0) >= 0) ? 'text-emerald-400' : 'text-rose-400'}`}>
                {(pnl?.profit ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
