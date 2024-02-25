import { Env } from '@shared/env/env.types';
import { Context } from 'effect';

export class EnvironmentProvider extends Context.Tag('EnvironmentProvider')<
  EnvironmentProvider,
  {
    readonly env: Env['Bindings'];
  }
>() {}
