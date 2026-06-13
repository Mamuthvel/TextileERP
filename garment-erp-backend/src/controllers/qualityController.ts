import { Request, Response } from 'express';
import { qualityService } from '../services/qualityService';
import { asyncHandler } from '../utils/asyncHandler';

export const getInspections = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.orderId) filter.orderId = req.query.orderId;
  if (req.query.result) filter.result = req.query.result;
  if (req.query.inspectionType) filter.inspectionType = req.query.inspectionType;
  const { data, pagination } = await qualityService.getAll(req.query as Record<string, unknown>, filter);
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const createInspection = asyncHandler(async (req: Request, res: Response) => {
  const inspection = await qualityService.create(req.body, req.user!._id);
  res.status(201).json({ success: true, data: inspection, message: 'Inspection recorded' });
});
