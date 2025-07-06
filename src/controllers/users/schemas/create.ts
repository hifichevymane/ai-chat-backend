import { z } from 'zod';

export const createUserBodySchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
});

export type CreateUserRequestBody = z.infer<typeof createUserBodySchema>;
