import { hc } from 'hono/client';
import { API } from '@api';
import { createResource } from 'solid-js';
import { env } from './env';

const api = hc<API>(env.VITE_API_URL);

export const App = () => {
  const [hello] = createResource(() => api.hello.$get().then((response) => response.json()));
  return <h1>Junglebot say: {hello()?.say}</h1>;
};
