import { Types } from 'mongoose';
import Inventory, { IInventoryDocument } from '../models/Inventory';
import StockTransaction, { IStockTransactionDocument } from '../models/StockTransaction';
import { paginate, PaginatedResult } from '../utils/paginate';
import { NotFoundError, ValidationError } from '../errors/AppError';

export interface TransactionDto {
  inventoryId: string;
  transactionType: 'GRN' | 'issue' | 'transfer' | 'return' | 'adjustment';
  quantity: number;
  orderId?: string;
  uom?: string;
  reference?: string;
  inspectionResult?: 'passed' | 'failed' | 'conditional';
  billNo?: string;
  billAmount?: number;
}

export const inventoryService = {
  getAll: async (query: Record<string, unknown>, filter: Record<string, unknown>): Promise<PaginatedResult<IInventoryDocument>> => {
    return paginate(Inventory, query, filter, 'itemCode');
  },

  create: async (body: Partial<IInventoryDocument>): Promise<IInventoryDocument> => {
    return Inventory.create(body);
  },

  update: async (id: string, body: Partial<IInventoryDocument>): Promise<IInventoryDocument> => {
    const item = await Inventory.findByIdAndUpdate(id, body, { new: true });
    if (!item) throw new NotFoundError('Item not found');
    return item;
  },

  getTransactions: async (query: Record<string, unknown>, inventoryId?: string): Promise<PaginatedResult<IStockTransactionDocument>> => {
    const filter: Record<string, unknown> = {};
    if (inventoryId) filter.inventoryId = inventoryId;
    return paginate(StockTransaction, query, filter);
  },

  createTransaction: async (
    dto: TransactionDto,
    userId: Types.ObjectId
  ): Promise<{ transaction: IStockTransactionDocument; item: IInventoryDocument }> => {
    const item = await Inventory.findById(dto.inventoryId);
    if (!item) throw new NotFoundError('Inventory item not found');

    if (['GRN', 'return'].includes(dto.transactionType)) {
      item.currentStock += Number(dto.quantity);
    } else if (['issue', 'transfer'].includes(dto.transactionType)) {
      if (item.currentStock < dto.quantity) {
        throw new ValidationError('Insufficient stock');
      }
      item.currentStock -= Number(dto.quantity);
    } else if (dto.transactionType === 'adjustment') {
      item.currentStock = Number(dto.quantity);
    }
    await item.save();

    const transaction = await StockTransaction.create({ ...dto, createdBy: userId });
    return { transaction, item };
  },
};
