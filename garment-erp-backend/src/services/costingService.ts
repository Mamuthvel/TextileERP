import Costing, { ICostingDocument } from '../models/Costing';
import { paginate, PaginatedResult } from '../utils/paginate';
import { NotFoundError } from '../errors/AppError';

const COST_FIELDS = [
  'yarnCost', 'fabricCost', 'trimmingCost', 'dyeingCost',
  'sewingCost', 'overheadCost', 'packingCost',
] as const;

type CostBody = Partial<Record<typeof COST_FIELDS[number], number>>;

const computeTotal = (body: CostBody): number =>
  COST_FIELDS.reduce((sum, key) => sum + (Number(body[key]) || 0), 0);

export const costingService = {
  getAll: async (query: Record<string, unknown>, filter: Record<string, unknown>): Promise<PaginatedResult<ICostingDocument>> => {
    return paginate(Costing, query, filter);
  },

  create: async (body: Record<string, unknown>): Promise<ICostingDocument> => {
    const totalCost = computeTotal(body as CostBody);
    return Costing.create({ ...body, totalCost });
  },

  update: async (id: string, body: Record<string, unknown>): Promise<ICostingDocument> => {
    const totalCost = computeTotal(body as CostBody);
    const costing = await Costing.findByIdAndUpdate(id, { ...body, totalCost }, { new: true });
    if (!costing) throw new NotFoundError('Costing not found');
    return costing;
  },

  compare: async (orderId: string): Promise<{ estimate: ICostingDocument; post: ICostingDocument; variance: Record<string, unknown> }> => {
    const [estimate, post] = await Promise.all([
      Costing.findOne({ orderId, type: 'estimate' }).sort('-createdAt'),
      Costing.findOne({ orderId, type: 'post' }).sort('-createdAt'),
    ]);
    if (!estimate || !post) {
      throw new NotFoundError('Both estimate and post costing required for comparison');
    }
    const variance: Record<string, unknown> = {};
    [...COST_FIELDS, 'totalCost' as const].forEach((key) => {
      const est = ((estimate as unknown as Record<string, unknown>)[key] as number) || 0;
      const act = ((post as unknown as Record<string, unknown>)[key] as number) || 0;
      variance[key] = {
        estimate: est,
        post: act,
        variance: act - est,
        variancePct: est ? Number((((act - est) / est) * 100).toFixed(2)) : 0,
      };
    });
    return { estimate, post, variance };
  },
};
