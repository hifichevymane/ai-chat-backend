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
}
