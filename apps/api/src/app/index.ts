import { env } from '@env';
import { Hello } from '../features';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';

export const router = new OpenAPIHono();
export type APIRoutes = typeof routes;

const routes = router
  .use('*', cors({ origin: [env.WEB_APP_URL] }))
  .get('/swagger', swaggerUI({ url: '/doc' }))
  .route('/hello', Hello.routes);

router.doc31('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'Junglebot API',
    version: 'v3',
  },
});
