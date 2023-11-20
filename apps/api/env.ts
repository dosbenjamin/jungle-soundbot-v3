import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    WEB_APP_URL: z.string().url(),
    DATABASE_URL: z.string(),
    S3_URL: z.string().url(),
    S3_BUCKET: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
  },
  runtimeEnv: process.env,
});
