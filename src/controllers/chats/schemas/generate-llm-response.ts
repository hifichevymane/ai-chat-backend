import { z } from 'zod';

export const generateLLMResponseParamsSchema = z.object({
  id: z.uuid({ error: 'Invalid message id format' })
});

export type GenerateLLMResponseRequestParams = z.infer<
  typeof generateLLMResponseParamsSchema
>;
