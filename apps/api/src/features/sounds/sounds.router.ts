import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import {
  SoundBadRequestErrorSchema,
  SoundCollectionQuerySchema,
  SoundFilterSchema,
  SoundMutationSchema,
  SoundQuerySchema,
} from './sounds.schemas';
import { getSounds } from './sounds.repository';
import { createUniqueSound } from './sounds.services';
import { Effect, pipe } from 'effect';
import { StatusCode, StatusCodeDescription } from '@shared/status-codes/status-codes.constants';
import { InternalServerErrorSchema, NotFoundErrorSchema } from '@shared/error-handling/error-handling.schemas';

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
              schema: SoundCollectionQuerySchema,
            },
          },
          description: StatusCodeDescription.Ok,
        },
        [StatusCode.InternalServerError]: {
          content: {
            'application/json': {
              schema: InternalServerErrorSchema,
            },
          },
          description: StatusCodeDescription.InternalServerError,
        },
      },
    }),
    (context) => {
      return Effect.runPromise(
        pipe(
          getSounds(context.req.valid('query')),
          Effect.map((sounds) => context.jsonT(sounds)),
          Effect.catchAll(({ errorCode, message }) => {
            return Effect.succeed(
              context.jsonT(
                {
                  statusCode: StatusCode.InternalServerError,
                  errorCode,
                  message,
                },
                StatusCode.InternalServerError,
              ),
            );
          }),
        ),
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
              schema: SoundMutationSchema,
            },
          },
        },
      },
      responses: {
        [StatusCode.Ok]: {
          content: {
            'application/json': {
              schema: SoundQuerySchema,
            },
          },
          description: StatusCodeDescription.Ok,
        },
        [StatusCode.BadRequest]: {
          content: {
            'application/json': {
              schema: SoundBadRequestErrorSchema,
            },
          },
          description: StatusCodeDescription.BadRequest,
        },
        [StatusCode.NotFound]: {
          content: {
            'application/json': {
              schema: NotFoundErrorSchema,
            },
          },
          description: StatusCodeDescription.NotFound,
        },
        [StatusCode.InternalServerError]: {
          content: {
            'application/json': {
              schema: InternalServerErrorSchema,
            },
          },
          description: StatusCodeDescription.InternalServerError,
        },
      },
    }),
    (context) => {
      return Effect.runPromise(
        pipe(
          createUniqueSound(context.req.valid('form')),
          Effect.map((sound) => context.jsonT(sound)),
          Effect.catchTags({
            BusinessError: ({ errorCode, message }) => {
              return Effect.succeed(
                context.jsonT(
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
                context.jsonT(
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
              context.jsonT(
                {
                  statusCode: StatusCode.InternalServerError,
                  errorCode,
                  message,
                },
                StatusCode.InternalServerError,
              ),
            );
          }),
        ),
      );
    },
  );
