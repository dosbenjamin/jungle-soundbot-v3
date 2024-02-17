import { env } from '@env';
import type { AppType } from '@api';
import { hc } from 'hono/client';

export const api = hc<AppType>(env.PUBLIC_API_URL);
