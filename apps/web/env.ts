import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  client: {
    PUBLIC_API_URL: z.string().url(),
  },
  clientPrefix: 'PUBLIC_',
  runtimeEnv: process.env,
});
