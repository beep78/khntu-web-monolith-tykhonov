import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/course.service';

const courseService = new CourseService();

export class CourseController {
  static getAll(req: Request, res: Response) {
    const items = courseService.getAll();
    res.status(200).json({ status: 'success', data: items });
  }

  static getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const item = courseService.getById(id);
      res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      next(error);
    }
  }
}
