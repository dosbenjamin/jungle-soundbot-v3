import { StorageError, StorageErrorCode } from './storage.errors';
import { StorageProvider } from './storage.provider';
import { Effect, Layer } from 'effect';
import { EnvironmentProvider } from '@providers/environment/environment.provider';

export const StorageProviderLive = Layer.effect(
  StorageProvider,
  Effect.map(EnvironmentProvider, ({ env: { R2_URL, bucket } }) => ({
    putFile: (blob) => {
      return Effect.tryPromise({
        try: async () => {
          const id = crypto.randomUUID();
          await bucket.put(id, blob);
          return { id };
        },
        catch: () => {
          return new StorageError({
            errorCode: StorageErrorCode.UploadToS3Bucket,
            message: 'An error has occurred while uploading to S3 bucket',
          });
        },
      });
    },
    deleteFile: (id) => {
      return Effect.tryPromise({
        try: () => bucket.delete(id),
        catch: () => {
          return new StorageError({
            errorCode: StorageErrorCode.DeleteFromS3Bucket,
            message: 'An error has occurred while deleting from S3 bucket',
          });
        },
      });
    },
    getFileUrl: (id) => {
      const url = new URL(id, R2_URL);
      return Effect.succeed(url.toString());
    },
  })),
);
