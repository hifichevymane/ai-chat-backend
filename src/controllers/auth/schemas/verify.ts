import { z } from 'zod';

export const verifyBodySchema = z.object({
  token: z.string()
});

export type VerifyRequestBody = z.infer<typeof verifyBodySchema>;
