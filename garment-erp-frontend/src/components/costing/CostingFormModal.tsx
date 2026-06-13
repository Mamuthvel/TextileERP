import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { useCreateCostingMutation } from '../../api/costingApi';

const FIELDS = [
  { key: 'yarnCost', label: 'Yarn Cost' },
  { key: 'fabricCost', label: 'Fabric Cost' },
  { key: 'trimmingCost', label: 'Trimming Cost' },
  { key: 'dyeingCost', label: 'Dyeing Cost' },
  { key: 'sewingCost', label: 'Sewing/CMT Cost' },
  { key: 'overheadCost', label: 'Overhead' },
  { key: 'packingCost', label: 'Packing Cost' },
];

export default function CostingFormModal({
  orderId,
  type,
  onClose,
}: {
  orderId: string;
  type: 'estimate' | 'post';
  onClose: () => void;
}) {
  const [create, { isLoading, error }] = useCreateCostingMutation();
  const [form, setForm] = useState<Record<string, number>>({
    yarnCost: 0,
    fabricCost: 0,
    trimmingCost: 0,
    dyeingCost: 0,
    sewingCost: 0,
    overheadCost: 0,
    packingCost: 0,
  });
  const [sellingPrice, setSellingPrice] = useState(0);
  const [currency, setCurrency] = useState('INR');

  const total = Object.values(form).reduce((s, v) => s + (Number(v) || 0), 0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({ orderId, type, ...form, sellingPrice, currency } as any).unwrap();
      toast.success('Cost sheet saved');
      onClose();
    } catch {
      toast.error('Failed to save cost sheet.');
    }
  };

  return (
    <Modal title={`Add ${type === 'estimate' ? 'Estimate' : 'Post-Production'} Cost Sheet`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="field-label">{f.label}</label>
              <input
                type="number"
                className="input-field"
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-ink-700 pt-4">
          <div>
            <label className="field-label">Selling Price</label>
            <input type="number" className="input-field" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} />
          </div>
          <div>
            <label className="field-label">Currency</label>
            <input className="input-field" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
        </div>

        <p className="font-mono text-sm text-slate-600 dark:text-slate-300">
          Total Cost: <span className="text-amber-500 dark:text-amber-400">{total.toLocaleString()}</span>
        </p>

        {error && <p className="text-sm text-rose-400">Failed to save cost sheet.</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Save Cost Sheet'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
