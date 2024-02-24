import { NewSound, Sound, SoundFilter } from './sound.schemas';
import { Context, Effect } from 'effect';
import { NotFoundError } from '@shared/error-handling/error-handling.errors';
import { DrizzleError } from '@providers/drizzle/drizzle.errors';
import { StorageError } from '@providers/storage/storage.errors';

export class SoundRepository extends Context.Tag('SoundRepository')<
  SoundRepository,
  {
    readonly create: (sound: NewSound) => Effect.Effect<Sound, DrizzleError | StorageError | NotFoundError>;
    readonly getAll: (filter: SoundFilter) => Effect.Effect<Sound[], DrizzleError | StorageError>;
  }
>() {}
