import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'Помилка сервера',
  });
};
