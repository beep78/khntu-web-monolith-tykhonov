import { Router } from 'express'
import { CourseController } from '../controllers/course.controller'

const router = Router()
router.get('/', CourseController.getAll)
router.get('/:id', CourseController.getById)

export default router
