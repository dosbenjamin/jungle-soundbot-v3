import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { ErrorSchema } from '@shared/errors/errors.schemas';
import { FileSchema } from '@shared/files/files.schemas';
import { SoundFilterSchema, SoundMutationSchema, SoundQuerySchema } from './sounds.schemas';
import { getSounds, createSound } from './sounds.repository';

const router = new OpenAPIHono();

export const soundsRouter = router
  .openapi(
    createRoute({
      method: 'get',
      path: '/',
      tags: ['Sounds'],
      request: {
        query: SoundFilterSchema,
      },
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
      const sounds = await getSounds(context.req.valid('query'));
      return context.jsonT(sounds);
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
