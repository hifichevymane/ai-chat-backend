import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

import { prisma } from '../database';
import { UserService } from './user';

import type { StrategyOptions } from 'passport-jwt';
import type { User } from '../types';

type UserDTO = Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

if (!process.env.JWT_EXPIRES_IN) {
  throw new Error('JWT_EXPIRES_IN is not set');
}

if (!process.env.JWT_REFRESH_EXPIRES_IN) {
  throw new Error('JWT_REFRESH_EXPIRES_IN is not set');
}

if (!process.env.JWT_ISSUER) {
  throw new Error('JWT_ISSUER is not set');
}

if (!process.env.JWT_AUDIENCE) {
  throw new Error('JWT_AUDIENCE is not set');
}

const ENCODED_JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

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
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const { id, email, firstName, lastName } = payload;
    const token = await new SignJWT({ email, firstName, lastName })
      .setSubject(id)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(process.env.JWT_ISSUER)
      .setAudience(process.env.JWT_AUDIENCE)
      .setIssuedAt()
      .setNotBefore(new Date())
      .setExpirationTime(expiresIn)
      .setJti(crypto.randomUUID())
      .sign(ENCODED_JWT_SECRET);

    return token;
  }

  public async generateRefreshJWT(payload: UserDTO): Promise<{
    token: string;
    tokenExpirationTimeInMs: number;
  }> {
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    const { id, email, firstName, lastName } = payload;
    const token = await new SignJWT({ email, firstName, lastName })
      .setSubject(id)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuer(process.env.JWT_ISSUER)
      .setAudience(process.env.JWT_AUDIENCE)
      .setIssuedAt()
      .setNotBefore(new Date())
      .setExpirationTime(expiresIn)
      .setJti(crypto.randomUUID())
      .sign(ENCODED_JWT_SECRET);

    const tokenExpirationTime = this.generateExpirationTimeInSeconds(expiresIn);
    return {
      token,
      tokenExpirationTimeInMs: tokenExpirationTime * 1000
    };
  }

  public async verifyJWT(token: string): Promise<boolean> {
    try {
      const { payload } = await jwtVerify<UserDTO>(token, ENCODED_JWT_SECRET);
      const userId = typeof payload.sub === 'string' ? payload.sub : undefined;
      if (!userId) return false;
      const user = await prisma.user.findFirst({ where: { id: userId } });
      return !!user;
    } catch {
      return false;
    }
  }

  public async getPayload(token: string): Promise<UserDTO & JWTPayload> {
    const { payload } = await jwtVerify<UserDTO>(token, ENCODED_JWT_SECRET);
    return payload;
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
    const { payload } = await jwtVerify<UserDTO>(token, ENCODED_JWT_SECRET);
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

    if (expiresIn.endsWith('d')) {
      expSeconds = parseInt(expiresIn) * 24 * 60 * 60;
    } else if (expiresIn.endsWith('h')) {
      expSeconds = parseInt(expiresIn) * 60 * 60;
    } else if (expiresIn.endsWith('m')) {
      expSeconds = parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('s')) {
      expSeconds = parseInt(expiresIn);
    }

    return expSeconds;
  }

  public async isTokenBlacklisted(
    userId: string,
    jti: string
  ): Promise<boolean> {
    const existingBlacklistedToken = await prisma.jwtBlacklist.findFirst({
      where: { userId, jti }
    });
    return !!existingBlacklistedToken;
  }
}
