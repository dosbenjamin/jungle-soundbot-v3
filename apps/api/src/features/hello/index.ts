import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

const router = new OpenAPIHono();

export const routes = router.openapi(
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
              .openapi('HelloResponse'),
          },
        },
        description: 'Say hello',
      },
    },
  }),
  (context) => context.jsonT({ say: 'hello!' }),
);
