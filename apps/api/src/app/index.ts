import { hello } from '@features';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

export const app = new OpenAPIHono();

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Junglebot API',
    version: '1.0.0',
  },
});
app.get('/swagger', swaggerUI({ url: '/doc' }));

app.route('/', hello.route);
