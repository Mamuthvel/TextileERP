import { Request, Response } from 'express';
import { costingService } from '../services/costingService';
import { asyncHandler } from '../utils/asyncHandler';

export const getCostings = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.orderId) filter.orderId = req.query.orderId;
  if (req.query.type) filter.type = req.query.type;
  const { data, pagination } = await costingService.getAll(req.query as Record<string, unknown>, filter);
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const createCosting = asyncHandler(async (req: Request, res: Response) => {
  const costing = await costingService.create(req.body);
  res.status(201).json({ success: true, data: costing, message: 'Costing saved' });
});

export const updateCosting = asyncHandler(async (req: Request, res: Response) => {
  const costing = await costingService.update(req.params.id, req.body);
  res.json({ success: true, data: costing, message: 'Costing updated' });
});

export const compareCosting = asyncHandler(async (req: Request, res: Response) => {
  const result = await costingService.compare(req.params.orderId);
  res.json({ success: true, data: result, message: 'OK' });
});
