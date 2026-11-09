import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { validateBody, validateQuery } from '../middlewares/validate.middleware';
import { authGuard } from '../middlewares/auth.middleware';
import { roleGuard } from '../middlewares/role.middleware';
import { CreateCourseSchema } from '../dto/course.dto';
import { PaginationQuerySchema } from '../dto/pagination.dto';

const router = Router();

// публічні ендпоінти
router.get('/', validateQuery(PaginationQuerySchema), CourseController.getAll);
router.get('/:id', CourseController.getById);

// лише для ADMIN
router.post('/', authGuard, roleGuard(['ADMIN']), validateBody(CreateCourseSchema), CourseController.create);
router.delete('/:id', authGuard, roleGuard(['ADMIN']), CourseController.remove);

export default router;
