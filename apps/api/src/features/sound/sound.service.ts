import { DatabaseError } from '@app/database/database.errors';
import { StorageError } from '@app/storage/storage.errors';
import { BusinessError, NotFoundError } from '@shared/error-handling/error-handling.errors';
import { SoundErrorCode } from './sound.errors';
import { NewSound, Sound, SoundFilter } from './sound.schemas';
import { Context, Effect } from 'effect';

export class SoundService extends Context.Tag('SoundService')<
  SoundService,
  {
    readonly create: (
      sound: NewSound,
    ) => Effect.Effect<Sound, StorageError | DatabaseError | NotFoundError | BusinessError<SoundErrorCode>>;
    readonly getAll: (filter: SoundFilter) => Effect.Effect<Sound[], DatabaseError | StorageError>;
  }
>() {}
