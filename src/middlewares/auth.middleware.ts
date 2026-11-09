import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Перевіряє Bearer-токен і кладе дані користувача в req.user
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'Токен відсутній або некоректний' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string; role: string };
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    return res.status(401).json({ status: 'error', message: 'Токен недійсний або прострочений' });
  }
};
