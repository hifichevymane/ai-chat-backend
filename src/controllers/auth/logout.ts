import type { Request, Response } from 'express';
import { AuthService } from '../../services';
import { HttpError } from '../http-error';

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  const refreshToken = (req.signedCookies as Record<string, string | undefined>)
    .refreshToken;

  if (!token || !refreshToken) {
    throw new HttpError(401, 'Unauthorized');
  }

  const authService = new AuthService();
  await authService.blacklistJWT(token);
  await authService.blacklistJWT(refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(204).end();
};
