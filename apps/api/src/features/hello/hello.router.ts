import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

const router = new OpenAPIHono();

export const helloRouter = router.openapi(
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
                say: z.string(),
              })
              .openapi('HelloResponse'),
          },
        },
        description: 'Say hello',
      },
    },
  }),
  (context) => context.jsonT({ say: 'hello!' }),
);
