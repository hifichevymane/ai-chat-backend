import { z } from 'zod';

export const showUserParamsSchema = z.object({
  id: z.uuid({ error: 'Invalid user id' })
});

export type ShowUserParamsSchema = z.infer<typeof showUserParamsSchema>;
