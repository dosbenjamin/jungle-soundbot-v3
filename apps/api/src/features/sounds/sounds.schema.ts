import { FileSchema } from '@shared/files/files.schema';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const soundsTable = pgTable('sounds', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  author: text('author').notNull(),
  url: text('url').notNull(),
});

export const SoundQuerySchema = createSelectSchema(soundsTable);
export const SoundMutationSchema = createInsertSchema(soundsTable, {
  name: ({ name }) => name.min(1).trim(),
  author: ({ author }) => author.min(1).trim(),
})
  .omit({ id: true, url: true })
  .extend({ file: FileSchema });

export type Sound = z.infer<typeof SoundQuerySchema>;
export type NewSound = z.infer<typeof SoundMutationSchema>;
