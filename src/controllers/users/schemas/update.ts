import { z } from 'zod';

export const updateUserBodySchema = z.object({
  firstName: z
    .string('First name is required')
    .min(1, { error: 'First name should be at least 1 character long' })
    .optional(),
  lastName: z
    .string('Last name is required')
    .min(1, { error: 'Last name should be at least 1 character long' })
    .optional()
});

export const updateUserParamsSchema = z.object({
  id: z.uuid({ error: 'Invalid user id' })
});

export type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;
export type UpdateUserParamsSchema = z.infer<typeof updateUserParamsSchema>;
