import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Jungle Soundbot'));

export default app;
