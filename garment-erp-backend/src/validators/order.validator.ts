import { z } from 'zod';
import { ORDER_STATUS } from '../config/constants';

const assortmentSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  quantity: z.number().min(0).optional(),
});

export const createOrderSchema = z.object({
  body: z.object({
    buyer: z.string().min(1, 'Buyer is required'),
    type: z.enum(['sample', 'bulk']).optional(),
    agent: z.string().optional(),
    styleCategory: z.string().optional(),
    season: z.string().optional(),
    deliveryDate: z.string().optional(),
    destination: z.string().optional(),
    garmentAssortments: z.array(assortmentSchema).optional(),
    status: z.enum(ORDER_STATUS).optional(),
    agentCommission: z.number().min(0).optional(),
    remarks: z.string().optional(),
  }),
});

export const updateOrderSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    buyer: z.string().optional(),
    type: z.enum(['sample', 'bulk']).optional(),
    agent: z.string().optional(),
    styleCategory: z.string().optional(),
    season: z.string().optional(),
    deliveryDate: z.string().optional(),
    destination: z.string().optional(),
    garmentAssortments: z.array(assortmentSchema).optional(),
    status: z.enum(ORDER_STATUS).optional(),
    agentCommission: z.number().min(0).optional(),
    remarks: z.string().optional(),
  }),
});

export const approveOrderSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ note: z.string().optional() }),
});
