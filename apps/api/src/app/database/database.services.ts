import { env } from '@env';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { DrizzleError } from 'drizzle-orm';
import { DatabaseError, DatabaseErrorCode } from './database.errors';
import { soundsTable } from '@features/sounds/sounds.model';

const queryClient = postgres(env.DATABASE_URL);
export const database = drizzle(queryClient, {
  schema: {
    sounds: soundsTable,
  },
});

export const invokeDatabaseError = (error: unknown): DatabaseError => {
  if (error instanceof DrizzleError) {
    return new DatabaseError({
      errorCode: DatabaseErrorCode.DrizzleError,
      message: error.message,
    });
  }

  return new DatabaseError({
    errorCode: DatabaseErrorCode.UnknownError,
    message: 'An error has occurred with the database',
  });
};

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' }).catch(() => {
  console.error('Migration failed');
});
