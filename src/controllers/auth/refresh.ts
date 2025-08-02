import type { Request, Response } from 'express';
import { HttpError } from '../http-error';
import { AuthService } from '../../services';

export const refresh = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const authService = new AuthService();
  const accessToken = await authService.generateJWT(req.user);

  res.json({ accessToken });
};
