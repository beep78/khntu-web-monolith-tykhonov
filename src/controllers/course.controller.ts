import { Request, Response } from 'express'
import { CourseService } from '../services/course.service'
import { catchAsync } from '../utils/catchAsync'

const courseService = new CourseService()

export class CourseController {
  static getAll = catchAsync((req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: courseService.getAll() })
  })

  static getById = catchAsync((req: Request, res: Response) => {
    const item = courseService.getById(Number(req.params.id))
    res.status(200).json({ status: 'success', data: item })
  })
}
