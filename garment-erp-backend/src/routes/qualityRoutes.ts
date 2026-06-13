import { Router } from 'express';
import { getInspections, createInspection } from '../controllers/qualityController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createInspectionSchema } from '../validators/quality.validator';

const router = Router();
router.use(protect);

router.get('/', getInspections);
router.post('/', allowRoles('productionManager', 'qcInspector'), validate(createInspectionSchema), createInspection);

export default router;
