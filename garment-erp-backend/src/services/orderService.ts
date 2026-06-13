import { Types } from 'mongoose';
import Order, { IOrderDocument } from '../models/Order';
import { getNextSequence } from '../models/Counter';
import { paginate, PaginatedResult } from '../utils/paginate';
import { NotFoundError, ValidationError } from '../errors/AppError';
import { ORDER_STATUS } from '../config/constants';

export interface OrderFilter {
  status?: string;
  type?: string;
  search?: string;
}

export const orderService = {
  getAll: async (query: Record<string, unknown>, filter: OrderFilter): Promise<PaginatedResult<IOrderDocument>> => {
    const dbFilter: Record<string, unknown> = {};
    if (filter.status) dbFilter.status = filter.status;
    if (filter.type) dbFilter.type = filter.type;
    if (filter.search) {
      dbFilter.$or = [
        { orderNo: new RegExp(String(filter.search), 'i') },
        { buyer: new RegExp(String(filter.search), 'i') },
      ];
    }
    return paginate(Order, query, dbFilter);
  },

  getById: async (id: string): Promise<IOrderDocument> => {
    const order = await Order.findById(id);
    if (!order) throw new NotFoundError('Order not found');
    return order;
  },

  create: async (body: Partial<IOrderDocument>, userId: Types.ObjectId): Promise<IOrderDocument> => {
    const orderNo = await getNextSequence('orders', 'ORD');
    return Order.create({
      ...body,
      orderNo,
      createdBy: userId,
      orderTimeline: [{ event: 'Order Created', by: userId }],
    });
  },

  update: async (id: string, body: Partial<IOrderDocument>): Promise<IOrderDocument> => {
    const order = await Order.findById(id);
    if (!order) throw new NotFoundError('Order not found');
    Object.assign(order, body);
    await order.save();
    return order;
  },

  approve: async (id: string, userId: Types.ObjectId, note?: string): Promise<IOrderDocument> => {
    const order = await Order.findById(id);
    if (!order) throw new NotFoundError('Order not found');
    const idx = ORDER_STATUS.indexOf(order.status as typeof ORDER_STATUS[number]);
    if (idx === -1 || idx === ORDER_STATUS.length - 1) {
      throw new ValidationError('Order cannot be advanced further');
    }
    order.status = ORDER_STATUS[idx + 1] as IOrderDocument['status'];
    order.orderTimeline.push({ event: `Status changed to ${order.status}`, by: userId, note, at: new Date() });
    await order.save();
    return order;
  },

  remove: async (id: string): Promise<void> => {
    const order = await Order.findById(id);
    if (!order) throw new NotFoundError('Order not found');
    await (order as any).softDelete();
  },
};
