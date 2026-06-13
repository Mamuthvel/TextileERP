import Costing, { ICostingDocument } from '../models/Costing';
import { IOrderDocument } from '../models/Order';

const COST_FIELDS = ['yarnCost', 'fabricCost', 'trimmingCost', 'dyeingCost', 'sewingCost', 'overheadCost', 'packingCost'] as const;
type CostKey = typeof COST_FIELDS[number];

export const seedCosting = async (orders: IOrderDocument[]): Promise<ICostingDocument[]> => {
  await Costing.deleteMany({});

  const created: ICostingDocument[] = [];
  for (const order of orders) {
    const estimateCosts: Record<CostKey, number> = {
      yarnCost: 80000,
      fabricCost: 324000,
      trimmingCost: 9500,
      dyeingCost: 45000,
      sewingCost: 60000,
      overheadCost: 25000,
      packingCost: 8000,
    };
    const estimateTotal = COST_FIELDS.reduce((s, k) => s + estimateCosts[k], 0);
    const estimate = await Costing.create({
      orderId: order._id, type: 'estimate', ...estimateCosts,
      totalCost: estimateTotal, sellingPrice: Math.round(estimateTotal * 1.25), currency: 'INR',
    });

    const postCosts: Record<CostKey, number> = {
      yarnCost: 82500,
      fabricCost: 330000,
      trimmingCost: 9700,
      dyeingCost: 47500,
      sewingCost: 63000,
      overheadCost: 26000,
      packingCost: 8200,
    };
    const postTotal = COST_FIELDS.reduce((s, k) => s + postCosts[k], 0);
    const post = await Costing.create({
      orderId: order._id, type: 'post', ...postCosts,
      totalCost: postTotal, sellingPrice: estimate.sellingPrice, currency: 'INR',
    });

    created.push(estimate, post);
  }

  console.log(`✅ Seeded ${created.length} costing records (estimate + post per order)`);
  return created;
};
