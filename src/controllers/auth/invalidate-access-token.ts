import type { Request, Response } from 'express';
import { AuthService } from '../../services';
import { HttpError } from '../http-error';

export const invalidateAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    throw new HttpError(403, 'Forbidden');
  }

  const authService = new AuthService();
  await authService.blacklistJWT(accessToken);
  res.status(204).send();
};
