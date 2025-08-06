import { z } from 'zod';

export const deleteUserParamsSchema = z.object({
  id: z.uuid({ error: 'Invalid user id' })
});

export type DeleteUserParamsSchema = z.infer<typeof deleteUserParamsSchema>;
