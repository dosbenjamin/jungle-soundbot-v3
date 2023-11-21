import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const sound = pgTable('sounds', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  author: text('author').notNull(),
  mimeType: text('mime_type').notNull(),
  fileId: uuid('file_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});
