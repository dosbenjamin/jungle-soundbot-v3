import { NewSound, Sound, SoundFilter } from './sounds.schemas';
import { soundsTable } from './sounds.model';
import { eq, or } from 'drizzle-orm';
import { Effect, pipe } from 'effect';
import { NotFoundError } from '@shared/error-handling/error-handling.errors';
import { StorageError } from '@app/storage/storage.errors';
import { DatabaseError } from '@app/database/database.errors';
import { getSignedFileUrl, putFile } from '@app/storage/storage.services';
import { database, invokeDatabaseError } from '@app/database/database.services';

export const getSounds = ({
  name,
  author,
}: SoundFilter): Effect.Effect<never, DatabaseError | StorageError, Sound[]> => {
  return pipe(
    Effect.tryPromise({
      try: () => {
        return database
          .select()
          .from(soundsTable)
          .where(or(name ? eq(soundsTable.name, name) : undefined, author ? eq(soundsTable.author, author) : undefined))
          .execute();
      },
      catch: (error) => invokeDatabaseError(error),
    }),
    Effect.flatMap((sounds) => {
      return Effect.all(
        sounds.map(({ fileId, ...sound }) => {
          return pipe(
            getSignedFileUrl(fileId),
            Effect.map(({ url }) => ({ ...sound, fileUrl: url })),
          );
        }),
      );
    }),
  );
};

export const createSound = ({
  file,
  ...newSound
}: NewSound): Effect.Effect<never, DatabaseError | StorageError | NotFoundError, Sound> => {
  return pipe(
    putFile(file),
    Effect.tryMapPromise({
      try: ({ id }) => {
        return database
          .insert(soundsTable)
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
      return pipe(
        getSignedFileUrl(fileId),
        Effect.map(({ url }) => ({ ...sound, fileUrl: url })),
      );
    }),
  );
};
