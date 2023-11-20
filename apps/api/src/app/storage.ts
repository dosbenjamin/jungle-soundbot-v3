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

export type UploadedFile = {
  id: string;
  body: string | undefined;
};

export const uploadFile = async (file: Blob): Promise<UploadedFile> => {
  const id = crypto.randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: id,
      Body: buffer,
    }),
  );

  return { id, body: buffer.toString() };
};

export const downloadFile = async (id: string): Promise<UploadedFile> => {
  const { Body: body } = await s3.send(
    new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: id,
    }),
  );

  return { id, body: await body?.transformToString() };
};
