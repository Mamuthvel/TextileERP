import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../api/ordersApi';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import OrderFormModal from '../components/orders/OrderFormModal';
import { Skeleton } from '../components/Skeleton';

const LIMIT = 15;

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useGetOrdersQuery({ search, status, page, limit: LIMIT });

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleStatus = (val: string) => { setStatus(val); setPage(1); };

  return (
    <div>
      <PageHeader
        title="Order Book"
        subtitle="Sales & Order Management"
        actions={
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + New Order
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          className="input-field max-w-xs"
          placeholder="Search by order no. or buyer…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select className="input-field max-w-[180px]" value={status} onChange={(e) => handleStatus(e.target.value)}>
          <option value="">All statuses</option>
          {['enquiry', 'quotation', 'confirmed', 'inProduction', 'dispatched', 'invoiced', 'closed'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="panel overflow-x-auto">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Buyer</th>
                <th>Type</th>
                <th>Season</th>
                <th>Qty</th>
                <th>Delivery</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, c) => (
                    <td key={c}><Skeleton className="h-5 w-full" /></td>
                  ))}
                </tr>
              ))}
              {!isLoading && (data?.data.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              )}
              {data?.data.map((o) => (
                <tr key={o._id}>
                  <td>
                    <Link to={`/orders/${o._id}`} className="font-mono font-semibold text-amber-500 dark:text-amber-400 hover:underline">
                      {o.orderNo}
                    </Link>
                  </td>
                  <td>{o.buyer}</td>
                  <td className="capitalize">{o.type}</td>
                  <td>{o.season || '—'}</td>
                  <td className="font-mono">{o.totalQuantity?.toLocaleString() ?? '—'}</td>
                  <td>{o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString() : '—'}</td>
                  <td>
                    <StatusBadge status={o.status} />
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

      {showForm && <OrderFormModal onClose={() => setShowForm(false)} />}
    </div>
  );
}
