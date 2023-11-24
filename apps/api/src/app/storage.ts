import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '@env';

const s3 = new S3Client({
  region: 'auto',
  endpoint: env.S3_URL,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

type UploadedFile = {
  id: string;
};

export const putFile = async (blob: Blob): Promise<UploadedFile> => {
  const id = crypto.randomUUID();
  const buffer = Buffer.from(await blob.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: id,
      Body: buffer,
      ContentType: blob.type,
    }),
  );

  return { id };
};

type SignedUploadedFile = UploadedFile & {
  url: string;
};

export const getSignedFileUrl = async (id: string): Promise<SignedUploadedFile> => {
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: id,
    }),
  );

  return { id, url };
};
