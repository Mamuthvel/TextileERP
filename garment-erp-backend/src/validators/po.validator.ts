import { z } from 'zod';

const poItemSchema = z.object({
  description: z.string().optional(),
  quantity: z.number().min(0).optional(),
  uom: z.string().optional(),
  unitPrice: z.number().min(0).optional(),
});

export const createPOSchema = z.object({
  body: z.object({
    vendor: z.string().min(1, 'Vendor is required'),
    orderId: z.string().optional(),
    items: z.array(poItemSchema).optional(),
    currency: z.string().optional(),
    expectedDelivery: z.string().optional(),
    status: z.enum(['draft', 'sent', 'acknowledged', 'partiallyReceived', 'fullyReceived', 'closed']).optional(),
  }),
});

export const updatePOSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    vendor: z.string().optional(),
    items: z.array(poItemSchema).optional(),
    currency: z.string().optional(),
    expectedDelivery: z.string().optional(),
    status: z.enum(['draft', 'sent', 'acknowledged', 'partiallyReceived', 'fullyReceived', 'closed']).optional(),
  }),
});
