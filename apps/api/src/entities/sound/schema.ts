import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const soundsTable = pgTable('sounds', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  author: text('author').notNull(),
  url: text('url').notNull(),
});

export type Sound = typeof soundsTable.$inferSelect;
export type NewSound = typeof soundsTable.$inferInsert;

export const selectSoundSchema = createSelectSchema(soundsTable);
export const insertSoundSchema = createInsertSchema(soundsTable, {
  url: ({ url }) => url.url().trim(),
  name: ({ name }) => name.min(1).trim(),
  author: ({ author }) => author.min(1).trim(),
});
