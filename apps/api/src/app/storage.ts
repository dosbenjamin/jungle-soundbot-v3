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
  blob: Blob;
  buffer: Buffer;
};

export const uploadFile = async (blob: Blob): Promise<UploadedFile> => {
  const id = crypto.randomUUID();
  const buffer = Buffer.from(await blob.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: id,
      Body: buffer,
    }),
  );

  return { id, blob, buffer };
};

export const downloadFile = async (id: string): Promise<UploadedFile | undefined> => {
  const { Body: body } = await s3.send(
    new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: id,
    }),
  );

  const buffer = body && Buffer.from(await body.transformToByteArray());
  return buffer ? { id, blob: new Blob([buffer]), buffer } : undefined;
};
