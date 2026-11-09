import { Request, Response } from 'express';
import { CourseService } from '../services/course.service';
import { asyncHandler } from '../utils/asyncHandler';

const courseService = new CourseService();

export class CourseController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const data = await courseService.getPage(page, limit);
    res.status(200).json({ status: 'success', data });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const item = await courseService.getById(Number(req.params.id));
    res.status(200).json({ status: 'success', data: item });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const item = await courseService.create(req.body, req.user!.id);
    res.status(201).json({ status: 'success', data: item });
  });

  static remove = asyncHandler(async (req: Request, res: Response) => {
    await courseService.remove(Number(req.params.id));
    res.status(200).json({ status: 'success', message: 'Курс видалено' });
  });
}
