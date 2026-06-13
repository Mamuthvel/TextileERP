import { Request, Response } from 'express';
import { productionService } from '../services/productionService';
import { asyncHandler } from '../utils/asyncHandler';

export const getProductionOrders = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.stage) filter.stage = req.query.stage;
  if (req.query.orderId) filter.orderId = req.query.orderId;
  if (req.query.status) filter.status = req.query.status;
  const { data, pagination } = await productionService.getAll(req.query as Record<string, unknown>, filter);
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const createProductionOrder = asyncHandler(async (req: Request, res: Response) => {
  const po = await productionService.create(req.body);
  res.status(201).json({ success: true, data: po, message: 'Production order created' });
});

export const updateProductionOrder = asyncHandler(async (req: Request, res: Response) => {
  const po = await productionService.update(req.params.id, req.body);
  res.json({ success: true, data: po, message: 'Production order updated' });
});

export const addDailyProduction = asyncHandler(async (req: Request, res: Response) => {
  const po = await productionService.addDailyProduction(
    req.params.id,
    req.body.date,
    req.body.qty,
    req.body.shift
  );
  res.json({ success: true, data: po, message: 'Daily production logged' });
});

export const advanceStage = asyncHandler(async (req: Request, res: Response) => {
  const newPo = await productionService.advanceStage(req.params.id, !!req.body.override);
  res.status(201).json({ success: true, data: newPo, message: `Advanced to stage: ${newPo.stage}` });
});
