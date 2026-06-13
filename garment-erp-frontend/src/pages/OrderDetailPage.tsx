import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderQuery, useApproveOrderMutation } from '../api/ordersApi';
import { useGetStylesQuery } from '../api/stylesApi';
import { useGetCostingsQuery } from '../api/costingApi';
import { useGetProductionOrdersQuery } from '../api/productionApi';
import { useGetInspectionsQuery } from '../api/qualityApi';
import { useGetDispatchesQuery, useGetInvoicesQuery } from '../api/dispatchApi';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { SkeletonTable, PageSkeleton } from '../components/Skeleton';
import CostingFormModal from '../components/costing/CostingFormModal';
import ProductionOrderModal from '../components/production/ProductionOrderModal';
import InspectionModal from '../components/quality/InspectionModal';
import DispatchFormModal from '../components/dispatch/DispatchFormModal';
import InvoiceFormModal from '../components/invoicing/InvoiceFormModal';
import type { Order, Costing, ProductionOrder, QualityInspection, Dispatch, Invoice } from '../types';
import type { Style } from '../api/stylesApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STEPS = [
  { key: 'enquiry', label: 'Enquiry' },
  { key: 'quotation', label: 'Quotation' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'inProduction', label: 'Production' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'invoiced', label: 'Invoiced' },
  { key: 'closed', label: 'Closed' },
];

const STATUS_TO_TAB: Record<string, number> = {
  enquiry: 0,
  quotation: 0,
  confirmed: 1,
  inProduction: 3,
  dispatched: 5,
  invoiced: 6,
  closed: 6,
};

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'style', label: 'Style & BOM' },
  { id: 'costing', label: 'Costing' },
  { id: 'production', label: 'Production' },
  { id: 'quality', label: 'Quality' },
  { id: 'dispatch', label: 'Dispatch' },
  { id: 'invoice', label: 'Invoice' },
];

type ModalKey = 'costing-estimate' | 'costing-post' | 'production' | 'quality' | 'dispatch' | 'invoice';

// ─── Status Stepper ───────────────────────────────────────────────────────────

function StatusStepper({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status);
  return (
    <div className="panel px-4 py-4">
      <div className="flex items-start w-full overflow-x-auto">
        {STATUS_STEPS.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step.key} className="flex flex-1 items-center min-w-0">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={[
                    'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                    isDone
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : isCurrent
                      ? 'bg-amber-500 border-amber-500 text-ink-950'
                      : 'bg-transparent border-ink-600 text-slate-500',
                  ].join(' ')}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <span
                  className={[
                    'mt-1.5 text-[10px] font-medium text-center leading-tight whitespace-nowrap',
                    isCurrent ? 'text-amber-500' : isDone ? 'text-teal-400' : 'text-slate-500',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div
                  className={[
                    'flex-1 h-0.5 mx-1 mb-5 rounded',
                    idx < currentIdx ? 'bg-teal-500' : 'bg-ink-700',
                  ].join(' ')}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <p className="text-slate-500 text-sm">{message}</p>
      {action}
    </div>
  );
}

// ─── Tab Panels ───────────────────────────────────────────────────────────────

function DetailsTab({ order }: { order: Order }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="panel p-5 lg:col-span-2 space-y-5">
        <div>
          <p className="label-tag mb-3">Order Information</p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <Field label="Buyer" value={order.buyer} />
            <Field label="Type" value={order.type} className="capitalize" />
            <Field label="Agent" value={order.agent || '—'} />
            <Field label="Style Category" value={order.styleCategory || '—'} />
            <Field label="Season" value={order.season || '—'} />
            <Field label="Destination" value={order.destination || '—'} />
            <Field label="Delivery Date" value={order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '—'} />
            <Field label="Agent Commission" value={`${order.agentCommission ?? 0}%`} />
            <Field label="Total Quantity" value={(order.totalQuantity ?? 0).toLocaleString()} />
          </dl>
        </div>

        {order.remarks && (
          <div className="border-t border-ink-700 pt-4">
            <p className="label-tag mb-1">Remarks</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{order.remarks}</p>
          </div>
        )}

        <div className="border-t border-ink-700 pt-4">
          <p className="label-tag mb-3">Garment Assortment</p>
          <div className="table-wrap overflow-x-auto rounded-lg border border-ink-800">
            <table>
              <thead>
                <tr><th>Size</th><th>Color</th><th>Quantity</th></tr>
              </thead>
              <tbody>
                {order.garmentAssortments.map((a, i) => (
                  <tr key={i}>
                    <td>{a.size}</td>
                    <td>{a.color}</td>
                    <td className="font-mono">{a.quantity.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <p className="label-tag mb-4">Order Timeline</p>
        <ol className="relative space-y-5 border-l border-ink-700 pl-5">
          {[...order.orderTimeline].reverse().map((t, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-4 ring-ink-900" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.event}</p>
              {t.note && <p className="text-xs text-slate-400">{t.note}</p>}
              <p className="font-mono text-[11px] text-slate-500">{new Date(t.at).toLocaleString()}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function StyleTab({ orderId }: { orderId: string }) {
  const { data, isLoading } = useGetStylesQuery({ orderId });
  const styles = (data?.data ?? []) as Style[];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="label-tag">Styles for this Order</p>
        <Link to={`/design?orderId=${orderId}`} className="btn-primary text-sm">+ Add Style</Link>
      </div>

      {isLoading ? (
        <SkeletonTable rows={3} cols={5} />
      ) : styles.length === 0 ? (
        <EmptyState
          message="No styles added yet. Define the garment style and bill of materials."
          action={
            <Link to={`/design?orderId=${orderId}`} className="btn-primary">
              Go to Design & Sampling →
            </Link>
          }
        />
      ) : (
        <div className="table-wrap overflow-x-auto rounded-lg border border-ink-800">
          <table>
            <thead>
              <tr><th>Style No.</th><th>Description</th><th>Fabric</th><th>GSM</th><th>Status</th></tr>
            </thead>
            <tbody>
              {styles.map((s) => (
                <tr key={s._id}>
                  <td className="font-mono">{s.styleNo}</td>
                  <td>{s.description || '—'}</td>
                  <td>{s.fabric || '—'}</td>
                  <td>{s.fabricGSM ?? '—'}</td>
                  <td><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CostingTab({
  orderId,
  onOpen,
}: {
  orderId: string;
  onOpen: (type: 'costing-estimate' | 'costing-post') => void;
}) {
  const { data, isLoading } = useGetCostingsQuery({ orderId });
  const costings = (data?.data ?? []) as Costing[];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="label-tag">Cost Sheets</p>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm" onClick={() => onOpen('costing-estimate')}>+ Estimate</button>
          <button className="btn-secondary text-sm" onClick={() => onOpen('costing-post')}>+ Post-Production</button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable rows={3} cols={5} />
      ) : costings.length === 0 ? (
        <EmptyState
          message="No cost sheets yet. Add an estimate to calculate the order cost."
          action={<button className="btn-primary" onClick={() => onOpen('costing-estimate')}>Add Estimate</button>}
        />
      ) : (
        <div className="table-wrap overflow-x-auto rounded-lg border border-ink-800">
          <table>
            <thead>
              <tr><th>Type</th><th>Total Cost</th><th>Selling Price</th><th>Margin</th><th>Currency</th></tr>
            </thead>
            <tbody>
              {costings.map((c) => (
                <tr key={c._id}>
                  <td className="capitalize">{c.type}</td>
                  <td className="font-mono">{c.totalCost.toLocaleString()}</td>
                  <td className="font-mono">{c.sellingPrice.toLocaleString()}</td>
                  <td className={c.profitMargin && c.profitMargin > 0 ? 'text-teal-400' : 'text-rose-400'}>
                    {c.profitMargin != null ? `${c.profitMargin.toFixed(1)}%` : '—'}
                  </td>
                  <td>{c.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductionTab({ orderId, onOpen }: { orderId: string; onOpen: () => void }) {
  const { data, isLoading } = useGetProductionOrdersQuery({ orderId });
  const prodOrders = (data?.data ?? []) as ProductionOrder[];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="label-tag">Production Orders</p>
        {prodOrders.length === 0 && (
          <button className="btn-primary text-sm" onClick={onOpen}>+ Start Production</button>
        )}
      </div>

      {isLoading ? (
        <SkeletonTable rows={3} cols={6} />
      ) : prodOrders.length === 0 ? (
        <EmptyState
          message="No production orders yet. Start by creating the first stage (Knitting)."
          action={<button className="btn-primary" onClick={onOpen}>Start Production</button>}
        />
      ) : (
        <div className="table-wrap overflow-x-auto rounded-lg border border-ink-800">
          <table>
            <thead>
              <tr><th>Order No.</th><th>Stage</th><th>Status</th><th>Planned Qty</th><th>Actual Qty</th><th>Progress</th></tr>
            </thead>
            <tbody>
              {prodOrders.map((p) => (
                <tr key={p._id}>
                  <td className="font-mono text-xs">{p.prodOrderNo}</td>
                  <td className="capitalize text-sm">{p.stage.replace(/([A-Z])/g, ' $1').trim()}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td className="font-mono">{p.plannedQuantity.toLocaleString()}</td>
                  <td className="font-mono">{p.actualQuantity.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-ink-700">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-all"
                          style={{ width: `${Math.min(p.progress ?? 0, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-500">{Math.round(p.progress ?? 0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function QualityTab({ orderId, onOpen }: { orderId: string; onOpen: () => void }) {
  const { data, isLoading } = useGetInspectionsQuery({ orderId });
  const inspections = (data?.data ?? []) as QualityInspection[];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="label-tag">Quality Inspections</p>
        <button className="btn-primary text-sm" onClick={onOpen}>+ Add Inspection</button>
      </div>

      {isLoading ? (
        <SkeletonTable rows={3} cols={5} />
      ) : inspections.length === 0 ? (
        <EmptyState
          message="No inspections recorded yet."
          action={<button className="btn-primary" onClick={onOpen}>Record First Inspection</button>}
        />
      ) : (
        <div className="table-wrap overflow-x-auto rounded-lg border border-ink-800">
          <table>
            <thead>
              <tr><th>Type</th><th>Date</th><th>Sample Size</th><th>Total Defects</th><th>Result</th></tr>
            </thead>
            <tbody>
              {inspections.map((q) => (
                <tr key={q._id}>
                  <td className="capitalize text-sm">{q.inspectionType.replace(/([A-Z])/g, ' $1').trim()}</td>
                  <td className="font-mono text-xs">{new Date(q.inspectionDate).toLocaleDateString()}</td>
                  <td className="font-mono">{q.sampleSize}</td>
                  <td className="font-mono">{q.totalDefects ?? 0}</td>
                  <td><StatusBadge status={q.result} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DispatchTab({ orderId, onOpen }: { orderId: string; onOpen: () => void }) {
  const { data, isLoading } = useGetDispatchesQuery({ orderId });
  const dispatches = (data?.data ?? []) as Dispatch[];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="label-tag">Dispatch Records</p>
        <button className="btn-primary text-sm" onClick={onOpen}>+ Create Dispatch</button>
      </div>

      {isLoading ? (
        <SkeletonTable rows={3} cols={6} />
      ) : dispatches.length === 0 ? (
        <EmptyState
          message="No dispatch records yet."
          action={<button className="btn-primary" onClick={onOpen}>Create First Dispatch</button>}
        />
      ) : (
        <div className="table-wrap overflow-x-auto rounded-lg border border-ink-800">
          <table>
            <thead>
              <tr><th>Dispatch No.</th><th>Lorry No.</th><th>BL No.</th><th>Cartons</th><th>Total Qty</th><th>Status</th></tr>
            </thead>
            <tbody>
              {dispatches.map((d) => (
                <tr key={d._id}>
                  <td className="font-mono text-xs">{d.dispatchNo}</td>
                  <td>{d.lorryNo || '—'}</td>
                  <td>{d.blNo || '—'}</td>
                  <td className="font-mono">{d.totalCartons}</td>
                  <td className="font-mono">{d.totalQuantity.toLocaleString()}</td>
                  <td><StatusBadge status={d.shippingStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InvoiceTab({ orderId, onOpen }: { orderId: string; onOpen: () => void }) {
  const { data, isLoading } = useGetInvoicesQuery({ orderId });
  const invoices = (data?.data ?? []) as Invoice[];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="label-tag">Invoices</p>
        <button className="btn-primary text-sm" onClick={onOpen}>+ Create Invoice</button>
      </div>

      {isLoading ? (
        <SkeletonTable rows={3} cols={6} />
      ) : invoices.length === 0 ? (
        <EmptyState
          message="No invoices created yet."
          action={<button className="btn-primary" onClick={onOpen}>Create Invoice</button>}
        />
      ) : (
        <div className="table-wrap overflow-x-auto rounded-lg border border-ink-800">
          <table>
            <thead>
              <tr><th>Invoice No.</th><th>Buyer</th><th>Total</th><th>Currency</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td className="font-mono text-xs">{inv.invoiceNo}</td>
                  <td>{inv.buyer || '—'}</td>
                  <td className="font-mono">{inv.totalAmount.toLocaleString()}</td>
                  <td>{inv.currency}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td className="font-mono text-xs">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const FLOW = ['enquiry', 'quotation', 'confirmed', 'inProduction', 'dispatched', 'invoiced', 'closed'];

export default function OrderDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useGetOrderQuery(id);
  const [approve, { isLoading: approving }] = useApproveOrderMutation();
  const order = data?.data;

  const [activeTab, setActiveTab] = useState(0);
  const prevStatusRef = useRef<string | null>(null);
  const [modal, setModal] = useState<ModalKey | null>(null);

  // Auto-advance active tab when order status changes
  useEffect(() => {
    if (!order) return;
    if (prevStatusRef.current !== order.status) {
      setActiveTab(STATUS_TO_TAB[order.status] ?? 0);
      prevStatusRef.current = order.status;
    }
  }, [order?.status]);

  if (isLoading) return <PageSkeleton cols={6} />;
  if (!order) return <div className="text-slate-500 p-6">Order not found.</div>;

  const currentIdx = FLOW.indexOf(order.status);
  const nextStage = currentIdx >= 0 && currentIdx < FLOW.length - 1 ? FLOW[currentIdx + 1] : null;

  const handleAdvance = async () => {
    if (!nextStage) return;
    try {
      await approve({ id: order._id }).unwrap();
      toast.success(`Order advanced to ${nextStage.replace(/([A-Z])/g, ' $1').trim()}`);
    } catch {
      toast.error('Failed to advance order status.');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={order.orderNo}
        subtitle={`${order.buyer} · ${order.type}`}
        actions={
          <>
            <Link to="/orders" className="btn-secondary">← Back</Link>
            {nextStage && (
              <button className="btn-primary" disabled={approving} onClick={handleAdvance}>
                {approving ? 'Advancing…' : `Advance → ${nextStage.replace(/([A-Z])/g, ' $1').trim()}`}
              </button>
            )}
          </>
        }
      />

      <StatusStepper status={order.status} />

      {/* Current status badge */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs text-slate-500">Current status:</span>
        <StatusBadge status={order.status} />
        {nextStage && (
          <span className="text-xs text-slate-500">
            → next: <span className="text-amber-400">{nextStage.replace(/([A-Z])/g, ' $1').trim()}</span>
          </span>
        )}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-0 border-b border-ink-700 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(i)}
            className={[
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeTab === i
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-ink-600',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 0 && <DetailsTab order={order} />}
        {activeTab === 1 && <StyleTab orderId={id} />}
        {activeTab === 2 && <CostingTab orderId={id} onOpen={(type) => setModal(type)} />}
        {activeTab === 3 && <ProductionTab orderId={id} onOpen={() => setModal('production')} />}
        {activeTab === 4 && <QualityTab orderId={id} onOpen={() => setModal('quality')} />}
        {activeTab === 5 && <DispatchTab orderId={id} onOpen={() => setModal('dispatch')} />}
        {activeTab === 6 && <InvoiceTab orderId={id} onOpen={() => setModal('invoice')} />}
      </div>

      {/* Modals */}
      {modal === 'costing-estimate' && (
        <CostingFormModal orderId={id} type="estimate" onClose={() => setModal(null)} />
      )}
      {modal === 'costing-post' && (
        <CostingFormModal orderId={id} type="post" onClose={() => setModal(null)} />
      )}
      {modal === 'production' && (
        <ProductionOrderModal defaultOrderId={id} onClose={() => setModal(null)} />
      )}
      {modal === 'quality' && (
        <InspectionModal defaultOrderId={id} onClose={() => setModal(null)} />
      )}
      {modal === 'dispatch' && (
        <DispatchFormModal defaultOrderId={id} onClose={() => setModal(null)} />
      )}
      {modal === 'invoice' && (
        <InvoiceFormModal defaultOrderId={id} defaultBuyer={order.buyer} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function Field({ label, value, className = '' }: { label: string; value: string | number; className?: string }) {
  return (
    <div>
      <dt className="label-tag mb-1">{label}</dt>
      <dd className={`text-slate-800 dark:text-slate-200 ${className}`}>{value}</dd>
    </div>
  );
}
