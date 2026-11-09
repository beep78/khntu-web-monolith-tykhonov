import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { validateBody, validateQuery } from '../middlewares/validate.middleware';
import { CreateCourseSchema } from '../dto/course.dto';
import { PaginationQuerySchema } from '../dto/pagination.dto';

const router = Router();

router.get('/', validateQuery(PaginationQuerySchema), CourseController.getAll);
router.get('/:id', CourseController.getById);
router.post('/', validateBody(CreateCourseSchema), CourseController.create);

export default router;
