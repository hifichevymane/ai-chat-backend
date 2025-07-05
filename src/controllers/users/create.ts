import type { Request, Response } from 'express';
import { UserService } from '../../services';

export const create = async (req: Request, res: Response): Promise<void> => {
  const { email, firstName, lastName, password } = req.body as {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };

  const userService = new UserService();
  const user = await userService.createUser({
    email,
    firstName,
    lastName,
    password
  });

  res.status(201).json(user);
};
