import type { DrizzleProvider } from '@providers/drizzle/drizzle.provider';
import type { EnvironmentProvider } from '@providers/environment/environment.provider';
import type { Layer } from 'effect';

declare module 'hono' {
  interface ContextVariableMap {
    DrizzleProviderLive: Layer.Layer<DrizzleProvider>;
    EnvironmentProviderLive: Layer.Layer<EnvironmentProvider>;
  }
}
