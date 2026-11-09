import { Request, Response, NextFunction } from 'express';

// RBAC: пропускає лише користувачів із дозволеними ролями
export const roleGuard = (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user || !allowedRoles.includes(user.role)) {
    return res.status(403).json({ status: 'error', message: 'Недостатньо прав для виконання цієї операції' });
  }
  next();
};
