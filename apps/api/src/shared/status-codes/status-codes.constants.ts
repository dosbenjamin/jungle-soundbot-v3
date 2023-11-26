export const StatusCode = {
  Ok: 200,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
} as const;

export const StatusCodeDescription = {
  Ok: 'OK',
  BadRequest: 'Bad Request',
  NotFound: 'Not Found',
  InternalServerError: 'Internal Server Error',
} as const;
