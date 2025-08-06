import { z } from 'zod';

export const showParamsSchema = z.object({
  id: z.uuid({ error: 'Invalid message id format' })
});

export type ShowRequestParams = z.infer<typeof showParamsSchema>;
