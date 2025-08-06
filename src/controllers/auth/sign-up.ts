import type { Request, Response } from 'express';
import { UserService, AuthService } from '../../services';
import type { SignUpRequestBody } from './schemas';
import { HttpError } from '../http-error';
import {
  getRefreshTokenCookie,
  setRefreshTokenCookie,
  getAccessToken
} from '../../utils';

export const signUp = async (
  req: Request<unknown, unknown, SignUpRequestBody>,
  res: Response
): Promise<void> => {
  // @ts-expect-error - TODO: fix this
  const existingAccessToken = getAccessToken(req);
  // @ts-expect-error - TODO: fix this
  const existingRefreshToken = getRefreshTokenCookie(req);

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

  setRefreshTokenCookie(res, refreshToken, tokenExpirationTimeInMs);
  res.status(201).json({ accessToken });
};
