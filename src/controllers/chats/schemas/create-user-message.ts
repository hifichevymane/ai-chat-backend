import { z } from 'zod';

export const createUserMessageParamsSchema = z.object({
  id: z.uuid({ error: 'Invalid message id format' })
});

export const createUserMessageBodySchema = z.object({
  message: z
    .string('Message is required')
    .min(1, { error: 'Message must be at least 1 character' })
    .max(1000, { error: 'Message must be less than 1000 characters' })
});

export type CreateUserMessageRequestParams = z.infer<
  typeof createUserMessageParamsSchema
>;

export type CreateUserMessageRequestBody = z.infer<
  typeof createUserMessageBodySchema
>;
