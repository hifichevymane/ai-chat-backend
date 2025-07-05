import bcrypt from 'bcryptjs';
import { prisma } from '../database';
import type { User } from '../types';

interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface UpdateUserDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export class UserService {
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

  public findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  public findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  public deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id }
    });
  }

  public updateUser(id: string, user: UpdateUserDTO): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: user
    });
  }
}
