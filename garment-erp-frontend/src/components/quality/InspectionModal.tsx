import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import { useCreateInspectionMutation } from '../../api/qualityApi';

export default function InspectionModal({
  onClose,
  defaultOrderId,
}: {
  onClose: () => void;
  defaultOrderId?: string;
}) {
  const [create, { isLoading, error }] = useCreateInspectionMutation();
  const [form, setForm] = useState({
    inspectionType: 'fabricInspection',
    inspectionDate: new Date().toISOString().slice(0, 10),
    sampleSize: 0,
    result: 'pass' as 'pass' | 'fail' | 'conditional',
    remarks: '',
  });
  const [defects, setDefects] = useState([{ defectType: '', count: 0 }]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await create({
        ...form,
        ...(defaultOrderId ? { orderId: defaultOrderId } : {}),
        defectsFound: defects.filter((d) => d.defectType && d.count),
      } as any).unwrap();
      onClose();
      toast.success('Inspection recorded');
    } catch { toast.error('Failed to save inspection.'); }
  };

  return (
    <Modal title="Record Quality Inspection" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="field-label">Inspection Type</label>
          <select className="input-field" value={form.inspectionType} onChange={(e) => setForm({ ...form, inspectionType: e.target.value })}>
            <option value="fabricInspection">Fabric Inspection</option>
            <option value="sewingInline">Sewing In-line</option>
            <option value="finalInspection">Final Inspection</option>
            <option value="auditInspection">Audit Inspection</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Date</label>
            <input type="date" className="input-field" value={form.inspectionDate}
              onChange={(e) => setForm({ ...form, inspectionDate: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Sample Size</label>
            <input type="number" className="input-field" value={form.sampleSize}
              onChange={(e) => setForm({ ...form, sampleSize: Number(e.target.value) })} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="field-label mb-0">Defects Found</label>
            <button type="button" className="text-xs font-mono text-amber-400 hover:underline"
              onClick={() => setDefects((p) => [...p, { defectType: '', count: 0 }])}>
              + add defect
            </button>
          </div>
          <div className="space-y-2">
            {defects.map((d, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                <input className="input-field col-span-2" placeholder="Defect type (e.g. Stain)" value={d.defectType}
                  onChange={(e) => setDefects((prev) => prev.map((x, i) => (i === idx ? { ...x, defectType: e.target.value } : x)))} />
                <input type="number" className="input-field" placeholder="Count" value={d.count || ''}
                  onChange={(e) => setDefects((prev) => prev.map((x, i) => (i === idx ? { ...x, count: Number(e.target.value) } : x)))} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label">Result</label>
          <select className="input-field" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value as any })}>
            <option value="pass">Pass</option>
            <option value="conditional">Conditional</option>
            <option value="fail">Fail</option>
          </select>
        </div>

        <div>
          <label className="field-label">Remarks</label>
          <textarea className="input-field" rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
        </div>

        {error && <p className="text-sm text-rose-400">Failed to save inspection.</p>}

        <div className="flex justify-end gap-2 border-t border-ink-700 pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Saving…' : 'Save Inspection'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
