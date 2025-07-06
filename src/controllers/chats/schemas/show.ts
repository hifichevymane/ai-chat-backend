import { z } from 'zod';

export const showParamsSchema = z.object({
  id: z.string().uuid()
});

export type ShowRequestParams = z.infer<typeof showParamsSchema>;
