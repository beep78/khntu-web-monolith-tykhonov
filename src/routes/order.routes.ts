import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateOrderSchema, UpdateOrderStatusSchema } from '../dto/order.dto';

const router = Router();

router.post('/', validateBody(CreateOrderSchema), OrderController.create);
router.get('/:id', OrderController.getById);
router.patch('/:id/status', validateBody(UpdateOrderStatusSchema), OrderController.changeStatus);

export default router;
