import type { DrizzleError } from '@providers/drizzle/drizzle.errors';
import type { Drizzle } from '@providers/drizzle/drizzle.types';
import { Context, type Effect } from 'effect';

export class DrizzleProvider extends Context.Tag('DrizzleProvider')<
  DrizzleProvider,
  {
    readonly getDatabase: () => Effect.Effect<Drizzle>;
    readonly invokeError: (error: unknown) => DrizzleError;
  }
>() {}
