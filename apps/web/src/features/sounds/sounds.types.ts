import type { InferResponseType } from 'hono';
import type { api } from '@providers/api/api.client';

export type SoundCollectionResponse = InferResponseType<typeof api.sounds.$get>;
