import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { useCreateInvoiceMutation } from '../../api/dispatchApi';
import { useGetOrdersQuery } from '../../api/ordersApi';

export default function InvoiceFormModal({
  onClose,
  defaultOrderId,
  defaultBuyer,
}: {
  onClose: () => void;
  defaultOrderId?: string;
  defaultBuyer?: string;
}) {
  const { data: orders } = useGetOrdersQuery({ limit: 100 }, { skip: !!defaultOrderId });
  const [create, { isLoading, error }] = useCreateInvoiceMutation();
  const [orderId, setOrderId] = useState(defaultOrderId || '');
  const [buyer, setBuyer] = useState(defaultBuyer || '');
  const [currency, setCurrency] = useState('USD');
  const [dutyDrawback, setDutyDrawback] = useState(0);
  const [creditAdvice, setCreditAdvice] = useState(0);
  const [items, setItems] = useState([{ description: '', quantity: 0, unitPrice: 0 }]);

  const total = items.reduce((s, i) => s + (i.quantity || 0) * (i.unitPrice || 0), 0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({
        orderId: orderId || undefined,
        buyer,
        currency,
        dutyDrawback,
        creditAdvice,
        items: items.filter((i) => i.description && i.quantity),
      } as any).unwrap();
      onClose();
      toast.success('Invoice created');
    } catch { toast.error('Failed to create invoice.'); }
  };

  return (
    <Modal title="New Invoice" onClose={onClose} wide>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {!defaultOrderId && (
            <div>
              <label className="field-label">Linked Order</label>
              <select
                className="input-field"
                value={orderId}
                onChange={(e) => {
                  const oid = e.target.value;
                  setOrderId(oid);
                  const o = orders?.data.find((x) => x._id === oid);
                  if (o) setBuyer(o.buyer);
                }}
              >
                <option value="">— None —</option>
                {orders?.data.map((o) => (
                  <option key={o._id} value={o._id}>{o.orderNo} — {o.buyer}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="field-label">Buyer</label>
            <input className="input-field" value={buyer} onChange={(e) => setBuyer(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Currency</label>
            <input className="input-field" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="field-label mb-0">Line Items</label>
            <button type="button" className="text-xs font-mono text-amber-400 hover:underline"
              onClick={() => setItems((p) => [...p, { description: '', quantity: 0, unitPrice: 0 }])}>
              + add item
            </button>
          </div>
          <div className="space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input className="input-field col-span-6" placeholder="Description" value={it.description}
                  onChange={(e) => setItems((p) => p.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)))} />
                <input type="number" className="input-field col-span-3" placeholder="Qty" value={it.quantity || ''}
                  onChange={(e) => setItems((p) => p.map((x, i) => (i === idx ? { ...x, quantity: Number(e.target.value) } : x)))} />
                <input type="number" className="input-field col-span-3" placeholder="Unit Price" value={it.unitPrice || ''}
                  onChange={(e) => setItems((p) => p.map((x, i) => (i === idx ? { ...x, unitPrice: Number(e.target.value) } : x)))} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-ink-700 pt-4">
          <div>
            <label className="field-label">Duty Drawback</label>
            <input type="number" className="input-field" value={dutyDrawback} onChange={(e) => setDutyDrawback(Number(e.target.value))} />
          </div>
          <div>
            <label className="field-label">Credit Advice</label>
            <input type="number" className="input-field" value={creditAdvice} onChange={(e) => setCreditAdvice(Number(e.target.value))} />
          </div>
        </div>

        <p className="font-mono text-sm text-slate-600 dark:text-slate-300">
          Invoice Total: <span className="text-amber-500 dark:text-amber-400">{currency} {total.toLocaleString()}</span>
        </p>

        {error && <p className="text-sm text-rose-400">Failed to create invoice.</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
