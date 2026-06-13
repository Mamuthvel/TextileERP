import { Request, Response } from 'express';
import { styleService } from '../services/styleService';
import { asyncHandler } from '../utils/asyncHandler';

export const getStyles = asyncHandler(async (req: Request, res: Response) => {
  const { data, pagination } = await styleService.getAll(req.query as Record<string, unknown>, req.query.orderId as string);
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const createStyle = asyncHandler(async (req: Request, res: Response) => {
  const style = await styleService.create(req.body);
  res.status(201).json({ success: true, data: style, message: 'Style created' });
});

export const updateStyle = asyncHandler(async (req: Request, res: Response) => {
  const style = await styleService.update(req.params.id, req.body);
  res.json({ success: true, data: style, message: 'Style updated' });
});

export const getBOM = asyncHandler(async (req: Request, res: Response) => {
  const bom = await styleService.getBOM(req.params.styleId);
  res.json({ success: true, data: bom, message: 'OK' });
});

export const saveBOM = asyncHandler(async (req: Request, res: Response) => {
  const bom = await styleService.saveBOM(req.params.styleId, req.body);
  res.status(201).json({ success: true, data: bom, message: 'BOM saved' });
});
