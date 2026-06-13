import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { protect } from '../middleware/auth';
import { allowRoles } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();
router.use(protect);

router.get('/', allowRoles('superAdmin'), getUsers);
router.post('/', allowRoles('superAdmin'), validate(createUserSchema), createUser);
router.put('/:id', allowRoles('superAdmin'), validate(updateUserSchema), updateUser);
router.delete('/:id', allowRoles('superAdmin'), deleteUser);

export default router;
