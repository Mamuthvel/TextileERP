import { Types } from 'mongoose';
import PurchaseOrder, { IPurchaseOrderDocument } from '../models/PurchaseOrder';
import { getNextSequence } from '../models/Counter';
import { paginate, PaginatedResult } from '../utils/paginate';
import { NotFoundError } from '../errors/AppError';

interface POItemInput {
  description?: string;
  quantity?: number;
  uom?: string;
  unitPrice?: number;
}

const calcItems = (items: POItemInput[]) =>
  items.map((i) => ({ ...i, totalPrice: (i.quantity || 0) * (i.unitPrice || 0) }));

export const poService = {
  getAll: async (query: Record<string, unknown>, filter: Record<string, unknown>): Promise<PaginatedResult<IPurchaseOrderDocument>> => {
    return paginate(PurchaseOrder, query, filter);
  },

  create: async (body: Record<string, unknown>, userId: Types.ObjectId): Promise<IPurchaseOrderDocument> => {
    const poNo = await getNextSequence('purchaseOrders', 'PO');
    const items = calcItems((body.items as POItemInput[]) || []);
    const totalAmount = items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
    return PurchaseOrder.create({ ...body, items, totalAmount, poNo, createdBy: userId });
  },

  update: async (id: string, body: Record<string, unknown>): Promise<IPurchaseOrderDocument> => {
    const items = calcItems((body.items as POItemInput[]) || []);
    const update: Record<string, unknown> = { ...body };
    if (items.length) {
      update.items = items;
      update.totalAmount = items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
    }
    const po = await PurchaseOrder.findByIdAndUpdate(id, update, { new: true });
    if (!po) throw new NotFoundError('PO not found');
    return po;
  },
};
