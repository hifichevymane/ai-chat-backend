import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { jwtVerify, SignJWT } from 'jose';

import { prisma } from '../database';
import { UserService } from './user';

import type { StrategyOptions } from 'passport-jwt';
import type { User } from '../types';

type UserDTO = Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;

export class AuthService {
  public async login(email: string, password: string): Promise<User> {
    const error = new Error('Invalid email or password');

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw error;
    }

    return user;
  }

  public async generateJWT(payload: UserDTO): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret not set');
    const secretKey = new TextEncoder().encode(secret);

    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    // jose expects seconds for expiration
    let expSeconds = 24 * 60 * 60; // default 24h
    if (expiresIn.endsWith('h')) {
      expSeconds = parseInt(expiresIn) * 60 * 60;
    } else if (expiresIn.endsWith('m')) {
      expSeconds = parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('s')) {
      expSeconds = parseInt(expiresIn);
    }
    const now = Math.floor(Date.now() / 1000);

    const { id, email, firstName, lastName } = payload;
    const token = await new SignJWT({ sub: id, email, firstName, lastName })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(now)
      .setExpirationTime(now + expSeconds)
      .sign(secretKey);

    return token;
  }

  public async verifyJWT(token: string): Promise<boolean> {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret not set');

    const secretKey = new TextEncoder().encode(secret);
    try {
      const { payload } = await jwtVerify(token, secretKey);
      const userId = typeof payload.sub === 'string' ? payload.sub : undefined;
      if (!userId) return false;
      const user = await prisma.user.findFirst({ where: { id: userId } });
      return !!user;
    } catch {
      return false;
    }
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
