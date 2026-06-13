import { Router } from 'express';
import {
  getInventory, createItem, updateItem, getTransactions, createTransaction,
} from '../controllers/inventoryController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createItemSchema, updateItemSchema, createTransactionSchema } from '../validators/inventory.validator';

const router = Router();
router.use(protect);

router.get('/', getInventory);
router.post('/', allowRoles('accounts'), validate(createItemSchema), createItem);
router.put('/:id', allowRoles('accounts'), validate(updateItemSchema), updateItem);
router.get('/transactions/all', getTransactions);
router.get('/:id/transactions', getTransactions);
router.post('/transactions', validate(createTransactionSchema), createTransaction);

export default router;
