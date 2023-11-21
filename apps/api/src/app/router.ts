import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { OpenAPIHono } from '@hono/zod-openapi';
import { env } from '@env';
import { soundsRouter } from '../features/sounds/sounds.router';
import { helloRouter } from '../features/hello/hello.router';
import { filesRouter } from '../features/files/files.router';

export const router = new OpenAPIHono();
export type API = typeof api;

const api = router
  .use('*', cors({ origin: [env.WEB_APP_URL] }))
  .get('/swagger', swaggerUI({ url: '/doc' }))
  .route('/hello', helloRouter)
  .route('/sounds', soundsRouter)
  .route('/files', filesRouter);

router.doc31('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'Junglebot API',
    version: 'v3',
  },
});
