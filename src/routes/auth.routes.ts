import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { authGuard } from '../middlewares/auth.middleware';
import { RegisterSchema, LoginSchema } from '../dto/auth.dto';

const router = Router();

router.post('/register', validateBody(RegisterSchema), AuthController.register);
router.post('/login', validateBody(LoginSchema), AuthController.login);
router.get('/me', authGuard, AuthController.me);

export default router;
