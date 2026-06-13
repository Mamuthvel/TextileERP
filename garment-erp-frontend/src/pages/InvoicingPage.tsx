import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useGetInvoicesQuery, useUpdateInvoiceMutation, useLazyGetInvoicesQuery } from '../api/dispatchApi';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import InvoiceFormModal from '../components/invoicing/InvoiceFormModal';
import type { Invoice } from '../types';

const LIMIT = 15;

function exportInvoiceCSV(invoices: Invoice[]) {
  const header = ['Invoice No.', 'Buyer', 'Currency', 'Total Amount', 'Duty Drawback', 'Credit Advice', 'Date', 'Status'];
  const rows = invoices.map((inv) => [
    inv.invoiceNo,
    inv.buyer || '',
    inv.currency,
    inv.totalAmount,
    inv.dutyDrawback || 0,
    inv.creditAdvice || 0,
    new Date(inv.invoiceDate).toLocaleDateString(),
    inv.status,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'invoices.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function exportInvoicePDF(invoices: Invoice[]) {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text('Invoices Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);
  autoTable(doc, {
    head: [['Invoice No.', 'Buyer', 'Currency', 'Total', 'Duty Drawback', 'Credit Advice', 'Date', 'Status']],
    body: invoices.map((inv) => [
      inv.invoiceNo,
      inv.buyer || '—',
      inv.currency,
      inv.totalAmount.toLocaleString(),
      (inv.dutyDrawback || 0).toLocaleString(),
      (inv.creditAdvice || 0).toLocaleString(),
      new Date(inv.invoiceDate).toLocaleDateString(),
      inv.status,
    ]),
    startY: 28,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [245, 158, 11] },
  });
  doc.save('invoices.pdf');
}

export default function InvoicingPage() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading } = useGetInvoicesQuery({ page, limit: LIMIT });
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [triggerExport, { isFetching: exporting }] = useLazyGetInvoicesQuery();

  const handleExportCSV = async () => {
    const result = await triggerExport({ limit: 1000 });
    if (result.data?.data) exportInvoiceCSV(result.data.data);
  };

  const handleExportPDF = async () => {
    const result = await triggerExport({ limit: 1000 });
    if (result.data?.data) exportInvoicePDF(result.data.data);
  };

  return (
    <div>
      <PageHeader
        title="Invoicing & Receivables"
        subtitle="Export Invoices · Duty Drawback · Credit Advice"
        actions={
          <div className="flex items-center gap-2">
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
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              + New Invoice
            </button>
          </div>
        }
      />

      <div className="panel overflow-x-auto">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Buyer</th>
                <th>Total</th>
                <th>Duty Drawback</th>
                <th>Credit Advice</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading invoices…
                  </td>
                </tr>
              )}
              {!isLoading && (data?.data.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No invoices created yet.
                  </td>
                </tr>
              )}
              {data?.data.map((inv) => (
                <tr key={inv._id}>
                  <td className="font-mono font-semibold text-amber-500 dark:text-amber-400">{inv.invoiceNo}</td>
                  <td>{inv.buyer || '—'}</td>
                  <td className="font-mono">
                    {inv.currency} {inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="font-mono">{inv.dutyDrawback?.toLocaleString() || 0}</td>
                  <td className="font-mono">{inv.creditAdvice?.toLocaleString() || 0}</td>
                  <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                  <td>
                    <StatusBadge status={inv.status} />
                  </td>
                  <td>
                    {inv.status === 'draft' && (
                      <button
                        className="btn-secondary !py-1 !px-2 !text-xs"
                        onClick={() => updateInvoice({ id: inv._id, body: { status: 'sent' } })}
                      >
                        Mark Sent
                      </button>
                    )}
                    {inv.status === 'sent' && (
                      <button
                        className="btn-secondary !py-1 !px-2 !text-xs"
                        onClick={() => updateInvoice({ id: inv._id, body: { status: 'paid' } })}
                      >
                        Mark Paid
                      </button>
                    )}
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

      {showModal && <InvoiceFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
