import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { HttpError } from '../controllers/http-error';

export const validateBody = (schema: ZodSchema): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { success, error } = schema.safeParse(req.body);
    if (!success) {
      throw new HttpError(
        400,
        'Invalid request body',
        error.errors.map((e) => e.message)
      );
    }
    next();
  };
};

export const validateParams = (schema: ZodSchema): RequestHandler => {
  return (req: Request, _: Response, next: NextFunction) => {
    const { success, error } = schema.safeParse(req.params);
    if (!success) {
      throw new HttpError(
        400,
        'Invalid request params',
        error.errors.map((e) => e.message)
      );
    }
    next();
  };
};

export const validateQuery = (schema: ZodSchema): RequestHandler => {
  return (req: Request, _: Response, next: NextFunction) => {
    const { success, error } = schema.safeParse(req.query);
    if (!success) {
      throw new HttpError(
        400,
        'Invalid request query',
        error.errors.map((e) => e.message)
      );
    }
    next();
  };
};
