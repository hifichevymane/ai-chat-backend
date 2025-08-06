import { z } from 'zod';

export const signUpBodySchema = z
  .object({
    email: z.email({ message: 'Invalid email address' }),
    firstName: z
      .string('First name is required')
      .min(1, { error: 'First name should be at least 1 character long' }),
    lastName: z
      .string('Last name is required')
      .min(1, { error: 'Last name should be at least 1 character long' }),
    password: z
      .string('Password is required')
      .min(8, { error: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string('Confirm password is required')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export type SignUpRequestBody = z.infer<typeof signUpBodySchema>;
