import { drizzle } from 'drizzle-orm/d1';
import { DrizzleProvider } from './drizzle.provider';
import { drizzleConfig } from './drizzle.config';
import { Effect, Layer } from 'effect';
import { MiddlewareHandler } from 'hono';
import { DrizzleError as DrizzleLibraryError } from 'drizzle-orm';
import { DrizzleError, DrizzleErrorCode } from './drizzle.errors';
import type { Env } from '@shared/env/env.types';

export const injectDrizzleProvider: () => MiddlewareHandler<Env> = () => {
  return async (context, next) => {
    context.set(
      'DrizzleProviderLive',
      Layer.sync(DrizzleProvider, () => ({
        getDatabase: () => Effect.sync(() => drizzle(context.env.database, drizzleConfig)),
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
