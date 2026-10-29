import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export class CategoryController {
  static getAll(req: Request, res: Response) {
    const items = categoryService.getAll();
    res.status(200).json({ status: 'success', data: items });
  }

  static getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = categoryService.getById(id);
      res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      next(error);
    }
  }
}
