import { z } from 'zod';
import { PRODUCTION_STAGES } from '../config/constants';

export const createProductionOrderSchema = z.object({
  body: z.object({
    orderId: z.string().optional(),
    styleId: z.string().optional(),
    stage: z.enum(PRODUCTION_STAGES),
    processUnit: z.string().optional(),
    plannedQuantity: z.number().min(0).optional(),
    operator: z.string().optional(),
    supervisor: z.string().optional(),
    machineName: z.string().optional(),
    startDate: z.string().optional(),
  }),
});

export const addDailyProductionSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    date: z.string().optional(),
    qty: z.number({ required_error: 'Quantity is required' }).min(0),
    shift: z.string().optional(),
  }),
});

export const advanceStageSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ override: z.boolean().optional() }),
});
