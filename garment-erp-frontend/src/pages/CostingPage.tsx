import { useState } from 'react';
import { useGetOrdersQuery } from '../api/ordersApi';
import { useCompareCostingQuery } from '../api/costingApi';
import PageHeader from '../components/PageHeader';
import CostingFormModal from '../components/costing/CostingFormModal';

const COST_FIELDS: { key: string; label: string }[] = [
  { key: 'yarnCost', label: 'Yarn Cost' },
  { key: 'fabricCost', label: 'Fabric Cost' },
  { key: 'trimmingCost', label: 'Trimming Cost' },
  { key: 'dyeingCost', label: 'Dyeing Cost' },
  { key: 'sewingCost', label: 'Sewing/CMT Cost' },
  { key: 'overheadCost', label: 'Overhead' },
  { key: 'packingCost', label: 'Packing Cost' },
  { key: 'totalCost', label: 'Total Cost' },
];

export default function CostingPage() {
  const { data: orders } = useGetOrdersQuery({ limit: 100 });
  const [orderId, setOrderId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [costingType, setCostingType] = useState<'estimate' | 'post'>('estimate');
  const { data: compare, isFetching, isError } = useCompareCostingQuery(orderId, { skip: !orderId });

  return (
    <div>
      <PageHeader
        title="Cost Sheets & Margins"
        subtitle="Estimate vs Post-Production"
        actions={
          <button className="btn-primary" disabled={!orderId} onClick={() => setShowModal(true)}>
            + Add Cost Sheet
          </button>
        }
      />

      <div className="mb-4 flex gap-3">
        <select className="input-field max-w-sm" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
          <option value="">Select an order…</option>
          {orders?.data.map((o) => (
            <option key={o._id} value={o._id}>
              {o.orderNo} — {o.buyer}
            </option>
          ))}
        </select>
        {orderId && (
          <select className="input-field max-w-[160px]" value={costingType} onChange={(e) => setCostingType(e.target.value as any)}>
            <option value="estimate">Estimate</option>
            <option value="post">Post-Production</option>
          </select>
        )}
      </div>

      {!orderId && <div className="panel p-8 text-center text-slate-500">Select an order to view its cost sheet comparison.</div>}

      {orderId && isFetching && <div className="panel p-8 text-center text-slate-500">Loading cost sheets…</div>}

      {orderId && isError && (
        <div className="panel p-8 text-center text-slate-500">
          No complete cost comparison yet — add both an <span className="text-amber-400">estimate</span> and a{' '}
          <span className="text-amber-400">post-production</span> cost sheet for this order.
        </div>
      )}

      {compare?.data && (
        <div className="panel table-wrap overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Cost Component</th>
                <th>Estimate</th>
                <th>Actual (Post)</th>
                <th>Variance</th>
                <th>Variance %</th>
              </tr>
            </thead>
            <tbody>
              {COST_FIELDS.map((f) => {
                const v = compare.data.variance[f.key];
                const isTotal = f.key === 'totalCost';
                return (
                  <tr key={f.key} className={isTotal ? 'font-semibold text-slate-900 dark:text-slate-50' : ''}>
                    <td>{f.label}</td>
                    <td className="font-mono">{v?.estimate?.toLocaleString()}</td>
                    <td className="font-mono">{v?.post?.toLocaleString()}</td>
                    <td className={`font-mono ${v?.variance > 0 ? 'text-rose-400' : v?.variance < 0 ? 'text-emerald-400' : ''}`}>
                      {v?.variance > 0 ? '+' : ''}
                      {v?.variance?.toLocaleString()}
                    </td>
                    <td className={`font-mono ${v?.variancePct > 0 ? 'text-rose-400' : v?.variancePct < 0 ? 'text-emerald-400' : ''}`}>
                      {v?.variancePct}%
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="font-semibold text-slate-900 dark:text-slate-50">Selling Price</td>
                <td className="font-mono">{compare.data.estimate.sellingPrice.toLocaleString()}</td>
                <td className="font-mono">{compare.data.post.sellingPrice.toLocaleString()}</td>
                <td colSpan={2} />
              </tr>
              <tr>
                <td className="font-semibold text-slate-900 dark:text-slate-50">Profit Margin</td>
                <td className="font-mono text-teal-300">{compare.data.estimate.profitMargin}%</td>
                <td className="font-mono text-teal-300">{compare.data.post.profitMargin}%</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {showModal && orderId && <CostingFormModal orderId={orderId} type={costingType} onClose={() => setShowModal(false)} />}
    </div>
  );
}
