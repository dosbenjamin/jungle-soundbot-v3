import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: './src/**/*.model.ts',
  out: './drizzle',
  driver: 'd1',
};

export default config;
