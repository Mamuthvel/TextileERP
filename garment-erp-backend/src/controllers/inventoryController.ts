import { Request, Response } from 'express';
import { inventoryService } from '../services/inventoryService';
import { asyncHandler } from '../utils/asyncHandler';

export const getInventory = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.lowStock === 'true') filter.$expr = { $lte: ['$currentStock', '$minStockLevel'] };
  const { data, pagination } = await inventoryService.getAll(req.query as Record<string, unknown>, filter);
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await inventoryService.create(req.body);
  res.status(201).json({ success: true, data: item, message: 'Item created' });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await inventoryService.update(req.params.id, req.body);
  res.json({ success: true, data: item, message: 'Item updated' });
});

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const { data, pagination } = await inventoryService.getTransactions(
    req.query as Record<string, unknown>,
    req.params.id
  );
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const result = await inventoryService.createTransaction(req.body, req.user!._id);
  res.status(201).json({ success: true, data: result, message: 'Transaction recorded' });
});
