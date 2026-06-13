import { useState } from 'react';
import { useGetProductionOrdersQuery } from '../api/productionApi';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import ProductionProgressBar from '../components/ProductionProgressBar';
import ProductionOrderModal from '../components/production/ProductionOrderModal';
import DailyProductionModal from '../components/production/DailyProductionModal';
import AdvanceStageModal from '../components/production/AdvanceStageModal';
import { Skeleton } from '../components/Skeleton';
import type { ProductionOrder } from '../types';

const STAGES: { key: string; label: string }[] = [
  { key: 'knitting', label: 'Knitting' },
  { key: 'yarnDyeing', label: 'Yarn Dyeing' },
  { key: 'greyFabricReceipt', label: 'Grey Fabric' },
  { key: 'fabricDyeing', label: 'Fabric Dyeing' },
  { key: 'finishing', label: 'Finishing' },
  { key: 'fabricCutting', label: 'Cutting' },
  { key: 'sewing', label: 'Sewing' },
  { key: 'ironing', label: 'Ironing' },
  { key: 'packing', label: 'Packing' },
  { key: 'finalInspection', label: 'Final QC' },
];

// Mini 10-dot pipeline indicator for each card
function StagePipeline({ stage }: { stage: string }) {
  const currentIdx = STAGES.findIndex((s) => s.key === stage);
  return (
    <div className="flex items-center gap-0.5 mt-2" title={`Stage ${currentIdx + 1} of ${STAGES.length}`}>
      {STAGES.map((s, i) => (
        <div
          key={s.key}
          title={s.label}
          className={[
            'h-1.5 flex-1 rounded-full transition-colors',
            i < currentIdx
              ? 'bg-teal-500'
              : i === currentIdx
              ? 'bg-amber-500'
              : 'bg-ink-700',
          ].join(' ')}
        />
      ))}
      <span className="ml-1.5 font-mono text-[10px] text-slate-500 shrink-0">
        {currentIdx + 1}/{STAGES.length}
      </span>
    </div>
  );
}

export default function ProductionPage() {
  const { data, isLoading } = useGetProductionOrdersQuery({ limit: 200 });
  const [showCreate, setShowCreate] = useState(false);
  const [dailyTarget, setDailyTarget] = useState<ProductionOrder | null>(null);
  const [advanceTarget, setAdvanceTarget] = useState<ProductionOrder | null>(null);

  const grouped = STAGES.map((s) => ({
    ...s,
    items: (data?.data || []).filter((p) => p.stage === s.key),
  }));

  const totalActive = (data?.data || []).filter((p) => p.status === 'inProgress').length;
  const totalCompleted = (data?.data || []).filter((p) => p.status === 'completed').length;

  return (
    <div>
      <PageHeader
        title="Production Floor"
        subtitle="Knitting → Dyeing → Cutting → Sewing → Packing"
        actions={
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            + New Production Order
          </button>
        }
      />

      {/* Summary strip */}
      {!isLoading && (data?.data?.length ?? 0) > 0 && (
        <div className="flex gap-4 mb-4 flex-wrap">
          <div className="panel px-4 py-2 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-500">In Progress:</span>
            <span className="font-mono font-bold text-slate-200">{totalActive}</span>
          </div>
          <div className="panel px-4 py-2 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0" />
            <span className="text-slate-500">Completed:</span>
            <span className="font-mono font-bold text-slate-200">{totalCompleted}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-72 shrink-0 space-y-3">
              <Skeleton className="h-5 w-24" />
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="panel p-4 space-y-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-3 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 flex-1 rounded-lg" />
                    <Skeleton className="h-8 flex-1 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {grouped.map((col) => (
            <div key={col.key} className="w-72 shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <p className="label-tag">{col.label}</p>
                <span className="font-mono text-xs text-slate-500">{col.items.length}</span>
              </div>
              <div className="space-y-3">
                {col.items.length === 0 && (
                  <div className="panel border-dashed p-4 text-center text-xs text-slate-600">
                    No orders
                  </div>
                )}
                {col.items.map((p) => (
                  <div key={p._id} className="panel p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">{p.prodOrderNo}</span>
                      <StatusBadge status={p.status} />
                    </div>

                    <StagePipeline stage={p.stage} />

                    <div className="mt-3">
                      <ProductionProgressBar value={p.progress ?? 0} planned={p.plannedQuantity} actual={p.actualQuantity} />
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-400">
                      {p.processUnit && <p>Unit: {p.processUnit}</p>}
                      {p.machineName && <p>Machine: {p.machineName}</p>}
                      {p.supervisor && <p>Supervisor: {p.supervisor}</p>}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        className="btn-secondary flex-1 justify-center !py-1.5 !text-xs"
                        onClick={() => setDailyTarget(p)}
                      >
                        Log Output
                      </button>
                      {p.stage !== 'finalInspection' && (
                        <button
                          className={[
                            'flex-1 justify-center !py-1.5 !text-xs',
                            p.status === 'completed'
                              ? 'btn-primary'
                              : 'btn-secondary opacity-50',
                          ].join(' ')}
                          onClick={() => setAdvanceTarget(p)}
                          title={
                            p.status !== 'completed'
                              ? 'Complete this stage first, or use override'
                              : 'Advance to next stage'
                          }
                        >
                          Advance →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <ProductionOrderModal onClose={() => setShowCreate(false)} />}
      {dailyTarget && <DailyProductionModal order={dailyTarget} onClose={() => setDailyTarget(null)} />}
      {advanceTarget && (
        <AdvanceStageModal order={advanceTarget} onClose={() => setAdvanceTarget(null)} />
      )}
    </div>
  );
}
