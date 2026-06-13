import { Router } from 'express';
import { getInvoices, createInvoice, updateInvoice } from '../controllers/dispatchController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createInvoiceSchema, updateInvoiceSchema } from '../validators/dispatch.validator';

const router = Router();
router.use(protect);

router.get('/', getInvoices);
router.post('/', allowRoles('accounts'), validate(createInvoiceSchema), createInvoice);
router.put('/:id', allowRoles('accounts'), validate(updateInvoiceSchema), updateInvoice);

export default router;
