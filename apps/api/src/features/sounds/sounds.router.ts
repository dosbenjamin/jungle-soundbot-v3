import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { ErrorSchema } from '@shared/errors/errors.schemas';
import { FileSchema } from '@shared/files/files.schemas';
import { SoundMutationSchema, SoundQuerySchema } from './sounds.schemas';
import { getSoundByName, getSounds, createSound } from './sounds.repository';

const router = new OpenAPIHono();

export const soundsRouter = router
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
              schema: SoundMutationSchema.extend({
                file: FileSchema.openapi({
                  type: 'string',
                  format: 'binary',
                }),
              }).openapi('SoundRequest', {
                required: ['command', 'author', 'file'],
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
        404: {
          content: {
            'application/json': {
              schema: ErrorSchema,
            },
          },
          description: 'The requested sound was not found',
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
