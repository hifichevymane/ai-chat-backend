import bcrypt from 'bcryptjs';
import type { User } from '../database/prisma/src/generated/prisma';
import { prisma } from '../database';
import type { Secret, SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

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
}
