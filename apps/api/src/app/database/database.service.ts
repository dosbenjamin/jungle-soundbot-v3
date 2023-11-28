import { DatabaseError, DatabaseErrorCode } from '@app/database/database.errors';
import { env } from '@env';
import { soundTable } from '@features/sound/sound.model';
import { DrizzleError } from 'drizzle-orm';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const queryClient = postgres(env.DATABASE_URL);

export const database = drizzle(queryClient, {
  schema: {
    sounds: soundTable,
  },
});

export const invokeDatabaseError = (error: unknown) => {
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
