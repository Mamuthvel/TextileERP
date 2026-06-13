import { Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { asyncHandler } from '../utils/asyncHandler';

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, type, search } = req.query as Record<string, string>;
  const { data, pagination } = await orderService.getAll(req.query as Record<string, unknown>, { status, type, search });
  res.json({ success: true, data, pagination, message: 'OK' });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getById(req.params.id);
  res.json({ success: true, data: order, message: 'OK' });
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.create(req.body, req.user!._id);
  res.status(201).json({ success: true, data: order, message: 'Order created' });
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.update(req.params.id, req.body);
  res.json({ success: true, data: order, message: 'Order updated' });
});

export const approveOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.approve(req.params.id, req.user!._id, req.body.note);
  res.json({ success: true, data: order, message: `Order moved to ${order.status}` });
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  await orderService.remove(req.params.id);
  res.json({ success: true, data: null, message: 'Order deleted' });
});
