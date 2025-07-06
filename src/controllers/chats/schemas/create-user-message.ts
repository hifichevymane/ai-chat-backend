import { z } from 'zod';

export const createUserMessageParamsSchema = z.object({
  id: z.string().uuid()
});

export const createUserMessageBodySchema = z.object({
  message: z
    .string()
    .min(1, { message: 'Message must be at least 1 character' })
    .max(1000, { message: 'Message must be less than 1000 characters' })
});

export type CreateUserMessageRequestParams = z.infer<
  typeof createUserMessageParamsSchema
>;

export type CreateUserMessageRequestBody = z.infer<
  typeof createUserMessageBodySchema
>;
