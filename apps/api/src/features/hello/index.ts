import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

export const route = new OpenAPIHono();

route.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Hello'],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z
              .object({
                say: z.string().min(1),
              })
              .openapi('SayHelloResponse'),
          },
        },
        description: 'Say hello',
      },
    },
  }),
  (context) => context.jsonT({ say: 'hello!' }),
);
