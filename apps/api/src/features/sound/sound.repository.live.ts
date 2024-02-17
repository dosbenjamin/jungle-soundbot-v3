import { StorageService } from '@app/storage/storage.service';
import { database, invokeDatabaseError } from '@app/database/database.service';
import { SoundRepository } from '@features/sound/sound.repository';
import { Effect, Layer } from 'effect';
import { soundTable } from '@features/sound/sound.model';
import { eq, or } from 'drizzle-orm';
import { NotFoundError } from '@shared/error-handling/error-handling.errors';

export const SoundRepositoryLive = Layer.effect(
  SoundRepository,
  Effect.map(StorageService, (storageService) => ({
    create: ({ file, ...newSound }) => {
      return storageService.putFile(file).pipe(
        Effect.flatMap(({ id }) => {
          return Effect.tryPromise({
            try: () => {
              return database
                .insert(soundTable)
                .values({ ...newSound, fileId: id })
                .returning()
                .execute();
            },
            catch: (error) => {
              return storageService.deleteFile(id).pipe(
                Effect.flatMap(() => invokeDatabaseError(error)),
                Effect.runSync,
              );
            },
          });
        }),
        Effect.flatMap(([sound]) => {
          return sound ? Effect.succeed(sound) : Effect.fail(new NotFoundError({ message: 'Sound was not found' }));
        }),
        Effect.flatMap(({ fileId, ...sound }) => {
          return storageService.getSignedFileUrl(fileId).pipe(Effect.map(({ url }) => ({ ...sound, fileUrl: url })));
        }),
      );
    },
    getAll: ({ author, name }) => {
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
              return storageService
                .getSignedFileUrl(fileId)
                .pipe(Effect.map(({ url }) => ({ ...sound, fileUrl: url })));
            }),
          );
        }),
      );
    },
  })),
);
