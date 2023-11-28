import { DatabaseError } from '@app/database/database.errors';
import { StorageError } from '@app/storage/storage.errors';
import { BusinessError, NotFoundError } from '@shared/error-handling/error-handling.errors';
import { SoundErrorCode } from './sound.errors';
import { NewSound, Sound, SoundFilter } from './sound.schemas';
import { Context, Effect } from 'effect';

export interface SoundService {
  readonly create: (
    sound: NewSound,
  ) => Effect.Effect<never, StorageError | DatabaseError | NotFoundError | BusinessError<SoundErrorCode>, Sound>;
  readonly getAll: (filter: SoundFilter) => Effect.Effect<never, DatabaseError | StorageError, Sound[]>;
}

export const SoundService = Context.Tag<SoundService>('@features/sounds.service');
