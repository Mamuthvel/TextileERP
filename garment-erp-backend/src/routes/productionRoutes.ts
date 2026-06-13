import { Router } from 'express';
import {
  getProductionOrders, createProductionOrder, updateProductionOrder,
  addDailyProduction, advanceStage,
} from '../controllers/productionController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import {
  createProductionOrderSchema, addDailyProductionSchema, advanceStageSchema,
} from '../validators/production.validator';

const router = Router();
router.use(protect);

router.get('/', getProductionOrders);
router.post('/', allowRoles('productionManager'), validate(createProductionOrderSchema), createProductionOrder);
router.put('/:id', allowRoles('productionManager'), updateProductionOrder);
router.post('/:id/daily', allowRoles('productionManager'), validate(addDailyProductionSchema), addDailyProduction);
router.post('/:id/advance', allowRoles('productionManager'), validate(advanceStageSchema), advanceStage);

export default router;
