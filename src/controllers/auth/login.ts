import type { Request, Response } from 'express';
import { AuthService } from '../../services';
import { HttpError } from '../http-error';
import type { LoginRequestBody } from './schemas';

export const login = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const existingRefreshToken = (
      req.signedCookies as Record<string, string | undefined>
    ).refreshToken;

    if (token || existingRefreshToken) {
      throw new HttpError(403, 'Already logged in');
    }

    const authService = new AuthService();

    const { email, password } = req.body;
    const user = await authService.login(email, password);

    const accessToken = await authService.generateJWT(user);
    const { token: refreshToken, tokenExpirationTime } =
      await authService.generateRefreshJWT(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokenExpirationTime * 1000
    });

    res.status(200).json({ accessToken });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Invalid email or password') {
      throw new HttpError(401, err.message);
    }
    throw err;
  }
};
