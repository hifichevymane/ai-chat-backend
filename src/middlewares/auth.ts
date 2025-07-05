import passport from 'passport';
import type { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpError } from '../controllers/http-error';
import type { User } from '../types';

export const authenticateJWT: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: User | null) => {
      if (err) {
        next(err);
        return;
      }
      if (!user) {
        // Throw your custom HttpError
        next(new HttpError(401, 'Unauthorized'));
        return;
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
