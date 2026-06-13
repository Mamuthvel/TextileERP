import { Router } from 'express';
import { getCostings, createCosting, updateCosting, compareCosting } from '../controllers/costingController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createCostingSchema, updateCostingSchema } from '../validators/costing.validator';

const router = Router();
router.use(protect);

router.get('/', getCostings);
router.post('/', allowRoles('merchandiser', 'accounts'), validate(createCostingSchema), createCosting);
router.put('/:id', allowRoles('merchandiser', 'accounts'), validate(updateCostingSchema), updateCosting);
router.get('/compare/:orderId', compareCosting);

export default router;
