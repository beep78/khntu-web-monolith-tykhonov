import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err.message || 'Внутрішня помилка сервера'

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  })
}
