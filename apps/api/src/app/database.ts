import { soundModel } from '@features/sounds/sounds.model';
import { env } from '@env';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const queryClient = postgres(env.DATABASE_URL);
export const database = drizzle(queryClient, {
  schema: {
    sounds: soundModel,
  },
});

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' }).catch(() => {
  console.error('Migration failed');
});
