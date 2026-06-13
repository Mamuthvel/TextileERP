import { z } from 'zod';

const inventoryCategories = ['yarn', 'greyFabric', 'finishedFabric', 'trim', 'packingMaterial'] as const;

export const createItemSchema = z.object({
  body: z.object({
    itemCode: z.string().min(1, 'Item code is required'),
    category: z.enum(inventoryCategories),
    description: z.string().optional(),
    uom: z.string().optional(),
    currentStock: z.number().min(0).optional(),
    location: z.string().optional(),
    minStockLevel: z.number().min(0).optional(),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    description: z.string().optional(),
    uom: z.string().optional(),
    currentStock: z.number().min(0).optional(),
    location: z.string().optional(),
    minStockLevel: z.number().min(0).optional(),
  }),
});

export const createTransactionSchema = z.object({
  body: z.object({
    inventoryId: z.string().min(1, 'Inventory ID is required'),
    transactionType: z.enum(['GRN', 'issue', 'transfer', 'return', 'adjustment']),
    quantity: z.number({ required_error: 'Quantity is required' }),
    orderId: z.string().optional(),
    uom: z.string().optional(),
    reference: z.string().optional(),
    inspectionResult: z.enum(['passed', 'failed', 'conditional']).optional(),
    billNo: z.string().optional(),
    billAmount: z.number().optional(),
  }),
});
