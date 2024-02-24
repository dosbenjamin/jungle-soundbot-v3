import type { DrizzleProvider } from '@providers/drizzle/drizzle.provider';
import type { Layer } from 'effect';

declare module 'hono' {
  interface ContextVariableMap {
    DrizzleProviderLive: Layer.Layer<DrizzleProvider>;
  }
}
