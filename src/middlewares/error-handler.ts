import type { Request, Response } from 'express';
import { HttpError } from '../controllers/http-error';

export const errorHandler = (err: Error, _: Request, res: Response): void => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
