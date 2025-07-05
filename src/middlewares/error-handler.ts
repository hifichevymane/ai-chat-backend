import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../controllers/http-error';

export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
