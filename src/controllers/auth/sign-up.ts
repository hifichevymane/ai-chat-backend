import type { Request, Response } from 'express';
import { UserService, AuthService } from '../../services';
import type { SignUpRequestBody } from './schemas';
import { HttpError } from '../http-error';

export const signUp = async (
  req: Request<unknown, unknown, SignUpRequestBody>,
  res: Response
): Promise<void> => {
  const existingAccessToken = req.headers.authorization?.split(' ')[1];
  const existingRefreshToken = (
    req.signedCookies as Record<string, string | undefined>
  ).refreshToken;

  if (existingAccessToken || existingRefreshToken) {
    throw new HttpError(403, 'Already logged in');
  }

  const userService = new UserService();
  const { email, firstName, lastName, password } = req.body;
  const user = await userService.createUser({
    email,
    firstName,
    lastName,
    password
  });

  const authService = new AuthService();
  const accessToken = await authService.generateJWT(user);
  const { token: refreshToken, tokenExpirationTimeInMs } =
    await authService.generateRefreshJWT(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: tokenExpirationTimeInMs
  });
  res.status(201).json({ accessToken });
};
