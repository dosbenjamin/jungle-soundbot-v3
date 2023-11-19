import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { selectSoundSchema, getSoundById } from '@entities';

const handler = new OpenAPIHono();

export const readSoundHandler = handler.openapi(
  createRoute({
    method: 'get',
    path: '/:id',
    tags: ['Sounds'],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: selectSoundSchema.openapi('SoundResponse'),
          },
        },
        description: 'Get one sound',
      },
      404: {
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
        description: 'Sound not found',
      },
    },
  }),
  async (context) => {
    const sound = await getSoundById(context.req.param('id'));

    if (!sound) {
      return context.jsonT(
        {
          error: 'Sound not found',
        },
        404,
      );
    }

    return context.jsonT(sound);
  },
);
