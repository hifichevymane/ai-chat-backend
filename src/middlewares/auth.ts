import passport from 'passport';
import type { RequestHandler } from 'express';

export const authenticateJWT = passport.authenticate('jwt', {
  session: false
}) as RequestHandler;
