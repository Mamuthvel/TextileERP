import { z } from 'zod';

const costingBody = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  type: z.enum(['estimate', 'post']),
  yarnCost: z.number().min(0).optional(),
  fabricCost: z.number().min(0).optional(),
  trimmingCost: z.number().min(0).optional(),
  dyeingCost: z.number().min(0).optional(),
  sewingCost: z.number().min(0).optional(),
  overheadCost: z.number().min(0).optional(),
  packingCost: z.number().min(0).optional(),
  sellingPrice: z.number().min(0).optional(),
  currency: z.string().optional(),
});

export const createCostingSchema = z.object({ body: costingBody });

export const updateCostingSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: costingBody.partial(),
});
