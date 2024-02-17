import { Effect, Layer } from 'effect';
import { BusinessError } from '@shared/error-handling/error-handling.errors';
import { SoundErrorCode } from './sound.errors';
import { SoundRepository } from './sound.repository';
import { SoundService } from './sound.service';

export const SoundServiceLive = Layer.effect(
  SoundService,
  Effect.map(SoundRepository, (soundRepository) => ({
    create: (sound) => {
      return soundRepository.getAll({ name: sound.name, author: sound.author }).pipe(
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
    },
    getAll: (filter) => soundRepository.getAll(filter),
  })),
);
