import { z } from 'zod';

export const signUpBodySchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(1, { message: 'First name should be at least 1 character long' }),
    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(1, { message: 'Last name should be at least 1 character long' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string({
      required_error: 'Confirm password is required'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export type SignUpRequestBody = z.infer<typeof signUpBodySchema>;
