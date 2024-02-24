import { BusinessError, NotFoundError } from '@shared/error-handling/error-handling.errors';
import { SoundErrorCode } from './sound.errors';
import { NewSound, Sound, SoundFilter } from './sound.schemas';
import { Context, Effect } from 'effect';
import { DrizzleError } from '@providers/drizzle/drizzle.errors';
import { StorageError } from '@providers/storage/storage.errors';

export class SoundService extends Context.Tag('SoundService')<
  SoundService,
  {
    readonly create: (
      sound: NewSound,
    ) => Effect.Effect<Sound, StorageError | DrizzleError | NotFoundError | BusinessError<SoundErrorCode>>;
    readonly getAll: (filter: SoundFilter) => Effect.Effect<Sound[], DrizzleError | StorageError>;
  }
>() {}
