import { getBufferStringById } from '@features/files/files.repository';
import { BufferStringQuerySchema } from '@features/files/files.schemas';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { ErrorSchema } from '@shared/errors/errors.schemas';

const router = new OpenAPIHono();

export const filesRouter = router.openapi(
  createRoute({
    method: 'get',
    path: '/:id/buffer',
    tags: ['Files'],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: BufferStringQuerySchema.openapi('BufferResponse'),
          },
        },
        description: 'A single file buffer',
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
    const buffer = await getBufferStringById(context.req.valid('param').id);
    return buffer
      ? context.jsonT(buffer)
      : context.jsonT(
          {
            code: 404,
            error: 'The requested buffer was not found',
          },
          404,
        );
  },
);
