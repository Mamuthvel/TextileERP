import { useState } from 'react';
import Modal from '../Modal';
import { useGetInventoryQuery } from '../../api/inventoryApi';
import { useCreateTransactionMutation } from '../../api/inventoryApi';

export default function StockTransactionModal({ onClose }: { onClose: () => void }) {
  const { data } = useGetInventoryQuery({ limit: 200 });
  const [createTxn, { isLoading, error }] = useCreateTransactionMutation();
  const [form, setForm] = useState({
    transactionType: 'GRN',
    inventoryId: '',
    quantity: 0,
    reference: '',
    billNo: '',
    billAmount: 0,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTxn(form as any).unwrap();
      onClose();
    } catch {
      //
    }
  };

  return (
    <Modal title="Record Stock Transaction" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="field-label">Transaction Type</label>
          <select
            className="input-field"
            value={form.transactionType}
            onChange={(e) => setForm({ ...form, transactionType: e.target.value })}
          >
            <option value="GRN">GRN (Goods Receipt)</option>
            <option value="issue">Issue</option>
            <option value="return">Return</option>
            <option value="transfer">Transfer</option>
            <option value="adjustment">Adjustment (set absolute qty)</option>
          </select>
        </div>
        <div>
          <label className="field-label">Item *</label>
          <select className="input-field" required value={form.inventoryId} onChange={(e) => setForm({ ...form, inventoryId: e.target.value })}>
            <option value="">Select item…</option>
            {data?.data.map((i) => (
              <option key={i._id} value={i._id}>
                {i.itemCode} — {i.description} ({i.currentStock} {i.uom})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Quantity *</label>
          <input
            type="number"
            className="input-field"
            required
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="field-label">Reference</label>
          <input className="input-field" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Bill No.</label>
            <input className="input-field" value={form.billNo} onChange={(e) => setForm({ ...form, billNo: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Bill Amount</label>
            <input
              type="number"
              className="input-field"
              value={form.billAmount}
              onChange={(e) => setForm({ ...form, billAmount: Number(e.target.value) })}
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose-400">Transaction failed (check stock availability).</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
