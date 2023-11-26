import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, PutObjectCommand, S3Client, S3ServiceException } from '@aws-sdk/client-s3';
import { env } from '@env';
import { Effect, pipe } from 'effect';
import { StorageError, StorageErrorCode } from './storage.errors';

const s3 = new S3Client({
  region: 'auto',
  endpoint: env.S3_URL,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

type StorageErrorInvokationOptions = {
  errorCode: StorageErrorCode;
  defaultMessage: string;
};

const invokeStorageError = (
  error: unknown,
  { errorCode, defaultMessage }: StorageErrorInvokationOptions,
): StorageError => {
  if (error instanceof S3ServiceException) {
    return new StorageError({
      errorCode: errorCode,
      message: error.message,
    });
  }

  return new StorageError({
    errorCode: errorCode,
    message: defaultMessage,
  });
};

type UploadedFile = {
  id: string;
};

export const putFile = (blob: Blob): Effect.Effect<never, StorageError, UploadedFile> => {
  return pipe(
    Effect.tryPromise({
      try: () => blob.arrayBuffer(),
      catch: () => {
        return new StorageError({
          errorCode: StorageErrorCode.BlobToArrayBufferConversion,
          message: 'An error has occurred during blob to array buffer conversion',
        });
      },
    }),
    Effect.tryMapPromise({
      try: async (arrayBuffer) => {
        const id = crypto.randomUUID();

        await s3.send(
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
        return invokeStorageError(error, {
          errorCode: StorageErrorCode.UploadToS3Bucket,
          defaultMessage: 'An error has occurred during upload to S3 bucket',
        });
      },
    }),
  );
};

type SignedUploadedFile = UploadedFile & {
  url: string;
};

export const getSignedFileUrl = (id: string): Effect.Effect<never, StorageError, SignedUploadedFile> => {
  return Effect.tryPromise({
    try: async () => {
      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: id,
        }),
      );

      return { id, url };
    },
    catch: (error) => {
      return invokeStorageError(error, {
        errorCode: StorageErrorCode.GetS3SignedUrl,
        defaultMessage: 'An error has occurred during S3 file url signature',
      });
    },
  });
};
