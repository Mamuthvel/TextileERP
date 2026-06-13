import ProductionOrder, { IProductionOrderDocument } from '../models/ProductionOrder';
import { getNextSequence } from '../models/Counter';
import { paginate, PaginatedResult } from '../utils/paginate';
import { NotFoundError, ValidationError } from '../errors/AppError';
import { STAGE_ORDER } from '../config/constants';

export const productionService = {
  getAll: async (query: Record<string, unknown>, filter: Record<string, unknown>): Promise<PaginatedResult<IProductionOrderDocument>> => {
    return paginate(ProductionOrder, query, filter);
  },

  create: async (body: Partial<IProductionOrderDocument>): Promise<IProductionOrderDocument> => {
    const prodOrderNo = await getNextSequence('productionOrders', 'PROD');
    return ProductionOrder.create({ ...body, prodOrderNo });
  },

  update: async (id: string, body: Partial<IProductionOrderDocument>): Promise<IProductionOrderDocument> => {
    const po = await ProductionOrder.findByIdAndUpdate(id, body, { new: true });
    if (!po) throw new NotFoundError('Production order not found');
    return po;
  },

  addDailyProduction: async (
    id: string,
    date: string | undefined,
    qty: number,
    shift: string | undefined
  ): Promise<IProductionOrderDocument> => {
    const po = await ProductionOrder.findById(id);
    if (!po) throw new NotFoundError('Production order not found');
    po.dailyProduction.push({ date: date ? new Date(date) : new Date(), qty, shift });
    po.actualQuantity += Number(qty);
    if (po.status === 'planned') po.status = 'inProgress';
    if (po.actualQuantity >= po.plannedQuantity) po.status = 'completed';
    await po.save();
    return po;
  },

  advanceStage: async (id: string, override: boolean): Promise<IProductionOrderDocument> => {
    const po = await ProductionOrder.findById(id);
    if (!po) throw new NotFoundError('Production order not found');
    if (po.status !== 'completed' && !override) {
      throw new ValidationError(
        'Current stage must be completed before advancing (or pass override:true for admin)'
      );
    }
    const idx = STAGE_ORDER.indexOf(po.stage as typeof STAGE_ORDER[number]);
    if (idx === -1 || idx === STAGE_ORDER.length - 1) {
      throw new ValidationError('No further stage to advance to');
    }
    const nextStage = STAGE_ORDER[idx + 1];
    return ProductionOrder.create({
      prodOrderNo: await getNextSequence('productionOrders', 'PROD'),
      orderId: po.orderId,
      styleId: po.styleId,
      stage: nextStage,
      plannedQuantity: po.actualQuantity,
      status: 'planned',
    });
  },
};
