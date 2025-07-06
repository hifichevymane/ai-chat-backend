import type { Request, Response } from 'express';
import { AuthService } from '../../services';
import { HttpError } from '../http-error';
import type { LoginRequestBody } from './schemas';

export const login = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const authService = new AuthService();
    const user = await authService.login(email, password);

    const { id, firstName, lastName } = user;
    const token = await authService.generateJWT({
      id,
      email,
      firstName,
      lastName
    });

    res.status(200).json({ token });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Invalid email or password') {
      throw new HttpError(401, err.message);
    }
    throw err;
  }
};
