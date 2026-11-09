import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { authGuard } from '../middlewares/auth.middleware';
import { roleGuard } from '../middlewares/role.middleware';
import { CreateOrderSchema, UpdateOrderStatusSchema } from '../dto/order.dto';

const router = Router();

router.use(authGuard);
router.post('/', validateBody(CreateOrderSchema), OrderController.create);
router.get('/:id', OrderController.getById);
router.patch('/:id/status', roleGuard(['MANAGER', 'ADMIN']), validateBody(UpdateOrderStatusSchema), OrderController.changeStatus);

export default router;
