import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from '@env';
import { soundsRouter } from '@features/sound/sound.router';
export { SoundMutationSchema } from '@features/sound/sound.schemas';
import { helloRouter } from '@features/hello/hello.router';
import { injectDrizzleProvider } from '@providers/drizzle/drizzle.middleware';

const router = new OpenAPIHono();

const app = router
  .use('*', cors({ origin: [env.WEB_APP_URL] }))
  .use('*', injectDrizzleProvider())
  .get('/swagger', swaggerUI({ url: '/doc' }))
  .route('/hello', helloRouter)
  .route('/sounds', soundsRouter);

router.doc31('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'Junglebot API',
    version: 'v3',
  },
});

export default router;
export type AppType = typeof app;
