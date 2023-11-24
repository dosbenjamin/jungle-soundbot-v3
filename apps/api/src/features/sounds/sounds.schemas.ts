import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { FileSchema } from '@shared/files/files.schemas';
import { soundModel } from './sounds.model';

export const SoundQuerySchema = createSelectSchema(soundModel)
  .omit({ fileId: true })
  .extend({ fileUrl: z.string().url() });

export const SoundMutationSchema = createInsertSchema(soundModel, {
  name: ({ name }) => name.min(1).trim(),
  author: ({ author }) => author.min(1).trim(),
})
  .omit({ id: true, fileId: true, createdAt: true })
  .extend({ file: FileSchema });

export const SoundFilterSchema = createSelectSchema(soundModel, {
  name: ({ name }) => name.trim(),
  author: ({ name }) => name.trim(),
})
  .pick({ name: true, author: true })
  .partial();

export type Sound = z.infer<typeof SoundQuerySchema>;
export type NewSound = z.infer<typeof SoundMutationSchema>;
export type SoundFilter = z.infer<typeof SoundFilterSchema>;
