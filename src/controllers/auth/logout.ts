import type { Request, Response } from 'express';
import { AuthService } from '../../services';
import { HttpError } from '../http-error';

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new HttpError(401, 'Unauthorized');
  }

  const authService = new AuthService();
  await authService.blacklistJWT(token);

  res.status(204).end();
};
