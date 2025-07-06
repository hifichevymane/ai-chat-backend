import { z } from 'zod';

export const loginBodySchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
});

export type LoginRequestBody = z.infer<typeof loginBodySchema>;
