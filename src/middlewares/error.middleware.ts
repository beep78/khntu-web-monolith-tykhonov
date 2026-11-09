import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err instanceof AppError ? err.statusCode : 500;
  const code = (err as { code?: string }).code;
  if (code === 'P2002') statusCode = 409; // порушено унікальність
  if (code === 'P2025') statusCode = 404; // запис не знайдено

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: statusCode === 500 ? 'Помилка сервера' : err.message,
  });
};
