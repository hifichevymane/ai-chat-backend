import { z } from 'zod';

export const deleteUserParamsSchema = z.object({
  id: z.string().uuid()
});

export type DeleteUserParamsSchema = z.infer<typeof deleteUserParamsSchema>;
