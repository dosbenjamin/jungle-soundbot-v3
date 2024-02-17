import { StorageErrorInvokationOptions } from '@app/storage/storage.types';
import { StorageError, StorageErrorCode } from './storage.errors';
import { StorageService } from './storage.service';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@env';
import { Effect, Layer } from 'effect';

export const StorageServiceLive = Layer.sync(StorageService, () => {
  const client = new S3Client({
    region: 'auto',
    endpoint: env.S3_URL,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });

  const invokeError = (error: unknown, { errorCode, defaultMessage }: StorageErrorInvokationOptions): StorageError => {
    return new StorageError({
      errorCode: errorCode,
      message: error instanceof S3ServiceException ? error.message : defaultMessage,
    });
  };

  return {
    putFile: (blob) => {
      return Effect.tryPromise({
        try: () => blob.arrayBuffer(),
        catch: () => {
          return new StorageError({
            errorCode: StorageErrorCode.BlobToArrayBufferConversion,
            message: 'An error has occurred during blob to array buffer conversion',
          });
        },
      }).pipe(
        Effect.tryMapPromise({
          try: async (arrayBuffer) => {
            const id = crypto.randomUUID();

            await client.send(
              new PutObjectCommand({
                Bucket: env.S3_BUCKET,
                Key: id,
                Body: Buffer.from(arrayBuffer),
                ContentType: blob.type,
              }),
            );

            return { id };
          },
          catch: (error) => {
            return invokeError(error, {
              errorCode: StorageErrorCode.UploadToS3Bucket,
              defaultMessage: 'An error has occurred while uploading to S3 bucket',
            });
          },
        }),
      );
    },
    deleteFile: (id) => {
      return Effect.tryPromise({
        try: async () => {
          await client.send(
            new DeleteObjectCommand({
              Bucket: env.S3_BUCKET,
              Key: id,
            }),
          );

          return Effect.succeedNone;
        },
        catch: (error) => {
          return invokeError(error, {
            errorCode: StorageErrorCode.DeleteFromS3Bucket,
            defaultMessage: 'An error has occurred while deleting from S3 bucket',
          });
        },
      });
    },
    getSignedFileUrl: (id) => {
      return Effect.tryPromise({
        try: async () => {
          const url = await getSignedUrl(
            client,
            new GetObjectCommand({
              Bucket: env.S3_BUCKET,
              Key: id,
            }),
          );

          return { id, url };
        },
        catch: (error) => {
          return invokeError(error, {
            errorCode: StorageErrorCode.GetS3SignedUrl,
            defaultMessage: 'An error has occurred during S3 file url signature',
          });
        },
      });
    },
  };
});
