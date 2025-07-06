import type { Request, Response } from 'express';
import { UserService, AuthService } from '../../services';
import type { SignUpRequestBody } from './schemas';

export const signUp = async (
  req: Request<unknown, unknown, SignUpRequestBody>,
  res: Response
): Promise<void> => {
  const userService = new UserService();
  const { email, firstName, lastName, password } = req.body;
  const user = await userService.createUser({
    email,
    firstName,
    lastName,
    password
  });

  const authService = new AuthService();
  const token = await authService.generateJWT({
    id: user.id,
    email,
    firstName,
    lastName
  });

  res.status(201).json({ token });
};
