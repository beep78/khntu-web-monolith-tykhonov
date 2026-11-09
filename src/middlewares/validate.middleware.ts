import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const fail = (res: Response, issues: { path: (string | number)[]; message: string }[]) =>
  res.status(400).json({
    status: 'error',
    message: 'Помилка валідації вхідних даних',
    errors: issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
  });

// Валідація тіла запиту; safeParse не кидає виняток, тож сервер не падає
export const validateBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return fail(res, result.error.issues);
  req.body = result.data; // далі працюємо вже з очищеними даними
  next();
};

// Валідація query-параметрів (page, limit)
export const validateQuery = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.query);
  if (!result.success) return fail(res, result.error.issues);
  req.query = result.data as typeof req.query;
  next();
};
