import { Request, Response, NextFunction, RequestHandler } from 'express';

// Передає помилки async-контролерів в errorHandler
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
