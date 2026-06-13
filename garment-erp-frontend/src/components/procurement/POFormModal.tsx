import { useState } from 'react';
import Modal from '../Modal';
import { useCreatePurchaseOrderMutation } from '../../api/poApi';
import { useGetOrdersQuery } from '../../api/ordersApi';

export default function POFormModal({ onClose }: { onClose: () => void }) {
  const { data: orders } = useGetOrdersQuery({ limit: 100 });
  const [create, { isLoading, error }] = useCreatePurchaseOrderMutation();
  const [vendor, setVendor] = useState('');
  const [orderId, setOrderId] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 0, uom: 'pcs', unitPrice: 0 }]);

  const total = items.reduce((s, i) => s + (i.quantity || 0) * (i.unitPrice || 0), 0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({
        vendor,
        orderId: orderId || undefined,
        currency,
        expectedDelivery: expectedDelivery || undefined,
        items: items.filter((i) => i.description && i.quantity),
      } as any).unwrap();
      onClose();
    } catch {
      //
    }
  };

  return (
    <Modal title="New Purchase Order" onClose={onClose} wide>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Vendor *</label>
            <input className="input-field" required value={vendor} onChange={(e) => setVendor(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Linked Order</label>
            <select className="input-field" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
              <option value="">— None —</option>
              {orders?.data.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.orderNo} — {o.buyer}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Currency</label>
            <input className="input-field" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Expected Delivery</label>
            <input type="date" className="input-field" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="field-label mb-0">Line Items</label>
            <button type="button" className="text-xs font-mono text-amber-400 hover:underline" onClick={() => setItems((p) => [...p, { description: '', quantity: 0, uom: 'pcs', unitPrice: 0 }])}>
              + add item
            </button>
          </div>
          <div className="space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input
                  className="input-field col-span-5"
                  placeholder="Description"
                  value={it.description}
                  onChange={(e) => setItems((p) => p.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)))}
                />
                <input
                  type="number"
                  className="input-field col-span-2"
                  placeholder="Qty"
                  value={it.quantity || ''}
                  onChange={(e) => setItems((p) => p.map((x, i) => (i === idx ? { ...x, quantity: Number(e.target.value) } : x)))}
                />
                <input
                  className="input-field col-span-2"
                  placeholder="UOM"
                  value={it.uom}
                  onChange={(e) => setItems((p) => p.map((x, i) => (i === idx ? { ...x, uom: e.target.value } : x)))}
                />
                <input
                  type="number"
                  className="input-field col-span-3"
                  placeholder="Unit Price"
                  value={it.unitPrice || ''}
                  onChange={(e) => setItems((p) => p.map((x, i) => (i === idx ? { ...x, unitPrice: Number(e.target.value) } : x)))}
                />
              </div>
            ))}
          </div>
        </div>

        <p className="font-mono text-sm text-slate-600 dark:text-slate-300">
          Total: <span className="text-amber-500 dark:text-amber-400">{currency} {total.toLocaleString()}</span>
        </p>

        {error && <p className="text-sm text-rose-400">Failed to create purchase order.</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Create PO'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
