import { Router } from 'express';
import {
  getOrders, getOrder, createOrder, updateOrder, approveOrder, deleteOrder,
} from '../controllers/orderController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createOrderSchema, updateOrderSchema, approveOrderSchema } from '../validators/order.validator';

const router = Router();

router.use(protect);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', allowRoles('merchandiser'), validate(createOrderSchema), createOrder);
router.put('/:id', allowRoles('merchandiser'), validate(updateOrderSchema), updateOrder);
router.patch('/:id/approve', allowRoles('merchandiser'), validate(approveOrderSchema), approveOrder);
router.delete('/:id', allowRoles('merchandiser'), deleteOrder);

export default router;
