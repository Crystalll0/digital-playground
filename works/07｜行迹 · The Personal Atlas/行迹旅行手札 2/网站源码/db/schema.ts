import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const atlases = sqliteTable('atlases', { userId: text('user_id').primaryKey(), revision: integer('revision').notNull(), data: text('data').notNull(), updatedAt: text('updated_at').notNull() });
