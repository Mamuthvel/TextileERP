import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { useCreateProductionOrderMutation } from '../../api/productionApi';
import { useGetOrdersQuery } from '../../api/ordersApi';

const STAGES = [
  'knitting', 'yarnDyeing', 'greyFabricReceipt', 'fabricDyeing', 'finishing',
  'fabricCutting', 'sewing', 'ironing', 'packing', 'finalInspection',
];

export default function ProductionOrderModal({
  onClose,
  defaultOrderId,
}: {
  onClose: () => void;
  defaultOrderId?: string;
}) {
  const { data: orders } = useGetOrdersQuery({ limit: 100 }, { skip: !!defaultOrderId });
  const [create, { isLoading, error }] = useCreateProductionOrderMutation();
  const [form, setForm] = useState({
    orderId: defaultOrderId || '',
    stage: 'knitting',
    processUnit: '',
    plannedQuantity: 0,
    operator: '',
    supervisor: '',
    machineName: '',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create(form as any).unwrap();
      toast.success('Production order created');
      onClose();
    } catch { toast.error('Failed to create production order.'); }
  };

  return (
    <Modal title="New Production Order" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        {!defaultOrderId ? (
          <div>
            <label className="field-label">Linked Order</label>
            <select className="input-field" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })}>
              <option value="">— None —</option>
              {orders?.data.map((o) => (
                <option key={o._id} value={o._id}>{o.orderNo} — {o.buyer}</option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label className="field-label">Stage</label>
          <select className="input-field" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s.replace(/([A-Z])/g, ' $1').trim()}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Planned Quantity *</label>
            <input
              type="number"
              required
              className="input-field"
              value={form.plannedQuantity}
              onChange={(e) => setForm({ ...form, plannedQuantity: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="field-label">Process Unit</label>
            <input className="input-field" value={form.processUnit} onChange={(e) => setForm({ ...form, processUnit: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Machine</label>
            <input className="input-field" value={form.machineName} onChange={(e) => setForm({ ...form, machineName: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Supervisor</label>
            <input className="input-field" value={form.supervisor} onChange={(e) => setForm({ ...form, supervisor: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="field-label">Operator</label>
          <input className="input-field" value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })} />
        </div>

        {error && <p className="text-sm text-rose-400">Failed to create production order.</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
