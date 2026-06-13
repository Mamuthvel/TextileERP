import { Request, Response } from 'express';
import { dispatchService } from '../services/dispatchService';
import { asyncHandler } from '../utils/asyncHandler';

export const getDispatches = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.orderId) filter.orderId = req.query.orderId;
  const { data, pagination } = await dispatchService.getAll(req.query as Record<string, unknown>, filter);
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const createDispatch = asyncHandler(async (req: Request, res: Response) => {
  const dispatch = await dispatchService.create(req.body);
  res.status(201).json({ success: true, data: dispatch, message: 'Dispatch created' });
});

export const updateDispatch = asyncHandler(async (req: Request, res: Response) => {
  const dispatch = await dispatchService.update(req.params.id, req.body);
  res.json({ success: true, data: dispatch, message: 'Dispatch updated' });
});

export const getInvoices = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.orderId) filter.orderId = req.query.orderId;
  const { data, pagination } = await dispatchService.getAllInvoices(req.query as Record<string, unknown>, filter);
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const createInvoice = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await dispatchService.createInvoice(req.body);
  res.status(201).json({ success: true, data: invoice, message: 'Invoice created' });
});

export const updateInvoice = asyncHandler(async (req: Request, res: Response) => {
  const invoice = await dispatchService.updateInvoice(req.params.id, req.body);
  res.json({ success: true, data: invoice, message: 'Invoice updated' });
});
