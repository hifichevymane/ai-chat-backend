import { PrismaClient } from '../../prisma/src/generated/prisma';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

import type { User } from '../types';

type UserDTO = Pick<User, 'email' | 'firstName' | 'lastName' | 'password'>;

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const users: UserDTO[] = [];

  const adminPassword = await bcrypt.hash('12345678', 10);
  users.push({
    email: 'admin@admin.com',
    firstName: 'Admin',
    lastName: 'Admin',
    password: adminPassword
  });

  for (let i = 0; i < 9; i++) {
    const password = await bcrypt.hash(
      faker.internet.password({ length: 12 }),
      10
    );
    users.push({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true // In case of duplicate emails
  });

  console.log(
    'Seeded users:',
    users.map((u) => u.email)
  );
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void (async (): Promise<void> => {
      await prisma.$disconnect();
    })();
  });
