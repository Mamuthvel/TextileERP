import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { useAdvanceStageMutation } from '../../api/productionApi';
import type { ProductionOrder } from '../../types';

const STAGE_LABELS: Record<string, string> = {
  knitting: 'Knitting',
  yarnDyeing: 'Yarn Dyeing',
  greyFabricReceipt: 'Grey Fabric Receipt',
  fabricDyeing: 'Fabric Dyeing',
  finishing: 'Finishing',
  fabricCutting: 'Fabric Cutting',
  sewing: 'Sewing',
  ironing: 'Ironing',
  packing: 'Packing',
  finalInspection: 'Final Inspection',
};

const STAGE_ORDER = [
  'knitting', 'yarnDyeing', 'greyFabricReceipt', 'fabricDyeing', 'finishing',
  'fabricCutting', 'sewing', 'ironing', 'packing', 'finalInspection',
];

export default function AdvanceStageModal({
  order,
  onClose,
}: {
  order: ProductionOrder;
  onClose: () => void;
}) {
  const [advance, { isLoading, error }] = useAdvanceStageMutation();
  const [override, setOverride] = useState(false);

  const currentIdx = STAGE_ORDER.indexOf(order.stage);
  const nextStage = STAGE_ORDER[currentIdx + 1];
  const nextLabel = nextStage ? STAGE_LABELS[nextStage] : null;

  const handleConfirm = async () => {
    try {
      await advance({ id: order._id, override }).unwrap();
      toast.success(`Advanced to ${nextLabel}`);
      onClose();
    } catch { toast.error('Failed to advance stage.'); }
  };

  if (!nextLabel) return null;

  return (
    <Modal title="Advance to Next Stage" onClose={onClose}>
      <div className="space-y-5">
        {/* Stage transition visual */}
        <div className="flex items-center justify-center gap-4 rounded-lg bg-ink-800 p-4">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">From</p>
            <div className="rounded-lg bg-teal-500/10 px-3 py-2 ring-1 ring-teal-500/30">
              <p className="font-mono text-sm font-bold text-teal-400">{STAGE_LABELS[order.stage]}</p>
              <p className="text-xs text-slate-400 mt-0.5">Stage {currentIdx + 1} of {STAGE_ORDER.length}</p>
            </div>
          </div>

          <div className="text-2xl text-amber-400 pb-4">→</div>

          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">To</p>
            <div className="rounded-lg bg-amber-500/10 px-3 py-2 ring-1 ring-amber-500/30">
              <p className="font-mono text-sm font-bold text-amber-400">{nextLabel}</p>
              <p className="text-xs text-slate-400 mt-0.5">Stage {currentIdx + 2} of {STAGE_ORDER.length}</p>
            </div>
          </div>
        </div>

        {/* Quantity carry-over info */}
        <div className="rounded-lg border border-ink-700 p-4 space-y-2 text-sm">
          <p className="label-tag mb-2">Quantity Carry-over</p>
          <div className="flex justify-between text-slate-400">
            <span>Actual output from {STAGE_LABELS[order.stage]}:</span>
            <span className="font-mono font-bold text-slate-200">{order.actualQuantity.toLocaleString()} pcs</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Will become planned qty for {nextLabel}:</span>
            <span className="font-mono font-bold text-amber-400">{order.actualQuantity.toLocaleString()} pcs</span>
          </div>
        </div>

        {/* Override option (if stage is not completed) */}
        {order.status !== 'completed' && (
          <label className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={override}
              onChange={(e) => setOverride(e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium text-rose-400">Force advance (override)</p>
              <p className="text-xs text-slate-500 mt-0.5">
                This stage is not yet completed. Check to advance anyway.
              </p>
            </div>
          </label>
        )}

        {error && <p className="text-sm text-rose-400">Failed to advance stage.</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            disabled={isLoading || (order.status !== 'completed' && !override)}
            onClick={handleConfirm}
          >
            {isLoading ? 'Advancing…' : `Confirm: Advance to ${nextLabel}`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
