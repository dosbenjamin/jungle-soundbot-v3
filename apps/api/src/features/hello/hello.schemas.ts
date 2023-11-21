import { z } from 'zod';

export const HelloQuerySchema = z.object({
  say: z.string(),
});
export type Hello = z.infer<typeof HelloQuerySchema>;
