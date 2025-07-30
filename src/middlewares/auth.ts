import passport from 'passport';
import type { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpError } from '../controllers/http-error';
import type { User } from '../types';
import { AuthService, UserService } from '../services';

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

export const authenticateJWTCookie: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.cookies as Record<string, string | undefined>)
    .accessToken;
  if (!accessToken) {
    next(new HttpError(401, 'Unauthorized'));
    return;
  }

  try {
    const authService = new AuthService();

    const { sub, jti } = await authService.getPayload(accessToken);
    if (!sub || !jti) {
      next(new HttpError(401, 'Unauthorized'));
      return;
    }

    const isBlacklisted = await authService.isTokenBlacklisted(sub, jti);
    if (isBlacklisted) {
      next(new HttpError(401, 'Unauthorized'));
      return;
    }

    const userService = new UserService();
    const user = await userService.findUserById(sub);
    if (!user) {
      next(new HttpError(401, 'Unauthorized'));
      return;
    }

    req.user = user;
    next();
  } catch {
    next(new HttpError(401, 'Unauthorized'));
  }
};
