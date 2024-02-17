import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import {
  SoundBadRequestErrorResponseSchema,
  SoundCollectionQuerySchema,
  SoundFilterSchema,
  SoundMutationSchema,
  SoundQuerySchema,
} from './sound.schemas';
import { Effect, Layer } from 'effect';
import { StatusCode, StatusCodeDescription } from '@shared/status-codes/status-codes.constants';
import { InternalServerErrorResponseSchema, NotFoundErrorResponseSchema } from '@shared/responses/responses.schemas';
import { SoundServiceLive } from './sound.service.live';
import { SoundService } from './sound.service';
import { OkResponseSchema } from '@shared/responses/responses.schemas';
import { SoundRepositoryLive } from '@features/sound/sound.repository.live';
import { StorageServiceLive } from '@app/storage/storage.service.live';

export const soundsRouter = new OpenAPIHono()
  .openapi(
    createRoute({
      method: 'get',
      path: '/',
      tags: ['Sounds'],
      request: {
        query: SoundFilterSchema,
      },
      responses: {
        [StatusCode.Ok]: {
          content: {
            'application/json': {
              schema: OkResponseSchema.extend({
                data: SoundCollectionQuerySchema,
              }),
            },
          },
          description: StatusCodeDescription.Ok,
        },
        [StatusCode.InternalServerError]: {
          content: {
            'application/json': {
              schema: InternalServerErrorResponseSchema,
            },
          },
          description: StatusCodeDescription.InternalServerError,
        },
      },
    }),
    (context) => {
      const MainLive = SoundServiceLive.pipe(Layer.provide(SoundRepositoryLive), Layer.provide(StorageServiceLive));

      const program = SoundService.pipe(
        Effect.flatMap((soundService) => soundService.getAll(context.req.valid('query'))),
        Effect.map((sounds) => {
          return context.json(
            {
              statusCode: StatusCode.Ok,
              data: sounds,
            },
            StatusCode.Ok,
          );
        }),
        Effect.catchAll(({ errorCode, message }) => {
          return Effect.succeed(
            context.json(
              {
                statusCode: StatusCode.InternalServerError,
                errorCode,
                message,
              },
              StatusCode.InternalServerError,
            ),
          );
        }),
      );

      const runnable = Effect.provide(program, MainLive);
      return Effect.runPromise(runnable);
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
              schema: SoundMutationSchema,
            },
          },
        },
      },
      responses: {
        [StatusCode.Ok]: {
          content: {
            'application/json': {
              schema: OkResponseSchema.extend({
                data: SoundQuerySchema,
              }),
            },
          },
          description: StatusCodeDescription.Ok,
        },
        [StatusCode.BadRequest]: {
          content: {
            'application/json': {
              schema: SoundBadRequestErrorResponseSchema,
            },
          },
          description: StatusCodeDescription.BadRequest,
        },
        [StatusCode.NotFound]: {
          content: {
            'application/json': {
              schema: NotFoundErrorResponseSchema,
            },
          },
          description: StatusCodeDescription.NotFound,
        },
        [StatusCode.InternalServerError]: {
          content: {
            'application/json': {
              schema: InternalServerErrorResponseSchema,
            },
          },
          description: StatusCodeDescription.InternalServerError,
        },
      },
    }),
    (context) => {
      const MainLive = SoundServiceLive.pipe(Layer.provide(SoundRepositoryLive), Layer.provide(StorageServiceLive));

      const program = SoundService.pipe(
        Effect.flatMap((soundService) => soundService.create(context.req.valid('form'))),
        Effect.map((sound) => {
          return context.json(
            {
              statusCode: StatusCode.Ok,
              data: sound,
            },
            StatusCode.Ok,
          );
        }),
        Effect.catchTags({
          BusinessError: ({ errorCode, message }) => {
            return Effect.succeed(
              context.json(
                {
                  statusCode: StatusCode.BadRequest,
                  errorCode,
                  message,
                },
                StatusCode.BadRequest,
              ),
            );
          },
          NotFoundError: ({ errorCode, message }) => {
            return Effect.succeed(
              context.json(
                {
                  statusCode: StatusCode.NotFound,
                  errorCode,
                  message,
                },
                StatusCode.NotFound,
              ),
            );
          },
        }),
        Effect.catchAll(({ errorCode, message }) => {
          return Effect.succeed(
            context.json(
              {
                statusCode: StatusCode.InternalServerError,
                errorCode,
                message,
              },
              StatusCode.InternalServerError,
            ),
          );
        }),
      );

      const runnable = Effect.provide(program, MainLive);
      return Effect.runPromise(runnable);
    },
  );
