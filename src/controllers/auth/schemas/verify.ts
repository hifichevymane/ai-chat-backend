import { z } from 'zod';

export const verifyBodySchema = z.object({
  token: z
    .string('Token is required')
    .min(1, { error: 'Token should be at least 1 character long' })
});

export type VerifyRequestBody = z.infer<typeof verifyBodySchema>;
