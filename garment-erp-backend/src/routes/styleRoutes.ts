import { Router } from 'express';
import { getStyles, createStyle, updateStyle, getBOM, saveBOM } from '../controllers/styleController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createStyleSchema, updateStyleSchema, saveBOMSchema } from '../validators/style.validator';

const router = Router();
router.use(protect);

router.get('/', getStyles);
router.post('/', allowRoles('merchandiser'), validate(createStyleSchema), createStyle);
router.put('/:id', allowRoles('merchandiser'), validate(updateStyleSchema), updateStyle);

router.get('/:styleId/bom', getBOM);
router.post('/:styleId/bom', allowRoles('merchandiser'), validate(saveBOMSchema), saveBOM);

export default router;
