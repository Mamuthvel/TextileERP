import { Router } from 'express';
import {
  getDashboardSummary, getOrderSummaryReport,
  getProductionEfficiencyReport, getInventoryAgingReport,
} from '../controllers/dashboardController';
import { protect } from '../middleware/auth';

const router = Router();
router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/orders-summary', getOrderSummaryReport);
router.get('/production-efficiency', getProductionEfficiencyReport);
router.get('/inventory-aging', getInventoryAgingReport);

export default router;
