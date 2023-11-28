import { NewSound, Sound, SoundFilter } from './sound.schemas';
import { Context, Effect } from 'effect';
import { NotFoundError } from '@shared/error-handling/error-handling.errors';
import { StorageError } from '@app/storage/storage.errors';
import { DatabaseError } from '@app/database/database.errors';

export interface SoundRepository {
  readonly create: (sound: NewSound) => Effect.Effect<never, DatabaseError | StorageError | NotFoundError, Sound>;
  readonly getAll: (filter: SoundFilter) => Effect.Effect<never, DatabaseError | StorageError, Sound[]>;
}

export const SoundRepository = Context.Tag<SoundRepository>('@features/sounds.repository');
