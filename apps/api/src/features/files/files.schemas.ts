import { z } from 'zod';

export const BufferStringQuerySchema = z.object({
  id: z.string().uuid(),
  bufferString: z.string(),
});
export type BufferString = z.infer<typeof BufferStringQuerySchema>;
