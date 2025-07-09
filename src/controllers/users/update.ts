import type { Request, Response } from 'express';
import { UserService } from '../../services';
import { HttpError } from '../http-error';

import type { UpdateUserBodySchema, UpdateUserParamsSchema } from './schemas';

export const update = async (
  req: Request<UpdateUserParamsSchema, unknown, UpdateUserBodySchema>,
  res: Response
): Promise<void> => {
  const { user: currentUser } = req;
  if (!currentUser) {
    throw new HttpError(401, 'Unauthorized');
  }

  const { id } = req.params;
  if (currentUser.id !== id) {
    throw new HttpError(403, 'Forbidden');
  }

  const userService = new UserService();
  const user = await userService.updateUser(id, req.body);

  res.json(user);
};
