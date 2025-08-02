import type { Request, Response } from 'express';
import { AuthService } from '../../services';
import { HttpError } from '../http-error';
import type { LoginRequestBody } from './schemas';
import {
  getRefreshTokenCookie,
  setRefreshTokenCookie,
  getAccessToken
} from '../../utils';

export const login = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    // @ts-expect-error - TODO: fix this
    const token = getAccessToken(req);
    // @ts-expect-error - TODO: fix this
    const existingRefreshToken = getRefreshTokenCookie(req);

    if (token || existingRefreshToken) {
      throw new HttpError(403, 'Already logged in');
    }

    const authService = new AuthService();

    const { email, password } = req.body;
    const user = await authService.login(email, password);

    const accessToken = await authService.generateJWT(user);
    const { token: refreshToken, tokenExpirationTimeInMs } =
      await authService.generateRefreshJWT(user);

    setRefreshTokenCookie(res, refreshToken, tokenExpirationTimeInMs);
    res.status(200).json({ accessToken });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Invalid email or password') {
      throw new HttpError(401, err.message);
    }
    throw err;
  }
};
