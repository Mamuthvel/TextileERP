import { useState } from 'react';
import { useGetInventoryQuery } from '../api/inventoryApi';
import PageHeader from '../components/PageHeader';
import StockLevelIndicator from '../components/StockLevelIndicator';
import Pagination from '../components/Pagination';
import InventoryItemModal from '../components/inventory/InventoryItemModal';
import StockTransactionModal from '../components/inventory/StockTransactionModal';

const CATEGORY_LABELS: Record<string, string> = {
  yarn: 'Yarn',
  greyFabric: 'Grey Fabric',
  finishedFabric: 'Finished Fabric',
  trim: 'Trims',
  packingMaterial: 'Packing Material',
};

const LIMIT = 5;

export default function InventoryPage() {
  const [category, setCategory] = useState('');
  const [lowStock, setLowStock] = useState(false);
  const [page, setPage] = useState(1);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showTxnModal, setShowTxnModal] = useState(false);

  const { data, isLoading } = useGetInventoryQuery({
    category,
    lowStock: lowStock ? 'true' : undefined,
    page,
    limit: LIMIT,
  });

  const handleCategory = (val: string) => { setCategory(val); setPage(1); };
  const handleLowStock = (val: boolean) => { setLowStock(val); setPage(1); };

  return (
    <div>
      <PageHeader
        title="Inventory & Stores"
        subtitle="Yarn · Fabric · Trims · Packing"
        actions={
          <>
            <button className="btn-secondary" onClick={() => setShowTxnModal(true)}>
              Record Transaction
            </button>
            <button className="btn-primary" onClick={() => setShowItemModal(true)}>
              + New Item
            </button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <select className="input-field max-w-[200px]" value={category} onChange={(e) => handleCategory(e.target.value)}>
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={lowStock} onChange={(e) => handleLowStock(e.target.checked)} />
          Low stock only
        </label>
      </div>

      <div className="panel overflow-x-auto">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Description</th>
                <th>Category</th>
                <th>UOM</th>
                <th>Current Stock</th>
                <th>Reserved</th>
                <th>Available</th>
                <th>Location</th>
                <th>Min Level</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Loading inventory…
                  </td>
                </tr>
              )}
              {!isLoading && (data?.data.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No items found.
                  </td>
                </tr>
              )}
              {data?.data.map((item) => (
                <tr key={item._id}>
                  <td className="font-mono font-semibold text-amber-500 dark:text-amber-400">{item.itemCode}</td>
                  <td>{item.description}</td>
                  <td>{CATEGORY_LABELS[item.category] || item.category}</td>
                  <td className="font-mono text-slate-500">{item.uom}</td>
                  <td>
                    <StockLevelIndicator current={item.currentStock} min={item.minStockLevel} />
                  </td>
                  <td className="font-mono text-slate-500">{item.reservedStock}</td>
                  <td className="font-mono">{item.availableStock}</td>
                  <td className="text-slate-500">{item.location || '—'}</td>
                  <td className="font-mono text-slate-500">{item.minStockLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data?.pagination && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            total={data.pagination.total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        )}
      </div>

      {showItemModal && <InventoryItemModal onClose={() => setShowItemModal(false)} />}
      {showTxnModal && <StockTransactionModal onClose={() => setShowTxnModal(false)} />}
    </div>
  );
}
