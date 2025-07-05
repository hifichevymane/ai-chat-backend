import bcrypt from 'bcryptjs';

import type { Secret, SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import type { StrategyOptions } from 'passport-jwt';

import type { User } from '../database/prisma/src/generated/prisma';
import { prisma } from '../database';

import { UserService } from './user';

export class AuthService {
  public async login(email: string, password: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  }

  public generateToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET as Secret;
    if (!secret) throw new Error('JWT secret not set');

    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const payload = { sub: userId, email };
    const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);
    return token;
  }

  public async verifyJWT(token: string): Promise<boolean> {
    const secret = process.env.JWT_SECRET as Secret;
    if (!secret) throw new Error('JWT secret not set');

    const decoded = jwt.verify(token, secret) as { sub: string; email: string };
    const user = await prisma.user.findFirst({ where: { id: decoded.sub } });
    return !!user;
  }

  public static useJWTStrategy(): void {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    };

    passport.use(
      new JwtStrategy(opts, (jwt_payload: { sub: string }, done) => {
        const userService = new UserService();
        userService
          .findUserById(jwt_payload.sub)
          .then((user) => {
            if (user) {
              done(null, user);
            } else {
              done(null, false);
            }
          })
          .catch((err: unknown) => {
            done(err, false);
          });
      })
    );
  }
}
