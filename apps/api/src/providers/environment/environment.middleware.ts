import { Effect, Layer } from 'effect';
import type { MiddlewareHandler } from 'hono';
import type { Env } from '@shared/env/env.types';
import { EnvironmentProvider } from '@providers/environment/environment.provider';

export const injectEnvironmentProvider: () => MiddlewareHandler<Env> = () => {
  return async (context, next) => {
    context.set(
      'EnvironmentProviderLive',
      Layer.sync(EnvironmentProvider, () => ({
        getEnvironment: () => Effect.sync(() => context.env),
      })),
    );

    await next();
  };
};
