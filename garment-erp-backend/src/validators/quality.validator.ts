import { z } from 'zod';

export const createInspectionSchema = z.object({
  body: z.object({
    inspectionType: z.enum(['fabricInspection', 'sewingInline', 'finalInspection', 'auditInspection']),
    orderId: z.string().optional(),
    productionOrderId: z.string().optional(),
    inspectionDate: z.string().optional(),
    sampleSize: z.number().optional(),
    defectsFound: z.array(z.object({
      defectType: z.string().optional(),
      count: z.number().min(0).optional(),
    })).optional(),
    result: z.enum(['pass', 'fail', 'conditional']).optional(),
    remarks: z.string().optional(),
    photos: z.array(z.string()).optional(),
  }),
});
