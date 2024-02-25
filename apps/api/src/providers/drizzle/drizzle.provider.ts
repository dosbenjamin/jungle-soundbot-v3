import type { DrizzleError } from '@providers/drizzle/drizzle.errors';
import type { Drizzle } from '@providers/drizzle/drizzle.types';
import { Context } from 'effect';

export class DrizzleProvider extends Context.Tag('DrizzleProvider')<
  DrizzleProvider,
  {
    readonly database: Drizzle;
    readonly invokeError: (error: unknown) => DrizzleError;
  }
>() {}
