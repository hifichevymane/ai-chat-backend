import bcrypt from 'bcryptjs';
import type { User } from '../database/prisma/src/generated/prisma';
import { prisma } from '../database';

interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class AuthService {
  public async createUser(user: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword
      }
    });

    return newUser;
  }

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
}
