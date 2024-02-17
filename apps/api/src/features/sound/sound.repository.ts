import { NewSound, Sound, SoundFilter } from './sound.schemas';
import { Context, Effect } from 'effect';
import { NotFoundError } from '@shared/error-handling/error-handling.errors';
import { StorageError } from '@app/storage/storage.errors';
import { DatabaseError } from '@app/database/database.errors';

export class SoundRepository extends Context.Tag('SoundRepository')<
  SoundRepository,
  {
    readonly create: (sound: NewSound) => Effect.Effect<Sound, DatabaseError | StorageError | NotFoundError>;
    readonly getAll: (filter: SoundFilter) => Effect.Effect<Sound[], DatabaseError | StorageError>;
  }
>() {}
