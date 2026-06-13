import { Router } from 'express';
import { getDispatches, createDispatch, updateDispatch } from '../controllers/dispatchController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createDispatchSchema, updateDispatchSchema } from '../validators/dispatch.validator';

const router = Router();
router.use(protect);

router.get('/', getDispatches);
router.post('/', allowRoles('productionManager', 'merchandiser'), validate(createDispatchSchema), createDispatch);
router.put('/:id', allowRoles('productionManager', 'merchandiser'), validate(updateDispatchSchema), updateDispatch);

export default router;
