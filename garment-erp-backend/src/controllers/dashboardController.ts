import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardService';
import { asyncHandler } from '../utils/asyncHandler';

export const getDashboardSummary = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getSummary();
  res.json({ success: true, data, message: 'OK' });
});

export const getOrderSummaryReport = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getOrderSummaryReport();
  res.json({ success: true, data, message: 'OK' });
});

export const getProductionEfficiencyReport = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getProductionEfficiencyReport();
  res.json({ success: true, data, message: 'OK' });
});

export const getInventoryAgingReport = asyncHandler(async (req: Request, res: Response) => {
  const result = await dashboardService.getInventoryAgingReport(req.query as Record<string, unknown>);
  res.json({ success: true, ...result, message: 'OK' });
});
