import { z } from 'zod';

export const showUserParamsSchema = z.object({
  id: z.string().uuid()
});

export type ShowUserParamsSchema = z.infer<typeof showUserParamsSchema>;
