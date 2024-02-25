import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { OpenAPIHono } from '@hono/zod-openapi';
import { soundsRouter } from '@features/sounds/sounds.router';
import { helloRouter } from '@features/hello/hello.router';
import { injectDrizzleProvider } from '@providers/drizzle/drizzle.middleware';
import { injectEnvironmentProvider } from '@providers/environment/environment.middleware';
import type { Env } from '@shared/env/env.types';

const router = new OpenAPIHono<Env>();
const app = router
  .use('*', (context, next) => cors({ origin: [context.env.WEB_APP_URL] })(context, next))
  .use('*', injectEnvironmentProvider())
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
export { SoundMutationSchema } from '@features/sounds/sounds.schemas';
