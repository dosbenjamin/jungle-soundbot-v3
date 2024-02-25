import { drizzleConfig } from '@providers/drizzle/drizzle.config';
import { DrizzleD1Database } from 'drizzle-orm/d1';

export type Drizzle = DrizzleD1Database<typeof drizzleConfig>;
