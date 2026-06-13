import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { useCreateOrderMutation } from '../../api/ordersApi';
import type { Assortment } from '../../types';

export default function OrderFormModal({ onClose }: { onClose: () => void }) {
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [form, setForm] = useState({
    type: 'bulk',
    buyer: '',
    agent: '',
    styleCategory: '',
    season: '',
    deliveryDate: '',
    destination: '',
    agentCommission: 0,
    remarks: '',
  });
  const [assortments, setAssortments] = useState<Assortment[]>([{ size: '', color: '', quantity: 0 }]);

  const updateAssort = (idx: number, field: keyof Assortment, value: string) => {
    setAssortments((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: field === 'quantity' ? Number(value) : value } : a))
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrder({
        ...form,
        agentCommission: Number(form.agentCommission),
        garmentAssortments: assortments.filter((a) => a.size && a.quantity),
      } as any).unwrap();
      toast.success('Order created successfully');
      onClose();
    } catch {
      toast.error('Failed to create order. Check required fields.');
    }
  };

  return (
    <Modal title="Create New Order" onClose={onClose} wide>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label">Order Type</label>
            <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="bulk">Bulk</option>
              <option value="sample">Sample</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Buyer *</label>
            <input
              className="input-field"
              required
              value={form.buyer}
              onChange={(e) => setForm({ ...form, buyer: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Agent</label>
            <input className="input-field" value={form.agent} onChange={(e) => setForm({ ...form, agent: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Style Category</label>
            <input
              className="input-field"
              value={form.styleCategory}
              onChange={(e) => setForm({ ...form, styleCategory: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Season</label>
            <input className="input-field" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Delivery Date</label>
            <input
              type="date"
              className="input-field"
              value={form.deliveryDate}
              onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Destination</label>
            <input
              className="input-field"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Agent Commission %</label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              value={form.agentCommission}
              onChange={(e) => setForm({ ...form, agentCommission: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="field-label mb-0">Garment Assortment (size / color / qty)</label>
            <button
              type="button"
              className="text-xs font-mono text-amber-400 hover:underline"
              onClick={() => setAssortments((p) => [...p, { size: '', color: '', quantity: 0 }])}
            >
              + add row
            </button>
          </div>
          <div className="space-y-2">
            {assortments.map((a, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                <input
                  className="input-field"
                  placeholder="Size (e.g. M)"
                  value={a.size}
                  onChange={(e) => updateAssort(idx, 'size', e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Color"
                  value={a.color}
                  onChange={(e) => updateAssort(idx, 'color', e.target.value)}
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Quantity"
                  value={a.quantity || ''}
                  onChange={(e) => updateAssort(idx, 'quantity', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label">Remarks</label>
          <textarea
            className="input-field"
            rows={2}
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-400 ring-1 ring-rose-500/30">
            Failed to create order. Check required fields.
          </p>
        )}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Create Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
