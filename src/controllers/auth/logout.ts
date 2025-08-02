import type { Request, Response } from 'express';
import { AuthService } from '../../services';
import { HttpError } from '../http-error';
import {
  getRefreshTokenCookie,
  clearRefreshTokenCookie,
  getAccessToken
} from '../../utils';

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = getAccessToken(req);
  const refreshToken = getRefreshTokenCookie(req);

  if (!token || !refreshToken) {
    throw new HttpError(401, 'Unauthorized');
  }

  const authService = new AuthService();
  await authService.blacklistJWT(token);
  await authService.blacklistJWT(refreshToken);

  clearRefreshTokenCookie(res);
  res.status(204).end();
};
