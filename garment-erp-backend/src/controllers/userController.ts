import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { asyncHandler } from '../utils/asyncHandler';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { data, pagination } = await userService.getAll(req.query as Record<string, unknown>);
  res.json({ success: true, data: data.map((u) => u.toSafeObject()), pagination, message: 'OK' });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  res.status(201).json({ success: true, data: user, message: 'User created' });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.update(req.params.id, req.body);
  res.json({ success: true, data: user, message: 'User updated' });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.remove(req.params.id);
  res.json({ success: true, data: null, message: 'User deleted' });
});
