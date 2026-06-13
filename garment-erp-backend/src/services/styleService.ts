import Style, { IStyleDocument } from '../models/Style';
import BOM, { IBOMDocument } from '../models/BOM';
import { paginate, PaginatedResult } from '../utils/paginate';
import { NotFoundError } from '../errors/AppError';

export const styleService = {
  getAll: async (query: Record<string, unknown>, orderId?: string): Promise<PaginatedResult<IStyleDocument>> => {
    const filter: Record<string, unknown> = {};
    if (orderId) filter.orderId = orderId;
    return paginate(Style, query, filter);
  },

  create: async (body: Partial<IStyleDocument>): Promise<IStyleDocument> => {
    return Style.create(body);
  },

  update: async (id: string, body: Partial<IStyleDocument>): Promise<IStyleDocument> => {
    const style = await Style.findByIdAndUpdate(id, body, { new: true });
    if (!style) throw new NotFoundError('Style not found');
    return style;
  },

  getBOM: async (styleId: string): Promise<IBOMDocument | null> => {
    return BOM.findOne({ styleId });
  },

  saveBOM: async (styleId: string, body: Partial<IBOMDocument>): Promise<IBOMDocument> => {
    const totalEstimatedCost =
      ((body.yarns || []).reduce((s, y) => s + (y.quantityKg || 0) * (y.unitCost || 0), 0)) +
      ((body.fabrics || []).reduce((s, f) => s + (f.quantityMtrs || 0) * (f.unitCost || 0), 0)) +
      ((body.trims || []).reduce((s, t) => s + (t.quantity || 0) * (t.unitCost || 0), 0));

    const bom = await BOM.findOneAndUpdate(
      { styleId },
      { ...body, styleId, totalEstimatedCost },
      { new: true, upsert: true }
    );
    await Style.findByIdAndUpdate(styleId, { bomId: bom!._id });
    return bom!;
  },
};
