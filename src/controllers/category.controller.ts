import { Request, Response } from 'express'
import { CategoryService } from '../services/category.service'
import { catchAsync } from '../utils/catchAsync'

const categoryService = new CategoryService()

export class CategoryController {
  static getAll = catchAsync((req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: categoryService.getAll() })
  })

  static getById = catchAsync((req: Request, res: Response) => {
    const item = categoryService.getById(Number(req.params.id))
    res.status(200).json({ status: 'success', data: item })
  })
}
