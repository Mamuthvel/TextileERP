import Dispatch, { IDispatchDocument } from '../models/Dispatch';
import Invoice, { IInvoiceDocument } from '../models/Invoice';
import { getNextSequence } from '../models/Counter';
import { paginate, PaginatedResult } from '../utils/paginate';
import { NotFoundError } from '../errors/AppError';

interface CartonInput { qty?: number; [key: string]: unknown }
interface InvoiceItemInput { quantity?: number; unitPrice?: number; [key: string]: unknown }

export const dispatchService = {
  getAll: async (query: Record<string, unknown>, filter: Record<string, unknown>): Promise<PaginatedResult<IDispatchDocument>> => {
    return paginate(Dispatch, query, filter);
  },

  create: async (body: Record<string, unknown>): Promise<IDispatchDocument> => {
    const dispatchNo = await getNextSequence('dispatches', 'DISP');
    const cartons = (body.cartons as CartonInput[]) || [];
    const totalCartons = cartons.length;
    const totalQuantity = cartons.reduce((sum, c) => sum + (c.qty || 0), 0);
    return Dispatch.create({ ...body, dispatchNo, totalCartons, totalQuantity });
  },

  update: async (id: string, body: Record<string, unknown>): Promise<IDispatchDocument> => {
    const dispatch = await Dispatch.findByIdAndUpdate(id, body, { new: true });
    if (!dispatch) throw new NotFoundError('Dispatch not found');
    return dispatch;
  },

  getAllInvoices: async (query: Record<string, unknown>, filter: Record<string, unknown>): Promise<PaginatedResult<IInvoiceDocument>> => {
    return paginate(Invoice, query, filter);
  },

  createInvoice: async (body: Record<string, unknown>): Promise<IInvoiceDocument> => {
    const invoiceNo = await getNextSequence('invoices', 'INV');
    const items = ((body.items as InvoiceItemInput[]) || []).map((i) => ({
      ...i,
      amount: (i.quantity || 0) * (i.unitPrice || 0),
    }));
    const totalAmount = items.reduce((sum, i) => sum + (i.amount || 0), 0);
    return Invoice.create({ ...body, items, totalAmount, invoiceNo });
  },

  updateInvoice: async (id: string, body: Record<string, unknown>): Promise<IInvoiceDocument> => {
    const invoice = await Invoice.findByIdAndUpdate(id, body, { new: true });
    if (!invoice) throw new NotFoundError('Invoice not found');
    return invoice;
  },
};
