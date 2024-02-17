import type { SoundCollectionResponse } from '@features/sounds/sounds.types';
import type { ApiProviderError } from '@providers/api/api.errors';
import { Context, type Effect } from 'effect';

export class SoundsService extends Context.Tag('SoundsService')<
  SoundsService,
  {
    readonly getAll: () => Effect.Effect<SoundCollectionResponse, ApiProviderError>;
  }
>() {}
