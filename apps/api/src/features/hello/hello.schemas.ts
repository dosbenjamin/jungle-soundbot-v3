import { z } from 'zod';

export const HelloQuerySchema = z.object({ say: z.string() }).openapi('HelloResponse');

export type Hello = z.infer<typeof HelloQuerySchema>;
