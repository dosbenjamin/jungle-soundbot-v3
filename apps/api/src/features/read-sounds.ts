import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { selectSoundSchema, getSounds } from '@entities';

const handler = new OpenAPIHono();

export const readSoundsHandler = handler.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Sounds'],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: selectSoundSchema.array().openapi('SoundCollectionResponse'),
          },
        },
        description: 'Get all sounds',
      },
    },
  }),
  async (context) => {
    const sounds = await getSounds();
    return context.jsonT(sounds);
  },
);
