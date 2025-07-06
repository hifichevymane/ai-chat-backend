import { z } from 'zod';

export const generateLLMResponseParamsSchema = z.object({
  id: z.string().uuid()
});

export type GenerateLLMResponseRequestParams = z.infer<
  typeof generateLLMResponseParamsSchema
>;
