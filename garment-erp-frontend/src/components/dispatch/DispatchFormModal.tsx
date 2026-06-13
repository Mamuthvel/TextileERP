import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { useCreateDispatchMutation } from '../../api/dispatchApi';
import { useGetOrdersQuery } from '../../api/ordersApi';

export default function DispatchFormModal({
  onClose,
  defaultOrderId,
}: {
  onClose: () => void;
  defaultOrderId?: string;
}) {
  const { data: orders } = useGetOrdersQuery({ limit: 100 }, { skip: !!defaultOrderId });
  const [create, { isLoading, error }] = useCreateDispatchMutation();
  const [orderId, setOrderId] = useState(defaultOrderId || '');
  const [lorryNo, setLorryNo] = useState('');
  const [blNo, setBlNo] = useState('');
  const [cartons, setCartons] = useState([{ cartonNo: '', qty: 0, grossWeight: 0, netWeight: 0 }]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({
        orderId: orderId || undefined,
        lorryNo,
        blNo,
        dispatchDate: new Date().toISOString(),
        cartons: cartons.filter((c) => c.cartonNo),
      } as any).unwrap();
      onClose();
      toast.success('Dispatch created');
    } catch { toast.error('Failed to create dispatch.'); }
  };

  return (
    <Modal title="New Dispatch" onClose={onClose} wide>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {!defaultOrderId && (
            <div>
              <label className="field-label">Linked Order</label>
              <select className="input-field" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                <option value="">— None —</option>
                {orders?.data.map((o) => (
                  <option key={o._id} value={o._id}>{o.orderNo} — {o.buyer}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="field-label">Lorry No.</label>
            <input className="input-field" value={lorryNo} onChange={(e) => setLorryNo(e.target.value)} />
          </div>
          <div>
            <label className="field-label">BL No.</label>
            <input className="input-field" value={blNo} onChange={(e) => setBlNo(e.target.value)} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="field-label mb-0">Carton Details</label>
            <button
              type="button"
              className="text-xs font-mono text-amber-400 hover:underline"
              onClick={() => setCartons((p) => [...p, { cartonNo: '', qty: 0, grossWeight: 0, netWeight: 0 }])}
            >
              + add carton
            </button>
          </div>
          <div className="space-y-2">
            {cartons.map((c, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2">
                <input className="input-field" placeholder="Carton No." value={c.cartonNo}
                  onChange={(e) => setCartons((p) => p.map((x, i) => (i === idx ? { ...x, cartonNo: e.target.value } : x)))} />
                <input type="number" className="input-field" placeholder="Qty" value={c.qty || ''}
                  onChange={(e) => setCartons((p) => p.map((x, i) => (i === idx ? { ...x, qty: Number(e.target.value) } : x)))} />
                <input type="number" className="input-field" placeholder="Gross Wt (kg)" value={c.grossWeight || ''}
                  onChange={(e) => setCartons((p) => p.map((x, i) => (i === idx ? { ...x, grossWeight: Number(e.target.value) } : x)))} />
                <input type="number" className="input-field" placeholder="Net Wt (kg)" value={c.netWeight || ''}
                  onChange={(e) => setCartons((p) => p.map((x, i) => (i === idx ? { ...x, netWeight: Number(e.target.value) } : x)))} />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-rose-400">Failed to create dispatch.</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Create Dispatch'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
