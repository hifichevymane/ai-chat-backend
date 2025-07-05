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
    const expSeconds = this.generateExpirationTimeInSeconds(expiresIn);
    const now = Math.floor(Date.now() / 1000);

    const { id, email, firstName, lastName } = payload;
    const token = await new SignJWT({ sub: id, email, firstName, lastName })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(now)
      .setExpirationTime(now + expSeconds)
      .setJti(crypto.randomUUID())
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
      new JwtStrategy(
        opts,
        (jwt_payload: { sub: string; jti: string }, done) => {
          void (async (): Promise<void> => {
            try {
              // Check if the jti is blacklisted
              const authService = new AuthService();
              const isBlacklisted = await authService.isTokenBlacklisted(
                jwt_payload.sub,
                jwt_payload.jti
              );

              if (isBlacklisted) {
                done(null, false);
                return;
              }

              const userService = new UserService();
              const user = await userService.findUserById(jwt_payload.sub);
              if (user) {
                done(null, user);
              } else {
                done(null, false);
              }
            } catch (err) {
              done(err, false);
            }
          })();
        }
      )
    );
  }

  public async blacklistJWT(token: string): Promise<boolean> {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret not set');

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    const userId = typeof payload.sub === 'string' ? payload.sub : undefined;

    if (!userId) return false;

    const { jti, exp } = payload;

    if (!jti || !exp) throw new Error('Token missing jti or exp');

    const isBlacklisted = await this.isTokenBlacklisted(userId, jti);
    if (isBlacklisted) return false;

    const blacklistedToken = await prisma.jwtBlacklist.create({
      data: { userId, jti, expiresAt: new Date(exp * 1000) }
    });

    return !!blacklistedToken;
  }

  private generateExpirationTimeInSeconds(expiresIn: string): number {
    let expSeconds = 24 * 60 * 60; // default 24h
    if (expiresIn.endsWith('h')) {
      expSeconds = parseInt(expiresIn) * 60 * 60;
    } else if (expiresIn.endsWith('m')) {
      expSeconds = parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('s')) {
      expSeconds = parseInt(expiresIn);
    }

    return expSeconds;
  }

  private async isTokenBlacklisted(
    userId: string,
    jti: string
  ): Promise<boolean> {
    const existingBlacklistedToken = await prisma.jwtBlacklist.findFirst({
      where: { userId, jti }
    });
    return !!existingBlacklistedToken;
  }
}
