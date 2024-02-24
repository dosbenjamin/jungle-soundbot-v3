import { drizzleConfig } from '@providers/drizzle/drizzle.config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type Drizzle = PostgresJsDatabase<typeof drizzleConfig>;
