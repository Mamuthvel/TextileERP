import { useState } from 'react';
import { useGetStylesQuery, useCreateStyleMutation, useUpdateStyleMutation } from '../api/stylesApi';
import { useGetOrdersQuery } from '../api/ordersApi';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Skeleton } from '../components/Skeleton';

const STATUS_STYLES: Record<string, string> = {
  design: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 ring-1 ring-slate-500/30',
  approved: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500/30',
  inProduction: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/30',
};

export default function DesignPage() {
  const { data, isLoading } = useGetStylesQuery({ limit: 100 });
  const { data: orders } = useGetOrdersQuery({ limit: 100 });
  const [createStyle, { isLoading: creating, error }] = useCreateStyleMutation();
  const [updateStyle] = useUpdateStyleMutation();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ styleNo: '', orderId: '', description: '', fabric: '', fabricGSM: 0 });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStyle({ ...form, orderId: form.orderId || undefined } as any).unwrap();
      setShowModal(false);
      setForm({ styleNo: '', orderId: '', description: '', fabric: '', fabricGSM: 0 });
    } catch {
      //
    }
  };

  return (
    <div>
      <PageHeader
        title="Design & Sampling"
        subtitle="Style Library · Tech Packs · BOM"
        actions={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Style
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="panel p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
        {!isLoading && (data?.data.length ?? 0) === 0 && <p className="text-slate-500">No styles created yet.</p>}
        {data?.data.map((s) => (
          <div key={s._id} className="panel p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-amber-400">{s.styleNo}</span>
              <span className={`badge ${STATUS_STYLES[s.status]}`}>{s.status}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{s.description || 'No description'}</p>
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              {s.fabric && <p>Fabric: {s.fabric}</p>}
              {s.fabricGSM ? <p>GSM: {s.fabricGSM}</p> : null}
            </div>
            <div className="mt-4 flex gap-2">
              {s.status === 'design' && (
                <button className="btn-secondary !py-1 !px-2 !text-xs" onClick={() => updateStyle({ id: s._id, body: { status: 'approved' } })}>
                  Approve
                </button>
              )}
              {s.status === 'approved' && (
                <button className="btn-secondary !py-1 !px-2 !text-xs" onClick={() => updateStyle({ id: s._id, body: { status: 'inProduction' } })}>
                  Send to Production
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="New Style" onClose={() => setShowModal(false)}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="field-label">Style No. *</label>
              <input className="input-field" required value={form.styleNo} onChange={(e) => setForm({ ...form, styleNo: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Linked Order</label>
              <select className="input-field" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })}>
                <option value="">— None —</option>
                {orders?.data.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.orderNo} — {o.buyer}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Description</label>
              <input className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Fabric</label>
                <input className="input-field" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Fabric GSM</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.fabricGSM}
                  onChange={(e) => setForm({ ...form, fabricGSM: Number(e.target.value) })}
                />
              </div>
            </div>

            {error && <p className="text-sm text-rose-400">Failed to create style (style no. may already exist).</p>}

            <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" disabled={creating} className="btn-primary">
                {creating ? 'Saving…' : 'Create Style'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
