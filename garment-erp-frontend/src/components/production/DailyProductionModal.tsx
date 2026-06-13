import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { useAddDailyProductionMutation } from '../../api/productionApi';
import type { ProductionOrder } from '../../types';

export default function DailyProductionModal({ order, onClose }: { order: ProductionOrder; onClose: () => void }) {
  const [addDaily, { isLoading, error }] = useAddDailyProductionMutation();
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), qty: 0, shift: 'Day' });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDaily({ id: order._id, body: form }).unwrap();
      toast.success('Production output logged');
      onClose();
    } catch {
      toast.error('Failed to log production output.');
    }
  };

  return (
    <Modal title={`Log Output — ${order.prodOrderNo}`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <p className="text-sm text-slate-400">
          Planned: <span className="font-mono text-slate-800 dark:text-slate-200">{order.plannedQuantity}</span> · Produced so far:{' '}
          <span className="font-mono text-slate-800 dark:text-slate-200">{order.actualQuantity}</span>
        </p>
        <div>
          <label className="field-label">Date</label>
          <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Quantity Produced *</label>
          <input
            type="number"
            required
            className="input-field"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="field-label">Shift</label>
          <select className="input-field" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })}>
            <option>Day</option>
            <option>Night</option>
          </select>
        </div>

        {error && <p className="text-sm text-rose-400">Failed to log output.</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Log Production'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
