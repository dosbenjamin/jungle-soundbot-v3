import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { HelloQuerySchema } from './hello.schemas';
import { StatusCode, StatusCodeDescription } from '@shared/status-codes/status-codes.constants';

export const helloRouter = new OpenAPIHono().openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Hello'],
    responses: {
      [StatusCode.Ok]: {
        content: {
          'application/json': {
            schema: HelloQuerySchema,
          },
        },
        description: StatusCodeDescription.Ok,
      },
    },
  }),
  (context) => context.json({ say: 'hello!' }),
);
