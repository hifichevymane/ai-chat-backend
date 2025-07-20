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

type UserWithoutPassword = Omit<User, 'password'>;

export class UserService {
  public async createUser(user: CreateUserDTO): Promise<UserWithoutPassword> {
    const existingUser = await this.findUserByEmail(user.email);
    if (existingUser) {
      throw new Error('Email already taken');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return newUser;
  }

  public findUserByEmail(email: string): Promise<UserWithoutPassword | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  public findUserById(id: string): Promise<UserWithoutPassword | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  public deleteUser(id: string): Promise<UserWithoutPassword> {
    return prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  public updateUser(
    id: string,
    user: UpdateUserDTO
  ): Promise<UserWithoutPassword> {
    return prisma.user.update({
      where: { id },
      data: user,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
}
