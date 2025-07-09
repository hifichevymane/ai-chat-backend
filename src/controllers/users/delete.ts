import type { Request, Response } from 'express';
import { UserService } from '../../services';
import { HttpError } from '../http-error';

import type { DeleteUserParamsSchema } from './schemas';

export const deleteUser = async (
  req: Request<DeleteUserParamsSchema>,
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
  const user = await userService.findUserById(id);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  await userService.deleteUser(id);

  res.status(204).send();
};
