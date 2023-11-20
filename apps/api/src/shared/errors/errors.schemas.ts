import { z } from 'zod';

export const ErrorSchema = z.object({
  code: z.number(),
  error: z.string(),
});
