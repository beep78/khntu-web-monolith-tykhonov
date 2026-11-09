import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

const authService = new AuthService();

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    res.status(201).json({ status: 'success', data: user });
  });

  // токен лежить і в корені відповіді, і в data
  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json({ status: 'success', token: result.token, data: result });
  });

  static me = (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: req.user });
  };
}
