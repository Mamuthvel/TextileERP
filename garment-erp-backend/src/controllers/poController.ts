import { Request, Response } from 'express';
import { poService } from '../services/poService';
import { asyncHandler } from '../utils/asyncHandler';

export const getPOs = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.orderId) filter.orderId = req.query.orderId;
  const { data, pagination } = await poService.getAll(req.query as Record<string, unknown>, filter);
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const createPO = asyncHandler(async (req: Request, res: Response) => {
  const po = await poService.create(req.body, req.user!._id);
  res.status(201).json({ success: true, data: po, message: 'Purchase order created' });
});

export const updatePO = asyncHandler(async (req: Request, res: Response) => {
  const po = await poService.update(req.params.id, req.body);
  res.json({ success: true, data: po, message: 'Purchase order updated' });
});
