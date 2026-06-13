import { useState } from 'react';
import Modal from '../Modal';
import { useCreateInventoryItemMutation } from '../../api/inventoryApi';

export default function InventoryItemModal({ onClose }: { onClose: () => void }) {
  const [createItem, { isLoading, error }] = useCreateInventoryItemMutation();
  const [form, setForm] = useState({
    itemCode: '',
    category: 'yarn',
    description: '',
    uom: 'kg',
    currentStock: 0,
    reservedStock: 0,
    location: '',
    minStockLevel: 0,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createItem(form as any).unwrap();
      onClose();
    } catch {
      //
    }
  };

  return (
    <Modal title="New Inventory Item" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="field-label">Item Code *</label>
          <input className="input-field" required value={form.itemCode} onChange={(e) => setForm({ ...form, itemCode: e.target.value })} />
        </div>
        <div>
          <label className="field-label">Category</label>
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="yarn">Yarn</option>
            <option value="greyFabric">Grey Fabric</option>
            <option value="finishedFabric">Finished Fabric</option>
            <option value="trim">Trims</option>
            <option value="packingMaterial">Packing Material</option>
          </select>
        </div>
        <div>
          <label className="field-label">Description</label>
          <input className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">UOM</label>
            <input className="input-field" value={form.uom} onChange={(e) => setForm({ ...form, uom: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Location</label>
            <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Opening Stock</label>
            <input
              type="number"
              className="input-field"
              value={form.currentStock}
              onChange={(e) => setForm({ ...form, currentStock: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="field-label">Min Stock Level</label>
            <input
              type="number"
              className="input-field"
              value={form.minStockLevel}
              onChange={(e) => setForm({ ...form, minStockLevel: Number(e.target.value) })}
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose-400">Failed to create item.</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Create Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
