import { Effect, Layer } from 'effect';
import { BusinessError } from '@shared/error-handling/error-handling.errors';
import { SoundErrorCode } from './sound.errors';
import { SoundRepository } from './sound.repository';
import { SoundRepositoryLive } from './sound.repository.live';
import { SoundService } from './sound.service';

const service = Effect.map(SoundRepository, (soundRepository) => {
  const create: SoundService['create'] = (sound) => {
    return soundRepository.getAll({ name: sound.name }).pipe(
      Effect.flatMap(([sound]) => {
        return sound
          ? Effect.fail(
              new BusinessError({
                errorCode: SoundErrorCode.NameAlreadyUsed,
                message: 'This sound name is already used',
              }),
            )
          : Effect.succeedNone;
      }),
      Effect.flatMap(() => soundRepository.create(sound)),
    );
  };

  const getAll: SoundService['getAll'] = (filter) => soundRepository.getAll(filter);

  return SoundService.of({ create, getAll });
}).pipe(Effect.provide(SoundRepositoryLive));

export const SoundServiceLive = Layer.effect(SoundService, service);
