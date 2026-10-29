import { Request, Response, NextFunction, RequestHandler } from 'express'

// Обгортка для контролерів: будь-яка помилка (sync/async) передається в errorHandler
export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve()
      .then(() => fn(req, res, next))
      .catch(next)
  }
