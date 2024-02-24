import { drizzle } from 'drizzle-orm/postgres-js';
import { DrizzleProvider } from './drizzle.provider';
import { drizzleConfig } from './drizzle.config';
import { Effect, Layer } from 'effect';
import { MiddlewareHandler } from 'hono';
import postgres from 'postgres';
import { env } from '@env';
import { DrizzleError as DrizzleLibraryError } from 'drizzle-orm';
import { DrizzleError, DrizzleErrorCode } from './drizzle.errors';

export const injectDrizzleProvider: () => MiddlewareHandler = () => {
  const queryClient = postgres(env.DATABASE_URL);
  const database = drizzle(queryClient, drizzleConfig);

  return async (context, next) => {
    context.set(
      'DrizzleProviderLive',
      Layer.sync(DrizzleProvider, () => ({
        getDatabase: () => Effect.sync(() => database),
        invokeError: (error) => {
          if (error instanceof DrizzleLibraryError) {
            return new DrizzleError({
              errorCode: DrizzleErrorCode.DrizzleError,
              message: error.message,
            });
          }

          return new DrizzleError({
            errorCode: DrizzleErrorCode.UnknownError,
            message: 'An error has occurred with the database',
          });
        },
      })),
    );

    await next();
  };
};
