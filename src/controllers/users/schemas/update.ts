import { z } from 'zod';

export const updateUserBodySchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional()
});

export const updateUserParamsSchema = z.object({
  id: z.string().uuid()
});

export type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;
export type UpdateUserParamsSchema = z.infer<typeof updateUserParamsSchema>;
