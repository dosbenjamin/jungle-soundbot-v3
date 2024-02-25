import { Data } from 'effect';

export const DrizzleErrorCode = {
  DrizzleError: 'Drizzle.DrizzleError',
  UnknownError: 'Drizzle.UnknownError',
} as const;
export type DrizzleErrorCode = (typeof DrizzleErrorCode)[keyof typeof DrizzleErrorCode];

export class DrizzleError extends Data.TaggedError('DrizzleError')<{
  errorCode: DrizzleErrorCode;
  message: string;
}> {}
