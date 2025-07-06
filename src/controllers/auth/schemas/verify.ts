import { z } from 'zod';

export const verifyBodySchema = z.object({
  token: z.string().min(1, { message: 'Token is required' })
});

export type VerifyRequestBody = z.infer<typeof verifyBodySchema>;
