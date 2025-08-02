import type { Request, Response } from 'express';
import { HttpError } from '../http-error';
import { UserService } from '../../services';

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const userService = new UserService();
  const user = await userService.findUserById(req.user.id);
  if (!user) {
    throw new HttpError(401, 'Unauthorized');
  }

  res.json(user);
};
