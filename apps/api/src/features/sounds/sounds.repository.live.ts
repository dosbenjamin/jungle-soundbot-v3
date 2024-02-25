import { Effect, Layer } from 'effect';
import { SoundRepository } from './sounds.repository';
import { soundsTable } from './sounds.model';
import { eq, or } from 'drizzle-orm';
import { NotFoundError } from '@shared/error-handling/error-handling.errors';
import { DrizzleProvider } from '@providers/drizzle/drizzle.provider';
import { StorageProvider } from '@providers/storage/storage.provider';

export const SoundRepositoryLive = Layer.effect(
  SoundRepository,
  Effect.all([StorageProvider, DrizzleProvider]).pipe(
    Effect.map(([storageProvider, drizzleProvider]) => {
      const database = Effect.runSync(drizzleProvider.getDatabase());

      return SoundRepository.of({
        create: ({ file, ...newSound }) => {
          return storageProvider.putFile(file).pipe(
            Effect.flatMap(({ id }) => {
              return Effect.tryPromise({
                try: () => {
                  return database
                    .insert(soundsTable)
                    .values({ ...newSound, fileId: id })
                    .returning()
                    .execute();
                },
                catch: (error) => {
                  return storageProvider.deleteFile(id).pipe(
                    Effect.flatMap(() => drizzleProvider.invokeError(error)),
                    Effect.runSync,
                  );
                },
              });
            }),
            Effect.flatMap(([sound]) => {
              return sound ? Effect.succeed(sound) : Effect.fail(new NotFoundError({ message: 'Sound was not found' }));
            }),
            Effect.flatMap(({ fileId, ...sound }) => {
              return storageProvider.getFileUrl(fileId).pipe(Effect.map((url) => ({ ...sound, fileUrl: url })));
            }),
          );
        },
        getAll: ({ author, name }) => {
          return Effect.tryPromise({
            try: () => {
              return database
                .select()
                .from(soundsTable)
                .where(
                  or(
                    name ? eq(soundsTable.name, name) : undefined,
                    author ? eq(soundsTable.author, author) : undefined,
                  ),
                )
                .execute();
            },
            catch: (error) => drizzleProvider.invokeError(error),
          }).pipe(
            Effect.flatMap((sounds) => {
              return Effect.all(
                sounds.map(({ fileId, ...sound }) => {
                  return storageProvider.getFileUrl(fileId).pipe(Effect.map((url) => ({ ...sound, fileUrl: url })));
                }),
              );
            }),
          );
        },
      });
    }),
  ),
);
