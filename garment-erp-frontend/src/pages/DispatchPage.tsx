import { useState } from 'react';
import { useGetDispatchesQuery, useUpdateDispatchMutation } from '../api/dispatchApi';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import DispatchFormModal from '../components/dispatch/DispatchFormModal';

const STATUS_FLOW = ['pending', 'packed', 'shipped', 'delivered'];
const LIMIT = 15;

export default function DispatchPage() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading } = useGetDispatchesQuery({ page, limit: LIMIT });
  const [updateDispatch] = useUpdateDispatchMutation();

  return (
    <div>
      <PageHeader
        title="Dispatch & Logistics"
        subtitle="Carton Packing · Shipment Tracking"
        actions={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + New Dispatch
          </button>
        }
      />

      <div className="panel overflow-x-auto">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dispatch No.</th>
                <th>Lorry No.</th>
                <th>BL No.</th>
                <th>Cartons</th>
                <th>Total Qty</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading dispatches…
                  </td>
                </tr>
              )}
              {!isLoading && (data?.data.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No dispatches recorded yet.
                  </td>
                </tr>
              )}
              {data?.data.map((d) => {
                const idx = STATUS_FLOW.indexOf(d.shippingStatus);
                const next = idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
                return (
                  <tr key={d._id}>
                    <td className="font-mono font-semibold text-amber-500 dark:text-amber-400">{d.dispatchNo}</td>
                    <td>{d.lorryNo || '—'}</td>
                    <td>{d.blNo || '—'}</td>
                    <td className="font-mono">{d.totalCartons}</td>
                    <td className="font-mono">{d.totalQuantity.toLocaleString()}</td>
                    <td>
                      <StatusBadge status={d.shippingStatus} />
                    </td>
                    <td>
                      {next && (
                        <button
                          className="btn-secondary !py-1 !px-2 !text-xs"
                          onClick={() => updateDispatch({ id: d._id, body: { shippingStatus: next as any } })}
                        >
                          Mark {next}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
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

      {showModal && <DispatchFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
