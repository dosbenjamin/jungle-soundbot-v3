import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from '@env';
import { soundsRoutes } from '../features/sounds/sounds.routes';
import { helloRoutes } from '../features/hello/hello.routes';

export const router = new OpenAPIHono();
export type APIRoutes = typeof routes;

const routes = router
  .use('*', cors({ origin: [env.WEB_APP_URL] }))
  .get('/swagger', swaggerUI({ url: '/doc' }))
  .route('/hello', helloRoutes)
  .route('/sounds', soundsRoutes);

router.doc31('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'Junglebot API',
    version: 'v3',
  },
});
