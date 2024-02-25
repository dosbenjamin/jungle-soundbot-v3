type Bindings = {
  bucket: R2Bucket;
  database: D1Database;
  WEB_APP_URL: string;
  R2_URL: string;
};

export type Env = {
  Bindings: Bindings;
};
