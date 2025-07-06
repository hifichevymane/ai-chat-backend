import type { Request, Response } from 'express';
import { AuthService } from '../../services';
import { HttpError } from '../http-error';
import type { VerifyRequestBody } from './schemas';

export const verify = async (
  req: Request<unknown, unknown, VerifyRequestBody>,
  res: Response
): Promise<void> => {
  const { token } = req.body;

  const authService = new AuthService();
  const valid = await authService.verifyJWT(token);

  if (!valid) {
    throw new HttpError(401, 'Unauthorized');
  }

  res.status(200).json({ valid });
};
