import './env';
import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import pandacss from '@pandacss/astro';

export default defineConfig({
  integrations: [solid(), pandacss()],
});
