import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';

const COOKIE_NAME = 'loomline_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

const setTokenCookie = (res: Response, token: string): void => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.register(req.body);
  setTokenCookie(res, token);
  res.status(201).json({ success: true, data: { user }, message: 'User registered' });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body.email, req.body.password);
  setTokenCookie(res, token);
  res.json({ success: true, data: { user }, message: 'Login successful' });
});

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.json({ success: true, data: null, message: 'Logged out' });
};

export const me = (req: Request, res: Response): void => {
  res.json({ success: true, data: req.user!.toSafeObject(), message: 'OK' });
};
