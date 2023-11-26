import { DatabaseError } from '@app/database/database.errors';
import { StorageError } from '@app/storage/storage.errors';
import { BusinessError, NotFoundError } from '@shared/error-handling/error-handling.errors';
import { SoundsErrorCode } from './sounds.errors';
import { createSound, getSounds } from './sounds.repository';
import { NewSound, Sound } from './sounds.schemas';
import { Effect, pipe } from 'effect';

export const createUniqueSound = (
  sound: NewSound,
): Effect.Effect<never, StorageError | DatabaseError | NotFoundError | BusinessError<SoundsErrorCode>, Sound> => {
  return pipe(
    getSounds({ name: sound.name }),
    Effect.flatMap(([sound]) => {
      return sound
        ? Effect.fail(
            new BusinessError({
              errorCode: SoundsErrorCode.NameAlreadyUsed,
              message: 'This sound name is already used',
            }),
          )
        : Effect.succeedNone;
    }),
    Effect.flatMap(() => createSound(sound)),
  );
};
