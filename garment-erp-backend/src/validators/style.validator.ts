import { z } from 'zod';

export const createStyleSchema = z.object({
  body: z.object({
    styleNo: z.string().min(1, 'Style number is required'),
    orderId: z.string().optional(),
    description: z.string().optional(),
    fabric: z.string().optional(),
    fabricGSM: z.number().optional(),
    trims: z.array(z.string()).optional(),
    techPack: z.string().optional(),
    status: z.enum(['design', 'approved', 'inProduction']).optional(),
    designLibraryRef: z.string().optional(),
  }),
});

export const updateStyleSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    description: z.string().optional(),
    fabric: z.string().optional(),
    fabricGSM: z.number().optional(),
    trims: z.array(z.string()).optional(),
    techPack: z.string().optional(),
    status: z.enum(['design', 'approved', 'inProduction']).optional(),
    designLibraryRef: z.string().optional(),
  }),
});

const bomLineItemSchema = z.object({
  description: z.string().optional(),
  uom: z.string().optional(),
  quantity: z.number().optional(),
  unitCost: z.number().optional(),
});

export const saveBOMSchema = z.object({
  params: z.object({ styleId: z.string().min(1) }),
  body: z.object({
    orderId: z.string().optional(),
    yarns: z.array(z.object({
      description: z.string().optional(),
      count: z.string().optional(),
      composition: z.string().optional(),
      quantityKg: z.number().optional(),
      unitCost: z.number().optional(),
    })).optional(),
    fabrics: z.array(z.object({
      description: z.string().optional(),
      construction: z.string().optional(),
      quantityMtrs: z.number().optional(),
      unitCost: z.number().optional(),
    })).optional(),
    trims: z.array(bomLineItemSchema).optional(),
  }),
});
