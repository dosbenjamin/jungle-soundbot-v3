import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const soundTable = pgTable('sounds', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  author: text('author').notNull(),
  fileId: uuid('file_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});
