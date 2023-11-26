import { DatabaseErrorCode } from '@app/database/database.errors';
import { StorageErrorCode } from '@app/storage/storage.errors';
import { NotFoundErrorCode } from '@shared/error-handling/error-handling.errors';
import { StatusCode } from '@shared/status-codes/status-codes.constants';
import { z } from 'zod';

const ErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  errorCode: z.string(),
});

export const BadRequestErrorSchema = ErrorSchema.extend({
  statusCode: z.literal(StatusCode.BadRequest),
}).openapi('BadRequestErrorResponse');

export const NotFoundErrorSchema = ErrorSchema.extend({
  statusCode: z.literal(StatusCode.NotFound),
  errorCode: z.nativeEnum(NotFoundErrorCode),
}).openapi('NotFoundErrorResponse');

export const InternalServerErrorSchema = ErrorSchema.extend({
  statusCode: z.literal(StatusCode.InternalServerError),
  errorCode: z.nativeEnum({
    ...StorageErrorCode,
    ...DatabaseErrorCode,
  }),
}).openapi('InternalServerErrorResponse');
