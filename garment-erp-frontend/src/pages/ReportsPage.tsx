import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  useGetOrderSummaryReportQuery,
  useGetProductionEfficiencyReportQuery,
  useGetInventoryAgingReportQuery,
  useLazyGetInventoryAgingReportQuery,
} from '../api/dashboardApi';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const AGING_LIMIT = 10;
const CATEGORIES = ['yarn', 'greyFabric', 'finishedFabric', 'trim', 'packingMaterial'];

function exportAgingCSV(data: any[]) {
  const header = ['Item Code', 'Description', 'Category', 'Current Stock', 'Last Updated', 'Age (Days)'];
  const rows = data.map((i) => [
    i.itemCode,
    i.description,
    i.category,
    i.currentStock,
    new Date(i.lastUpdated).toLocaleDateString(),
    i.ageDays,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventory-aging.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function exportAgingPDF(data: any[]) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Inventory Aging Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);
  autoTable(doc, {
    head: [['Item Code', 'Description', 'Category', 'Stock', 'Last Updated', 'Age (Days)']],
    body: data.map((i) => [
      i.itemCode,
      i.description,
      i.category,
      i.currentStock,
      new Date(i.lastUpdated).toLocaleDateString(),
      i.ageDays,
    ]),
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [245, 158, 11] },
    didParseCell: (hookData) => {
      if (hookData.column.index === 5 && hookData.section === 'body') {
        if (Number(hookData.cell.raw) > 60) hookData.cell.styles.textColor = [220, 38, 38];
      }
    },
  });
  doc.save('inventory-aging.pdf');
}

export default function ReportsPage() {
  const { data: orderSummary, isLoading: l1 } = useGetOrderSummaryReportQuery();
  const { data: efficiency, isLoading: l2 } = useGetProductionEfficiencyReportQuery();

  const [agingPage, setAgingPage] = useState(1);
  const [agingCategory, setAgingCategory] = useState('');
  const [agingMinAge, setAgingMinAge] = useState('');

  const agingParams: Record<string, any> = { page: agingPage, limit: AGING_LIMIT };
  if (agingCategory) agingParams.category = agingCategory;
  if (agingMinAge) agingParams.minAge = agingMinAge;

  const { data: aging, isLoading: l3 } = useGetInventoryAgingReportQuery(agingParams);
  const [triggerAgingExport, { isFetching: exporting }] = useLazyGetInventoryAgingReportQuery();

  const buildExportParams = () => {
    const p: Record<string, any> = { all: 'true' };
    if (agingCategory) p.category = agingCategory;
    if (agingMinAge) p.minAge = agingMinAge;
    return p;
  };

  const handleExportCSV = async () => {
    const result = await triggerAgingExport(buildExportParams());
    if (result.data?.data) exportAgingCSV(result.data.data);
  };

  const handleExportPDF = async () => {
    const result = await triggerAgingExport(buildExportParams());
    if (result.data?.data) exportAgingPDF(result.data.data);
  };

  const handleCategoryChange = (val: string) => {
    setAgingCategory(val);
    setAgingPage(1);
  };

  const handleMinAgeChange = (val: string) => {
    setAgingMinAge(val);
    setAgingPage(1);
  };

  return (
    <div>
      <PageHeader title="Analytics & Reports" subtitle="Cross-functional Insights" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <p className="label-tag mb-4">Orders by Buyer</p>
          {l1 ? (
            <p className="text-slate-500">Loading…</p>
          ) : (
            <div className="table-wrap overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Buyer</th>
                    <th>Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {orderSummary?.data?.byBuyer?.map((b: any) => (
                    <tr key={b._id}>
                      <td>{b._id || 'Unknown'}</td>
                      <td className="font-mono">{b.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel p-5">
          <p className="label-tag mb-4">Production Efficiency by Stage</p>
          {l2 ? (
            <p className="text-slate-500">Loading…</p>
          ) : (efficiency?.data?.length ?? 0) === 0 ? (
            <p className="text-slate-500">No production data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={efficiency?.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2c3f" />
                <XAxis dataKey="stage" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#16202f', border: '1px solid #2c3c54', borderRadius: 8 }} />
                <Bar dataKey="efficiency" fill="#22b8b5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="panel lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="label-tag">Inventory Aging</p>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={agingCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-field max-w-[180px] !py-1 !text-xs"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Min age (days)"
                value={agingMinAge}
                min={0}
                onChange={(e) => handleMinAgeChange(e.target.value)}
                className="input-field w-32 !py-1 !text-xs"
              />
              <button
                onClick={handleExportCSV}
                disabled={exporting}
                className="btn-secondary !py-1 !px-3 !text-xs"
              >
                ↓ CSV
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="btn-secondary !py-1 !px-3 !text-xs"
              >
                ↓ PDF
              </button>
            </div>
          </div>

          {l3 ? (
            <p className="px-5 pb-5 text-slate-500">Loading…</p>
          ) : (
            <>
              <div className="table-wrap overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Item Code</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Last Updated</th>
                      <th>Age (days)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(aging?.data?.length ?? 0) === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          No items found.
                        </td>
                      </tr>
                    ) : (
                      aging?.data?.map((i: any) => (
                        <tr key={i.itemCode}>
                          <td className="font-mono text-amber-400">{i.itemCode}</td>
                          <td>{i.description}</td>
                          <td>{i.category}</td>
                          <td className="font-mono">{i.currentStock}</td>
                          <td>{new Date(i.lastUpdated).toLocaleDateString()}</td>
                          <td className={`font-mono ${i.ageDays > 60 ? 'text-rose-400' : ''}`}>{i.ageDays}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {aging?.pagination && (
                <Pagination
                  page={aging.pagination.page}
                  totalPages={aging.pagination.totalPages}
                  total={aging.pagination.total}
                  limit={AGING_LIMIT}
                  onPageChange={setAgingPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
