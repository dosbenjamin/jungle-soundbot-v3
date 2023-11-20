import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { FileSchema } from '@shared/files/files.schemas';
import { sound } from './sounds.model';

export const SoundQuerySchema = createSelectSchema(sound);
export const SoundMutationSchema = createInsertSchema(sound, {
  name: ({ name }) => name.min(1).trim(),
  author: ({ author }) => author.min(1).trim(),
})
  .omit({ id: true, objectId: true, createdAt: true })
  .extend({ file: FileSchema });

export type Sound = z.infer<typeof SoundQuerySchema>;
export type NewSound = z.infer<typeof SoundMutationSchema>;
