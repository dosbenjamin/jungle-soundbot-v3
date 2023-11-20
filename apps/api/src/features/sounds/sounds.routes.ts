import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { ErrorSchema } from '@shared/errors/errors.schema';
import { SoundMutationSchema, SoundQuerySchema } from './sounds.schema';
import { getSoundByName, getSounds } from './sounds.queries';
import { createSound } from './sounds.mutations';

const router = new OpenAPIHono();

export const soundsRoutes = router
  .openapi(
    createRoute({
      method: 'get',
      path: '/',
      tags: ['Sounds'],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: SoundQuerySchema.array().openapi('SoundCollectionResponse'),
            },
          },
          description: 'All sounds',
        },
      },
    }),
    async (context) => {
      const sounds = await getSounds();
      return context.jsonT(sounds);
    },
  )
  .openapi(
    createRoute({
      method: 'get',
      path: '/:name',
      tags: ['Sounds'],
      request: {
        params: z.object({
          name: z.string(),
        }),
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: SoundQuerySchema.openapi('SoundResponse'),
            },
          },
          description: 'A single sound',
        },
        404: {
          content: {
            'application/json': {
              schema: ErrorSchema,
            },
          },
          description: 'Not found error',
        },
      },
    }),
    async (context) => {
      const sound = await getSoundByName(context.req.valid('param').name);
      return sound
        ? context.jsonT(sound)
        : context.jsonT(
            {
              code: 404,
              error: 'The requested sound was not found',
            },
            404,
          );
    },
  )
  .openapi(
    createRoute({
      method: 'post',
      path: '/',
      tags: ['Sounds'],
      request: {
        body: {
          content: {
            'multipart/form-data': {
              schema: SoundMutationSchema.openapi('SoundRequest', {
                properties: {
                  name: {
                    type: 'string',
                  },
                  author: {
                    type: 'string',
                  },
                  file: {
                    type: 'string',
                    format: 'binary',
                  },
                },
                required: ['name', 'author', 'file'],
              }),
            },
          },
        },
      },
      responses: {
        200: {
          content: {
            'application/json': {
              schema: SoundQuerySchema.openapi('SoundResponse'),
            },
          },
          description: 'The created sound',
        },
        400: {
          content: {
            'application/json': {
              schema: ErrorSchema,
            },
          },
          description: 'Validation error',
        },
      },
    }),
    async (context) => {
      const sound = await createSound(context.req.valid('form'));
      return sound
        ? context.jsonT(sound)
        : context.jsonT(
            {
              code: 404,
              error: 'The requested sound was not found',
            },
            404,
          );
    },
  );
