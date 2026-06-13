import { useState } from 'react';
import { useGetInspectionsQuery } from '../api/qualityApi';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import InspectionModal from '../components/quality/InspectionModal';

const TYPE_LABELS: Record<string, string> = {
  fabricInspection: 'Fabric Inspection',
  sewingInline: 'Sewing In-line',
  finalInspection: 'Final Inspection',
  auditInspection: 'Audit Inspection',
};

const LIMIT = 15;

export default function QualityPage() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading } = useGetInspectionsQuery({ page, limit: LIMIT });

  return (
    <div>
      <PageHeader
        title="Quality Control"
        subtitle="AQL Inspections & Defect Tracking"
        actions={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Record Inspection
          </button>
        }
      />

      <div className="panel overflow-x-auto">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Sample Size</th>
                <th>Total Defects</th>
                <th>Defect Breakdown</th>
                <th>Result</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading inspections…
                  </td>
                </tr>
              )}
              {!isLoading && (data?.data.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No inspections recorded yet.
                  </td>
                </tr>
              )}
              {data?.data.map((q) => (
                <tr key={q._id}>
                  <td>{new Date(q.inspectionDate).toLocaleDateString()}</td>
                  <td>{TYPE_LABELS[q.inspectionType] || q.inspectionType}</td>
                  <td className="font-mono">{q.sampleSize}</td>
                  <td className="font-mono">{q.totalDefects}</td>
                  <td className="text-xs text-slate-400">
                    {q.defectsFound.map((d) => `${d.defectType} (${d.count})`).join(', ') || '—'}
                  </td>
                  <td>
                    <StatusBadge status={q.result} />
                  </td>
                  <td className="max-w-[200px] truncate text-xs text-slate-400">{q.remarks || '—'}</td>
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

      {showModal && <InspectionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
