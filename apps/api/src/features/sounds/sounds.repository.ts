import type { NewSound, Sound, SoundFilter } from './sounds.schemas';
import { Context, type Effect } from 'effect';
import type { NotFoundError } from '@shared/error-handling/error-handling.errors';
import type { DrizzleError } from '@providers/drizzle/drizzle.errors';
import type { StorageError } from '@providers/storage/storage.errors';

export class SoundRepository extends Context.Tag('SoundRepository')<
  SoundRepository,
  {
    readonly create: (sound: NewSound) => Effect.Effect<Sound, DrizzleError | StorageError | NotFoundError>;
    readonly getAll: (filter: SoundFilter) => Effect.Effect<Sound[], DrizzleError | StorageError>;
  }
>() {}
