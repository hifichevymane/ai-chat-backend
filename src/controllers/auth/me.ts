import type { Request, Response } from 'express';
import { HttpError } from '../http-error';

export const me = (req: Request, res: Response): void => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  res.json(req.user);
};
