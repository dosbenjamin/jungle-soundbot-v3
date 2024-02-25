import { Environment } from '@providers/environment/environment.types';
import { Context, type Effect } from 'effect';

export class EnvironmentProvider extends Context.Tag('EnvironmentProvider')<
  EnvironmentProvider,
  {
    readonly getEnvironment: () => Effect.Effect<Environment>;
  }
>() {}
