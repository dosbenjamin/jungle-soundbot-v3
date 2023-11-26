import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { FileSchema } from '@shared/files/files.schemas';
import { soundsTable } from './sounds.model';
import { SoundsErrorCode } from './sounds.errors';
import { BadRequestErrorSchema } from '@shared/error-handling/error-handling.schemas';

export const SoundQuerySchema = createSelectSchema(soundsTable)
  .omit({ fileId: true })
  .extend({ fileUrl: z.string().url() })
  .openapi('SoundResponse');

export const SoundCollectionQuerySchema = SoundQuerySchema.array().openapi('SoundCollectionResponse');

export const SoundMutationSchema = createInsertSchema(soundsTable, {
  name: ({ name }) => name.min(1).trim(),
  author: ({ author }) => author.min(1).trim(),
})
  .pick({ name: true, author: true })
  .extend({ file: FileSchema })
  .openapi('SoundRequest', { required: ['name', 'author', 'file'] });

export const SoundFilterSchema = createInsertSchema(soundsTable, {
  name: ({ name }) => name.trim(),
  author: ({ name }) => name.trim(),
})
  .pick({ name: true, author: true })
  .partial()
  .openapi('SoundFilterQueryParams');

export const SoundBadRequestErrorSchema = BadRequestErrorSchema.extend({
  errorCode: z.nativeEnum(SoundsErrorCode),
});

export type Sound = z.infer<typeof SoundQuerySchema>;
export type NewSound = z.infer<typeof SoundMutationSchema>;
export type SoundFilter = z.infer<typeof SoundFilterSchema>;
