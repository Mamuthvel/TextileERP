import { z } from 'zod';

const cartonSchema = z.object({
  cartonNo: z.string().optional(),
  qty: z.number().min(0).optional(),
  grossWeight: z.number().optional(),
  netWeight: z.number().optional(),
});

export const createDispatchSchema = z.object({
  body: z.object({
    orderId: z.string().optional(),
    lorryNo: z.string().optional(),
    blNo: z.string().optional(),
    cartons: z.array(cartonSchema).optional(),
    shippingStatus: z.enum(['pending', 'packed', 'shipped', 'delivered']).optional(),
    dispatchDate: z.string().optional(),
  }),
});

export const updateDispatchSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    lorryNo: z.string().optional(),
    blNo: z.string().optional(),
    cartons: z.array(cartonSchema).optional(),
    shippingStatus: z.enum(['pending', 'packed', 'shipped', 'delivered']).optional(),
    dispatchDate: z.string().optional(),
  }),
});

const invoiceItemSchema = z.object({
  description: z.string().optional(),
  quantity: z.number().min(0).optional(),
  unitPrice: z.number().min(0).optional(),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    orderId: z.string().optional(),
    dispatchId: z.string().optional(),
    buyer: z.string().optional(),
    items: z.array(invoiceItemSchema).optional(),
    currency: z.string().optional(),
    dutyDrawback: z.number().optional(),
    creditAdvice: z.number().optional(),
    status: z.enum(['draft', 'sent', 'paid', 'overdue']).optional(),
    invoiceDate: z.string().optional(),
  }),
});

export const updateInvoiceSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    buyer: z.string().optional(),
    items: z.array(invoiceItemSchema).optional(),
    currency: z.string().optional(),
    dutyDrawback: z.number().optional(),
    creditAdvice: z.number().optional(),
    status: z.enum(['draft', 'sent', 'paid', 'overdue']).optional(),
  }),
});
