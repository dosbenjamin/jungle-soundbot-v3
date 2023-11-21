import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { HelloQuerySchema } from './hello.schemas';

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
            schema: HelloQuerySchema.openapi('HelloResponse'),
          },
        },
        description: 'Say hello',
      },
    },
  }),
  (context) => context.jsonT({ say: 'hello!' }),
);
