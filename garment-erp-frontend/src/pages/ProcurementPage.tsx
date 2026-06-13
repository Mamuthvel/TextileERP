import { useState } from 'react';
import { useGetPurchaseOrdersQuery } from '../api/poApi';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import POFormModal from '../components/procurement/POFormModal';

const LIMIT = 15;

export default function ProcurementPage() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading } = useGetPurchaseOrdersQuery({ page, limit: LIMIT });

  return (
    <div>
      <PageHeader
        title="Procurement"
        subtitle="Purchase Orders & Vendors"
        actions={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Purchase Order
          </button>
        }
      />

      <div className="panel overflow-x-auto">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PO No.</th>
                <th>Vendor</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Expected Delivery</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading purchase orders…
                  </td>
                </tr>
              )}
              {!isLoading && (data?.data.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No purchase orders found.
                  </td>
                </tr>
              )}
              {data?.data.map((po) => (
                <tr key={po._id}>
                  <td className="font-mono font-semibold text-amber-500 dark:text-amber-400">{po.poNo}</td>
                  <td>{po.vendor}</td>
                  <td className="text-xs text-slate-400">{po.items.length} item(s)</td>
                  <td className="font-mono">
                    {po.currency} {po.totalAmount.toLocaleString()}
                  </td>
                  <td>{po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString() : '—'}</td>
                  <td>
                    <StatusBadge status={po.status} />
                  </td>
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

      {showModal && <POFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
