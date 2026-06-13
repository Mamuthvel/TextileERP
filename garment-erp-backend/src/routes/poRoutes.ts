import { Router } from 'express';
import { getPOs, createPO, updatePO } from '../controllers/poController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createPOSchema, updatePOSchema } from '../validators/po.validator';

const router = Router();
router.use(protect);

router.get('/', getPOs);
router.post('/', allowRoles('merchandiser', 'productionManager', 'accounts'), validate(createPOSchema), createPO);
router.put('/:id', allowRoles('merchandiser', 'productionManager', 'accounts'), validate(updatePOSchema), updatePO);

export default router;
