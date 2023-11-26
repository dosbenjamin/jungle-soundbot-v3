import { Data } from 'effect';

export const DatabaseErrorCode = {
  DrizzleError: 'Database.DrizzleError',
  UnknownError: 'Database.UnknownError',
} as const;
export type DatabaseErrorCode = (typeof DatabaseErrorCode)[keyof typeof DatabaseErrorCode];

export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  errorCode: DatabaseErrorCode;
  message: string;
}> {}
