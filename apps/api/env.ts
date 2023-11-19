import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    WEB_APP_URL: z.string().url(),
    DATABASE_URL: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_FOLDER_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
  },
  runtimeEnv: process.env,
});
