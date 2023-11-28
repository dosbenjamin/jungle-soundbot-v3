import { StorageService } from '@app/storage/storage.service';
import { database, invokeDatabaseError } from '@app/database/database.service';
import { SoundRepository } from '@features/sound/sound.repository';
import { Effect, Layer } from 'effect';
import { StorageServiceLive } from '@app/storage/storage.service.live';
import { soundTable } from '@features/sound/sound.model';
import { eq, or } from 'drizzle-orm';
import { NotFoundError } from '@shared/error-handling/error-handling.errors';

const service = Effect.map(StorageService, (storageService) => {
  const create: SoundRepository['create'] = ({ file, ...newSound }) => {
    return storageService.putFile(file).pipe(
      Effect.tryMapPromise({
        try: ({ id }) => {
          return database
            .insert(soundTable)
            .values({ ...newSound, fileId: id })
            .returning()
            .execute();
        },
        catch: (error) => invokeDatabaseError(error),
      }),
      Effect.flatMap(([sound]) => {
        return sound ? Effect.succeed(sound) : Effect.fail(new NotFoundError({ message: 'Sound was not found' }));
      }),
      Effect.flatMap(({ fileId, ...sound }) => {
        return storageService.getSignedFileUrl(fileId).pipe(Effect.map(({ url }) => ({ ...sound, fileUrl: url })));
      }),
    );
  };

  const getAll: SoundRepository['getAll'] = ({ author, name }) => {
    return Effect.tryPromise({
      try: () => {
        return database
          .select()
          .from(soundTable)
          .where(or(name ? eq(soundTable.name, name) : undefined, author ? eq(soundTable.author, author) : undefined))
          .execute();
      },
      catch: (error) => invokeDatabaseError(error),
    }).pipe(
      Effect.flatMap((sounds) => {
        return Effect.all(
          sounds.map(({ fileId, ...sound }) => {
            return storageService.getSignedFileUrl(fileId).pipe(Effect.map(({ url }) => ({ ...sound, fileUrl: url })));
          }),
        );
      }),
    );
  };

  return SoundRepository.of({ create, getAll });
}).pipe(Effect.provide(StorageServiceLive));

export const SoundRepositoryLive = Layer.effect(SoundRepository, service);
