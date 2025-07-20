import { describe, it, expect, beforeEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';

import prisma from '../__mocks__/database';
vi.mock('../database', () => ({ prisma }));

import bcrypt from 'bcryptjs';
vi.mock('bcryptjs');

import { UserService } from './user';

const userInput = {
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: faker.string.alphanumeric(10)
};

const userOutput = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  createdAt: new Date(),
  updatedAt: new Date()
};

const hashedPassword = faker.string.alphanumeric(10);

let userService: UserService;

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      (vi.spyOn(bcrypt, 'hash') as any).mockResolvedValue(hashedPassword);

      prisma.user.create.mockImplementation((args) => {
        expect(args.select).toEqual({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return userOutput as any;
      });

      const user = await userService.createUser(userInput);
      expect(user).toEqual(userOutput);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userInput,
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
    });

    it('should throw an error if the email is already taken', async () => {
      // Mock findUserByEmail to simulate that the user already exists
      userService.findUserByEmail = vi.fn().mockResolvedValue(userOutput);
      await expect(userService.createUser(userInput)).rejects.toThrowError(
        'Email already taken'
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      prisma.user.findUnique.mockImplementation((args) => {
        expect(args.select).toEqual({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return userOutput as any;
      });

      const user = await userService.findUserByEmail(userInput.email);
      expect(user).toEqual(userOutput);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userInput.email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        }
      });
    });

    it('should return null if the user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const email = faker.internet.email();
      const user = await userService.findUserByEmail(email);
      expect(user).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
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
    });
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      prisma.user.findUnique.mockImplementation((args) => {
        expect(args.select).toEqual({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return userOutput as any;
      });

      const user = await userService.findUserById(userOutput.id);
      expect(user).toEqual(userOutput);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userOutput.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        }
      });
    });

    it('should return null if the user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const id = faker.string.uuid();
      const user = await userService.findUserById(id);
      expect(user).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
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
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      prisma.user.delete.mockImplementation((args) => {
        expect(args.select).toEqual({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return userOutput as any;
      });

      const user = await userService.deleteUser(userOutput.id);
      expect(user).toEqual(userOutput);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: userOutput.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        }
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      prisma.user.update.mockImplementation((args) => {
        expect(args.select).toEqual({
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return userOutput as any;
      });

      const updatedUser = {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName()
      };

      const user = await userService.updateUser(userOutput.id, updatedUser);

      expect(user).toEqual(userOutput);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userOutput.id },
        data: updatedUser,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        }
      });
    });
  });
});
