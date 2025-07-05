import type { Request, Response } from 'express';
import { AuthService } from '../../services';
import { HttpError } from '../http-error';

interface LoginRequestBody {
  email: string;
  password: string;
}

export const login = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const authService = new AuthService();
    const user = await authService.login(email, password);
    const token = authService.generateJWT(user.id, user.email);
    res.status(200).json({ token });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Invalid email or password') {
      throw new HttpError(401, err.message);
    }
    throw err;
  }
};
